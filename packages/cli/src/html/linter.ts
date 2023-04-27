/* eslint-disable @typescript-eslint/no-use-before-define */
import { hint } from '@mewjs/htmlint';
import type { HTMLElement } from '@mewjs/dom/lib';

import {
    getConfig,
    parseError
} from '../util';
import Linter from '../linter';

import jsLinter from '../js/linter';
import cssLinter from '../css/linter';
import type { CliOptions, LintError, LinterOptions } from '../types';
import configs from './config';

interface Position {
    line: number;
    column: number;
}

/**
     * 对标签内容的 fixer
     *
     * @param {string} tagContents 标签内容
     * @param {string} path 文件路径
     * @param {CliOptions} options CLI 传来的配置
     * @param {Position} pos 位置信息
     * @param {string} contents 完整文件内容
     * @return {Promise<LintError[]>} 错误信息
     */
type RestLinter = (
    tagContents: string,
    path: string,
    options: CliOptions,
    pos: Position,
    errors: LintError[],
    contents: string
) => Promise<LintError[]>;

interface LinterMapper {
    script(contents: string, pos: Position, node: HTMLElement, indent: string): void;
    style(contents: string, pos: Position, node: HTMLElement, indent: string): void;
}

class HTMLLinter extends Linter {
    static HTMLLinter: HTMLLinter;

    constructor(options: Partial<LinterOptions> = {}) {
        super({
            suffix: 'html,htm',
            ignore: /\.(tpl|m|min)\.html?$/i,
            ...options,
            name: 'htmlint',
            type: 'html'
        });
    }

    // eslint-disable-next-line class-methods-use-this
    register() {
        // Subclass should be implemented
    }

    /**
     * 执行对 HTML 文件内容的检查
     *
     * @param {string} contents 文件内容
     * @param {string} path 文件路径
     * @param {CliOptions} options 命令行中传过来的配置项
     * @return {Promise<LintError[]>} 返回错误信息的数组
     */
    async check(contents: string, path: string, options: CliOptions): Promise<LintError[]> {

        const { name, type } = this.options;

        const config = getConfig(name, options.lookup && path, configs[name]);
        const errors = [] as LintError[];
        const linters = {} as LinterMapper;
        const promises = [] as Promise<LintError[]>[];

        const resolve = async function () {
            return Promise.resolve(errors);
        };

        if (config['script-content']) {
            linters.script = (content, pos) =>
                promises.push(checkScript(content, `${ path }/*.js`, options, pos, errors, contents));
        }

        if (config['style-content']) {
            linters.style = (content, pos, style, indent) =>
                promises.push(checkStyle(content, `${ path }/*.css`, options, pos, errors, indent));
        }

        config.linters = linters;
        config['max-error'] = options.maxError;

        hint(contents, config).forEach(error => {
            errors.push(
                parseError(
                    {
                        type,
                        linter: name,
                        rule: error.rule
                    },
                    error
                )
            );
        });


        return Promise.all(promises).then(resolve);
    }
}

const checkScript: RestLinter = async function checkScript(content, path, options, pos, errors, document) {
    const hasWrapsBeforeCode = /^[\t ]*[\r\n]/.test(content);
    // eslint-disable-next-line prefer-template
    const disableRules = ''
        // 在页面中应该禁止的规则
        + '/* eslint-disable import/unambiguous, no-var, eol-last, unicode-bom, no-undef */'
        // 缩进需要调整
        + '/* eslint-disable indent */'
        + (hasWrapsBeforeCode ? '' : `\n${ ' '.repeat(pos.column) }`);

    const code = disableRules + content.trimEnd();

    // 简单判断是否只有一条不换行的语句
    const isOneLineCode = /^\S+[^\r\n;]+;?$/.test(content);

    const promise = jsLinter.check(code, path, options);
    const getIndexByPosition = (document: string, line: number, column: number) => {
        const reg = new RegExp(`(?<=^(.*\n){${ line - 1 }})`);
        return document.search(reg) + column;
    };

    const fixOriginPosition = (jsError: LintError) => {
        if (jsError.origin && jsError.line && jsError.column) {
            const { origin } = jsError;
            origin.line = jsError.line;
            if (origin.fix) {
                const { range } = origin.fix;
                const scriptStartIndex = getIndexByPosition(document, pos.line, pos.column);
                origin.fix.range = [
                    scriptStartIndex + range[0] - disableRules.length - 1,
                    scriptStartIndex + range[1] - disableRules.length - 1
                ];
            }
        }
    };

    const done = (jsErrors: LintError[]) => {
        if (jsErrors.length) {
            jsErrors.forEach(error => {
                // 减 1 是因为一行是标签名
                error.line = (error.line | 0) + pos.line - 1;
                // 减去添加注释导致的换行
                !hasWrapsBeforeCode && error.line--;

                // 只有一条语句导致的缩进问题可以忽略
                if (!(isOneLineCode && error.rule === 'indent')) {
                    fixOriginPosition(error);
                    errors.push(error);
                }
            });
        }

        return errors;
    };

    return promise.then(done, done);
};

const checkStyle: RestLinter = async function checkStyle(content, path, options, pos, errors, indent) {
    // eslint-disable-next-line prefer-template
    const code = ''
        // TODO: 下面的 4 需要从配置读取
        // 缩进需要调整
        + '/* stylelint indentation: [4, {baseIndentLevel:' + indent.length + '}] */'
        + '\n'
        + (/^\s*[\r\n]+/.test(content) ? '' : ' '.repeat(pos.column))
        + content.trimEnd();

    const promise = cssLinter.check(code, path, options);
    const done = function (cssErrors: LintError[]) {
        if (cssErrors.length) {
            cssErrors.forEach(error => {
                // 减 2 是因为一行是标签名，一行是上面加的规则注释
                error.line = (error.line | 0) + pos.line - 2;
                if (error.line === pos.line) {
                    error.column += pos.column;
                }
                errors.push(error);
            });
        }

        return errors;
    };

    return promise.then(done, done);
};

export default new HTMLLinter();
