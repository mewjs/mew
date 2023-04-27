import path from 'path';
import type { Linter as ESLinter } from 'eslint';
import { ESLint } from 'eslint';

import {
    getConfig,
    Severity,
    parseError
} from '../util';
import Linter from '../linter';
import type { LinterOptions, CliOptions, LintError } from '../types';
import configs from './config';

const plugins = path.join(__dirname, '../');

class JSLinter extends Linter {
    static JSLinter: JSLinter;

    constructor(options: Partial<LinterOptions> = {}) {
        super({
            ...options,
            name: 'eslint',
            type: 'js',
            suffix: 'js,jsx,ts,tsx,ejs,es,es6,vue,san,atom',
            ignore: /\.(m|min|mock|mockup)\.(js|es|es6)$/
        });
    }

    /**
     * 执行对 JS 文件内容的检查
     *
     * @param {string} contents 文件内容
     * @param {string} path 文件路径
     * @param {CliOptions} cliOptions 命令行中传过来的配置项
     * @return {Promise.<LintError[]>} 返回错误信息的数组
     */
    async check(contents: string, path: string, cliOptions: CliOptions): Promise<LintError[]> {
        const { name, type } = this.options;

        const config = getConfig(name, cliOptions.lookup && path, configs[name]);

        let maxError = 0;
        const hasMax = cliOptions.maxError > 0;
        const errors = [] as LintError[];
        const options = {
            baseConfig: config as ESLinter.Config,
            resolvePluginsRelativeTo: plugins,
            fix: false,
            ignore: cliOptions.ignore
        };

        const eslint = new ESLint(options);

        try {
            let [{ messages } = { messages: [] }] = await eslint.lintText(contents, {
                filePath: path,
                warnIgnored: false
            });

            // js 项目里面如果包含 index.d.ts 等文件，由于默认配置不能检查 ts
            // 这里需要单独配置对 ts 文件的检查规则
            const isNeedToParseTsFile = messages[0]?.fatal
                && messages[0].message.startsWith('Parsing error:')
                && path.endsWith('.ts')
                && -1 === (await eslint.calculateConfigForFile(path)).parser?.indexOf('@typescript-eslint/parser');

            if (isNeedToParseTsFile) {
                const eslint = new ESLint({
                    ...options,
                    overrideConfig: {
                        extends: ['plugin:@mewjs/typescript']
                    }
                });
                [{ messages } = { messages: [] }] = await eslint.lintText(contents, {
                    filePath: path,
                    warnIgnored: false
                });
            }

            messages.forEach(error => {
                if (hasMax) {
                    if (maxError > cliOptions.maxError) {
                        return;
                    }
                    maxError++;
                }

                const babelRulesPrefix = 'babel/';

                // TODO: 兼容 eslint-plugin-babel 已经废弃的错误，变为 warning，同时提示变更代码为 @babel/
                if (error.ruleId?.startsWith(babelRulesPrefix)) {
                    error.severity = Severity.WARN;
                    const newRuleId = ['babel/camelcase', 'babel/quotes', 'babel/valid-typeof'].includes(error.ruleId)
                        ? error.ruleId.slice(babelRulesPrefix.length)
                        : `@${ error.ruleId }`;
                    error.message = `rule '${ error.ruleId }' has been deprecated, use '${ newRuleId }' instead.`;
                }

                errors.push(
                    parseError(
                        {
                            type,
                            linter: name,
                            rule: error.ruleId || ''
                        },
                        error
                    )
                );
            });
        }
        catch (error) {
            errors.push(
                parseError(
                    {
                        type,
                        linter: name,
                        code: '998'
                    },
                    error
                )
            );
        }

        return errors;
    }
}

export default new JSLinter();
