import type { Transform } from 'stream';
import fs from 'vinyl-fs';

import { name, version } from '../../package.json';
import {
    buildPattern,
    mapStream,
} from '../util';

import ignored from '../ignored';
import jsFixer from '../js/fixer';
import cssFixer from '../css/fixer';
import htmlFixer from '../html/fixer';
import mpXmlFixer from '../mpxml/fixer';
import markdownFixer from '../markdown/fixer';
import console from '../console';
import type { CliOptions, LintError } from '../types';

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
     * @return {Stream} 转换流
     */
    files(options: CliOptions): NodeJS.ReadWriteStream {
        let {
            _,
            type,
            output = './',
            replace = false
        } = options;

        const patterns = buildPattern(_ as string[], type);

        if (replace || /^\.\/?$/.test(output)) {
            output = './';
        }
        // ignore output path auto
        else {
            patterns.push((`!./${ output }/**`).replace(/\/\.\//, '/'));
        }

        return this.format(
            fs
                .src(patterns, { cwdbase: true, allowEmpty: true })
                .pipe(ignored(options)),
            options
        ).pipe(fs.dest(output));

    },

    /**
     * 处理从 stdin 输入的代码
     *
     * @param {Object} options yargs 处理后的 cli 参数
     * @return {Transform} 转换流
     */
    stdin(options: CliOptions): NodeJS.ReadWriteStream | NodeJS.ReadStream {
        const type = (options.type || 'js').split(',')[0];

        const handlers = {
            js() {
                return jsFixer.exec(options);
            },
            ts() {
                return jsFixer.exec(options);
            },
            wxml() {
                return mpXmlFixer.exec(options);
            },
            wxs() {
                return mpXmlFixer.exec(options);
            },
            axml() {
                return mpXmlFixer.exec(options);
            },
            swan() {
                return mpXmlFixer.exec(options);
            },
            css() {
                return cssFixer.exec(options);
            },
            stylus() {
                return cssFixer.exec(options);
            },
            less() {
                return cssFixer.exec(options);
            },
            sass() {
                return cssFixer.exec(options);
            },
            scss() {
                return cssFixer.exec(options);
            },
            wxss() {
                return cssFixer.exec(options);
            },
            html() {
                return htmlFixer.exec(options);
            },
            md() {
                return markdownFixer.exec(options);
            },
            markdown() {
                return markdownFixer.exec(options);
            }
        };

        const handler = handlers[type];

        if (!handler) {
            return process.stdin;
        }

        return fs.src(__filename)
            .pipe(
                mapStream((file, callback) => {
                    file.path = `current-file.${ type }`;
                    file.contents = process.stdin as NodeJS.ReadStream;
                    file.errors = [] as LintError[];
                    // @ts-expect-error
                    file.stat.size = 0;

                    callback(null, file);
                })
            )
            .pipe(handler())
            .pipe(
                mapStream((file, callback) => {
                    process.stdout.write(`${ file.contents?.toString() }\n`);
                    callback(null, file);
                })
            );
    },

    /**
     * 依次格式化流
     *
     * @param {Stream} stream 文件流
     * @param {Object} options yargs 处理后的 cli 参数
     * @return {Transform} 转换流
     */
    format(stream: Transform, options: CliOptions): Transform {
        return stream
            .pipe(jsFixer.exec(options))
            .pipe(cssFixer.exec(options))
            .pipe(htmlFixer.exec(options))
            .pipe(mpXmlFixer.exec(options))
            .pipe(markdownFixer.exec(options));
    },


    /**
     * 根据配置的 options.stream 获取格式化后的流
     *
     * @param {Object} options yargs 处理后的 cli 参数
     * @return {Transform} 转换流
     */
    get(options: CliOptions): Transform | NodeJS.ReadWriteStream {
        const { stream } = options;
        if (typeof stream === 'boolean') {
            return this[stream ? 'stdin' : 'files'](options);
        }

        return this.format(stream.pipe(ignored(options)), options);
    }
};

/**
 * format 处理入口
 *
 * @param {Object} options yargs 处理后的 cli 参数
 * @param {Function=} done 处理完成后的回调
 * @return {Stream} 转换流
*/
export function run(options: CliOptions, done?: () => void): NodeJS.ReadWriteStream {
    const label = `${ name }@${ version }`;
    if (options.time) {
        console.time(label);
    }

    return streams.get(options)
        .once('end', () => {
            if (options.time) {
                console.timeEnd(label);
            }

            done?.();
        });
}

export default run;
