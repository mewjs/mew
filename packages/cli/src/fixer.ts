import type { Transform } from 'stream';
import type File from 'vinyl';
import type { FixerOptions, CliOptions } from './types';

import {
    buildRegExp,
    mapStream
} from './util';


export default abstract class Fixer {
    options: FixerOptions;
    suffixReg?: RegExp;
    ignoreReg?: RegExp;

    /**
     * Fixer 基类
     *
     * @param {Object} options 配置项
     * @param {string} options.type 文件类型，可选值有 js | css | less | html
     * @param {string} options.name Fixer 的名称，用于错误信息的标识
     * @param {(string|RegExp)} options.suffix 逗号分隔的文件扩展名或能匹配文件的正则
     * @param {(string|RegExp)} ignore 忽略的文件名列表或匹配的正则
     */
    constructor(options: Partial<FixerOptions> = {}) {
        this.options = {
            type: '',
            name: '',
            suffix: '',
            ignore: '',
            ...options
        };
    }

    /**
     * 检查当前文件是否可被格式化
     *
     * @param {module:vinyl} file vinyl 文件对象
     * @return {boolean} 文件符合 suffix 指定的格式，不被 ignore 忽略并且不为空时返回 true，否则为 false
     */
    isValid(file: File): boolean {
        const { options } = this;
        const { path } = file;

        if (!this.suffixReg) {
            this.suffixReg = buildRegExp(options.suffix);
        }

        let result = this.suffixReg.test(path);

        if (options.ignore) {
            this.ignoreReg = this.ignoreReg || buildRegExp(options.ignore);
            result = result && !this.ignoreReg.test(path);
        }

        return result && !file.isNull();
    }

    /**
     * 对文件流执行格式化
     *
     * @param {Object} cliOptions 命令行传来的配置项
     * @return {Stream} through2 的转换流
     */
    exec(options: CliOptions): Transform {
        this.register();

        return mapStream(
            (rawFile, callback) => {
                const file = rawFile as unknown as File;
                if (!this.isValid(file) || file.stat!.size > options.maxSize) {
                    callback(null, rawFile);
                    return;
                }

                // 单个文件检查，被 ignored，直接返回
                if (file.isIgnored) {
                    callback(null, rawFile);
                    return;
                }

                const contents = file.contents?.toString() || '';
                const done = (contents: string) => {
                    file.contents = Buffer.from(contents);
                    callback(null, rawFile);
                };

                // callback style
                if (this.format.length > 3) {
                    return this.format(contents, file.path, options, done);
                }

                const promise = this.format(contents, file.path, options);

                // sync style
                if (typeof promise === 'string') {
                    return done(promise);
                }

                // async style with promise
                promise.then(done, done);
            }
        );
    }

    /**
     * 注册 fixer 额外的规则
     *
     */
    abstract register(): void;

    /**
     * 执行对文件内容的格式化
     *
     * @abstract
     * @param {string} contents 文件内容
     * @param {string} path 文件路径
     * @param {Object} cliOptions 命令行中传过来的配置项
     * @param {Function=} done 出现此参数时，在检查完成需要调用 done
     * @return {string | Promise<string>} 返回格式化后的内容或 Promise 对象
     */
    abstract format(
        contents: string,
        path: string,
        cliOptions: CliOptions,
        done?: (code: string) => void
    ): string | Promise<string>;
}

