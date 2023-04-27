import type { Transform } from 'stream';
import { Readable } from 'stream';
import fs from 'vinyl-fs';
import fetch from 'node-fetch';

import File from 'vinyl';
import pkg from '../../package.json';
import formatter from '../formatter';
import {
    mapStream,
    buildPattern,
    format
} from '../util';
import ignored from '../ignored';
import jsLinter from '../js/linter';
import cssLinter from '../css/linter';
import htmlLinter from '../html/linter';
import mpxmlLinter from '../mpxml/linter';
import markdownLinter from '../markdown/linter';
import { ciReport } from '../reporter/ci';
import console from '../console';
import { getLog } from '../log';
import { get as getReporter } from '../reporter';
import type { CliOptions, LintError, LintFile } from '../types';

/**
 * 不同的输入流处理
 *
 * @namespace
 */
const streams = {

    /**
     * 处理文件系统中的代码
     *
     * @param {Object} options yargs 处理后的 cli 参数
     * @return {Transform} 转换流
     */
    files(options: CliOptions): Transform {
        const patterns = buildPattern(options._ as string[], options.type);

        return this.check(
            fs
                .src(patterns, { cwdbase: true, allowEmpty: true, stripBOM: false })
                .pipe(ignored(options)),
            options
        );
    },

    /**
     * 处理从 stdin 输入的代码
     *
     * @param {Object} options yargs 处理后的 cli 参数
     * @return {Transform} 转换流
     */
    stdin(options: CliOptions): Transform | NodeJS.ReadableStream {
        return this.scriptStream(process.stdin, options);
    },

    /**
     * 处理以 string 形式输入的代码
     *
     * @param {Stream} string 代码字符串
     * @param {Object} options yargs 处理后的 cli 参数
     * @return {Transform} 转换流
     */
    string(string: string, options: CliOptions, url: string): Transform | NodeJS.ReadableStream {
        const scriptStream = new Readable();
        // eslint-disable-next-line no-underscore-dangle
        scriptStream._read = function read() {
            this.push(string);
            this.push(null);
        };

        return this.scriptStream(scriptStream, options, url);
    },

    /**
     * 处理以字符串流形式输入的代码
     *
     * @param {Stream} scriptStream 代码字符串流
     * @param {Object} options yargs 处理后的 cli 参数
     * @param {string?} [url=''] 内容 URL
     * @return {Transform} 转换流
     */
    scriptStream(
        scriptStream: NodeJS.ReadableStream,
        options: CliOptions,
        url = ''
    ): Transform | NodeJS.ReadableStream {
        const type = (options.type || 'js').split(',')[0];

        const handlers = {
            js() {
                return jsLinter.exec(options);
            },
            ts() {
                return jsLinter.exec(options);
            },
            wxml() {
                return mpxmlLinter.exec(options);
            },
            wxs() {
                return mpxmlLinter.exec(options);
            },
            axml() {
                return mpxmlLinter.exec(options);
            },
            swan() {
                return mpxmlLinter.exec(options);
            },
            json() {
                return mpxmlLinter.exec(options);
            },
            css() {
                return cssLinter.exec(options);
            },
            stylus() {
                return cssLinter.exec(options);
            },
            less() {
                return cssLinter.exec(options);
            },
            sass() {
                return cssLinter.exec(options);
            },
            scss() {
                return cssLinter.exec(options);
            },
            wxss() {
                return cssLinter.exec(options);
            },
            html() {
                return htmlLinter.exec(options);
            },
            md() {
                return markdownLinter.exec(options);
            },
            markdown() {
                return markdownLinter.exec(options);
            }
        };

        const handler = handlers[type];

        if (!handler) {
            return scriptStream;
        }

        return scriptStream
            .pipe(
                mapStream((chunk, callback) => {
                    const file = new File({
                        path: `${ url ? `${ url }index` : 'current-file' }.${ type }`,
                        // @ts-expect-error
                        contents: chunk,
                        errors: [] as LintError[],
                        // @ts-expect-error
                        stat: { size: chunk.length },
                    });

                    callback(null, file);
                })
            )
            .pipe(handler());

    },

    /**
     * 依次检查流
     *
     * @param {Stream} stream 文件流
     * @param {Object} options yargs 处理后的 cli 参数
     * @return {Transform} 转换流
     */
    check(stream: Transform, options: CliOptions): Transform {
        return stream
            .pipe(jsLinter.exec(options))
            .pipe(cssLinter.exec(options))
            .pipe(htmlLinter.exec(options))
            .pipe(mpxmlLinter.exec(options))
            .pipe(markdownLinter.exec(options));
    },


    /**
     * 根据配置的 options.stream 获取检查后的流
     *
     * @param {Object} options yargs 处理后的 cli 参数
     * @return {Transform} 转换流
     */
    get(options: CliOptions): Transform | Promise<NodeJS.ReadableStream> {
        const { stream, _: [unTypeUrl] } = options;
        const url = unTypeUrl as string;

        if (/^https?:\/\/.+$/.test(url)) {
            options.type = 'html';

            return new Promise((resolve, reject) => {
                let body = '';
                const stringStream = new Readable();
                // eslint-disable-next-line no-underscore-dangle
                stringStream._read = function read() {
                    this.push(body);
                    this.push(null);
                };

                fetch(url)
                    .then(async res => res.text())
                    .then(htmlContent => {
                        body = htmlContent;
                        resolve(this.scriptStream(stringStream, options, url));
                    })
                    .catch(reject);
            });

        }

        options.stream = !!stream;

        if (options.string) {
            return this.string(options.string as string, options, url) as Transform;
        }

        if (typeof stream === 'boolean') {
            return this[stream ? 'stdin' : 'files'](options) as Transform;
        }

        return this.check(stream.pipe(ignored(options)), options);
    }
};


/**
 * check 处理入口
 *
 * @param {Object} options yargs 处理后的 cli 参数
 * @param {Function=} done 处理完成后的回调
 */
export function run(options: CliOptions, done?: (success: boolean, json: LintFile[]) => void) {
    const name = format('%s@%s', pkg.name, pkg.version);
    const reportTime = !options.reporter && options.time;
    const runStartTime = Date.now();
    if (reportTime) {
        console.time(name);
    }

    const log = getLog(options.color);
    const reporter = getReporter(log, options);

    if (!done) {
        done = (success, json) => {
            // 统计 检查耗时，用于结果上报
            const runUsedTime = Date.now() - runStartTime;
            if (reportTime) {
                console.timeEnd(name);
            }

            if (options.format && formatter[options.format]) {
                formatter[options.format](json);
            }

            // ci 上报，统计 代码检查结果
            if (process.env.CI_REPORT_URL) {
                ciReport(success, json, runUsedTime)
                    .finally(() => {
                        process.exit(success ? 0 : 1);
                    });
            }
            else {
                process.exit(success ? 0 : 1);
            }
        };
    }

    const stream = streams.get(options);
    if (stream instanceof Promise) {
        stream.then(stream => {
            stream
                .pipe(reporter)
                .once('done', done!);
        });
    }
    else {
        stream
            .pipe(reporter)
            .once('done', done);
    }
}

export default run;
