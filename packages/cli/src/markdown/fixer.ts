import markdownlint from 'markdownlint';
import { applyFixes } from 'markdownlint/helpers';

import {
    getConfig
} from '../util';
import Fixer from '../fixer';

import jsFixer from '../js/fixer';
import cssFixer from '../css/fixer';
import htmlFixer from '../html/fixer';

import type { FixerOptions, CliOptions, MDFixer } from '../types';
import customRule, { ShadowRule } from './fenced-code-lint';
import configs from './config';

class MarkdownFixer extends Fixer {
    static MarkdownFixer: MarkdownFixer;

    constructor(options: Partial<FixerOptions> = {}) {
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
     * 执行对 HTML 文件内容的格式化
     *
     * @param {string} contents 文件内容
     * @param {string} path 文件路径
     * @param {Object} cliOptions 命令行中传过来的配置项
     * @return {Promise.<string>} 返回格式化后的内容
     */
    async format(contents: string, path: string, options: CliOptions): Promise<string> {

        const { name } = this.options;
        const config = getConfig(name, options.lookup && path, configs[name]);

        const promises = [] as Promise<string>[];

        if (config.MD999) {
            if (typeof config.MD999 !== 'object') {
                config.MD999 = { script: true, html: true, style: true };
            }

            const { MD999 = {} } = config;
            const { script, html, style } = MD999;

            if (script) {
                MD999.script = (async (content, type) => {
                    const promise = jsFixer.format(content, `${ path }/*.${ type }`, options);
                    promises.push(promise);
                    return promise;
                }) as MDFixer;
            }

            if (style) {
                MD999.style = (async (content, type) => {
                    const promise = cssFixer.format(content, `${ path }/*.${ type }`, options);
                    promises.push(promise);
                    return promise;
                }) as MDFixer;
            }

            if (html) {
                MD999.html = (async (content, type) => {
                    const promise = htmlFixer.format(content, `${ path }/*.${ type }`, options);
                    promises.push(promise);
                    return promise;
                }) as MDFixer;
            }

            config.MD999 = MD999;

            MD999.fix = true;
            customRule.asynchronous = true;
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

        return new Promise(resolve => {
            markdownlint(lintOptions, (error, results) => {
                if (!error && results?.[path]) {
                    return Promise.all(promises).then(() =>
                        resolve(applyFixes(contents, results?.[path])));
                }

                resolve(contents);

            });

        });
    }
}

export default new MarkdownFixer();
