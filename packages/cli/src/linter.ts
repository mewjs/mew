import type { Transform } from 'stream';
import type File from 'vinyl';
import type { LinterOptions, CliOptions, LintError } from './types';

import {
    buildRegExp,
    mapStream,
    ignoreError
} from './util';


export default abstract class Linter {
    options: LinterOptions;
    suffixReg?: RegExp;
    ignoreReg?: RegExp;

    /**
     * Linter 基类
     *
     * @constructor
     * @param {Object} options 配置项
     * @param {string} options.type 文件类型，可选值有 js | css | less | html
     * @param {string} options.name Linter 的名称，用于错误信息的标识
     * @param {(string|RegExp)} options.suffix 逗号分隔的文件扩展名或能匹配文件的正则
     * @param {(string|RegExp)} ignore 忽略的文件名列表或匹配的正则
     */
    constructor(options: Partial<LinterOptions> = {}) {
        this.options = {
            type: '',
            name: '',
            suffix: '',
            ignore: '',
            ...options
        };
    }


    /**
     * 检查当前文件是否可被检查
     *
     * @param {File} file vinyl 文件对象
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
     * 对文件流执行检查
     *
     * @param {Object} cliOptions 命令行传来的配置项
     * @return {Transform} through2 的转换流
     */
    exec(cliOptions: CliOptions): Transform {
        return mapStream(
            (file, callback) => {
                const vinylFile = file as unknown as File;
                if (!this.isValid(vinylFile) || vinylFile.stat!.size > cliOptions.maxSize) {
                    callback(null, file);
                    return;
                }

                // 单个文件检查，被 ignored，需要给出提示
                if (file.isIgnored) {
                    file.errors = [ignoreError(/* file.relative */) as LintError];
                    callback(null, file);
                    return;
                }

                const contents = file.contents?.toString() || '';

                const done = (errors: LintError[]) => {
                    file.errors = (file.errors || []).concat(errors);
                    callback(null, file);
                };

                // callback style
                if (this.check.length > 3) {
                    return this.check(contents, file.path, cliOptions, done);
                }

                const promise = this.check(contents, file.path, cliOptions);

                // sync style
                if (Array.isArray(promise)) {
                    return done(promise);
                }

                // async style with promise
                promise.then(done, done);
            }
        );
    }

    /**
     * 执行对文件内容的检查
     *
     * @abstract
     * @param {string} contents 文件内容
     * @param {string} path 文件路径
     * @param {Object} cliOptions 命令行中传过来的配置项
     * @param {Function=} done 出现此参数时，在检查完成需要调用 done
     * @return {LintError[] | Promise<LintError[]>} 返回错误信息的数组或 Promise 对象
     */
    abstract check(
        contents: string,
        path: string,
        cliOptions: CliOptions,
        done?: (errors: LintError[]) => void
    ): LintError[] | Promise<LintError[]>;
}
