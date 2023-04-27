/* eslint-disable @typescript-eslint/no-use-before-define */
import markdownlint from 'markdownlint';

import {
    getConfig
} from '../util';
import Linter from '../linter';

import htmLinter from '../html/linter';
import jsLinter from '../js/linter';
import cssLinter from '../css/linter';
import type { CliOptions, LintError, LinterOptions, MDLinter, Suggestion, FixInstruction } from '../types';
import customRule, { ShadowRule } from './fenced-code-lint';
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

function transformFix(
    { fixInfo, ruleInformation }: markdownlint.LintError
): Suggestion[] | null {
    if (!fixInfo) {
        return null;
    }

    const { editColumn = 0, deleteCount = 0, insertText: text = '' } = fixInfo;

    const fix: FixInstruction = {
        text,
        range: [editColumn, deleteCount]
    };

    return [{ desc: ruleInformation, fix }];
}

function transform(originErrors: markdownlint.LintError[]): LintError[] {
    return originErrors.map(result => (
        {
            line: result.lineNumber,
            endLine: result.lineNumber,
            column: result.errorRange?.[0] ?? 1,
            endColumn: result.errorRange?.[1] || Number.MAX_VALUE,
            rule: result.ruleNames.join('|'),
            linter: 'markdownlint',
            message: `${ result.ruleDescription } [${ result.errorDetail }]`,
            origin: result,
            info: result.ruleInformation,
            severity: 1,
            suggestions: transformFix(result)
        } as unknown as LintError
    ));
}

function processResults(results: markdownlint.LintResults, errors: LintError[]) {
    for (const originErrors of Object.values(results)) {
        errors.push(...transform(originErrors));
    }
}

class MarkdownLinter extends Linter {
    static MarkdownLinter: MarkdownLinter;

    constructor(options: Partial<LinterOptions> = {}) {
        super({
            suffix: 'md,markdown',
            ignore: /\.(ignored)\.md?$/i,
            ...options,
            name: 'markdownlint',
            type: 'md'
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

        const { name } = this.options;

        const config = getConfig(name, options.lookup && path, configs[name]);
        delete config.mew;

        const errors = [] as LintError[];
        const promises = [] as Promise<LintError[]>[];

        async function resolve() {
            return Promise.resolve(errors);
        }

        if (config.MD999) {
            if (typeof config.MD999 !== 'object') {
                config.MD999 = { script: true, html: true, style: true };
            }

            const { script, html, style } = config.MD999;

            config.MD999.fix = false;

            if (script) {
                config.MD999.script = (async (content, pos, type, indent) => {
                    promises.push(checkScript(content, `${ path }/*.${ type }`, options, pos, errors, contents));
                    return promises[promises.length - 1];
                }) as MDLinter;
            }

            if (style) {
                config.MD999.style = (async (content, pos, type, indent) => {
                    promises.push(checkStyle(content, `${ path }/*.${ type }`, options, pos, errors, indent));
                    return promises[promises.length - 1];
                }) as MDLinter;
            }

            if (html) {
                config.MD999.html = (async (content, pos, type, indent) => {
                    promises.push(checkHTML(content, path, options, pos, errors, indent));
                    return promises[promises.length - 1];
                }) as MDLinter;
            }

            customRule.asynchronous = false;
        }

        const lintOptions: markdownlint.Options = {
            strings: {
                [path]: contents
            },
            config,
            // frontMatter: /-{4,}/,
            resultVersion: 3,
            customRules: config.MD999 ? [ShadowRule, customRule] : void 0,
            // markdownItPlugins: [],
            handleRuleFailures: true,
            noInlineConfig: false,
        };

        const results = markdownlint.sync(lintOptions);
        if (results) {
            processResults(results, errors);
        }

        return Promise.all(promises).then(resolve);
    }
}

const checkScript: RestLinter = async function checkScript(contents, path, options, pos, errors, document) {
    const code = contents.trimEnd();

    // 简单判断是否只有一条不换行的语句
    const isOneLineCode = /^\S+[^\r\n;]+;?$/.test(contents);

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
                    scriptStartIndex + range[0],
                    scriptStartIndex + range[1]
                ];
            }
        }
    };

    const done = (jsErrors: LintError[]) => {
        if (jsErrors.length) {
            jsErrors.forEach(error => {
                // 减 1 是因为一行是标签名
                error.line = (error.line | 0) + pos.line - 1;
                error.column += 1;

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

const checkStyle: RestLinter = async function checkStyle(contents, path, options, pos, errors, indent) {
    // eslint-disable-next-line prefer-template
    const code = ''
        // TODO: 下面的 4 需要从配置读取
        // 缩进需要调整
        + '/* stylelint indentation: [4, {baseIndentLevel:' + indent.length + '}] */\n'
        + '/* stylelint-disable no-missing-end-of-source-newline */'
        + '\n'
        + (/^\s*[\r\n]+/.test(contents) ? '' : ' '.repeat(pos.column))
        + contents.trimEnd();

    const promise = cssLinter.check(code, path, options);
    const done = function (cssErrors: LintError[]) {
        if (cssErrors.length) {
            cssErrors.forEach(error => {
                // 减 2 是因为一行是标签名，两行是上面加的规则注释
                error.line = (error.line | 0) + pos.line - 3;
                error.column += 1;
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

const checkHTML: RestLinter = async function checkHTML(contents, path, options, pos, errors, indent) {
    // eslint-disable-next-line prefer-template
    const code = ''
        // 缩进需要调整
        + '<!-- htmlint-disable no-bom, doctype -->'
        + '\n'
        + (/^\s*[\r\n]+/.test(contents) ? '' : ' '.repeat(pos.column))
        + contents.trimEnd();

    const promise = htmLinter.check(code, path, options);
    const done = function (htmErrors: LintError[]) {
        if (htmErrors.length) {
            htmErrors.forEach(error => {
                // 减 2 是因为一行是标签名，一行是上面加的规则注释
                error.line = (error.line | 0) + pos.line - 2;
                error.column += 1;
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

export default new MarkdownLinter();
