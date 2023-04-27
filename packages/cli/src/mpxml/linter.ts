import path from 'path';
import type { Linter as ESLinter } from 'eslint';
import { ESLint } from 'eslint';

import {
    getConfig,
    parseError
} from '../util';
import Linter from '../linter';
import type { LinterOptions, CliOptions, LintError } from '../types';
import configs from './config';

const plugins = path.join(__dirname, '..');

class MpXmlLinter extends Linter {
    static MpXmlLinter: MpXmlLinter;

    constructor(options: Partial<LinterOptions> = {}) {
        super({
            suffix: 'wxml,wxs,axml,swan,json',
            ignore: /\.(m|min|mock|mockup)\.(wxs)$/,
            ...options,
            name: 'eslint',
            type: 'js'
        });
    }

    /**
     * 执行对 JS 文件内容的检查
     *
     * @param {string} contents 文件内容
     * @param {string} path 文件路径
     * @param {CliOptions} options 命令行中传过来的配置项
     * @return {Promise<LintError[]>} 返回错误信息的数组
     */
    async check(contents: string, path: string, cliOptions: CliOptions): Promise<LintError[]> {
        const { name, type } = this.options;
        const config = getConfig(name, cliOptions.lookup && path, configs);
        let maxError = 0;
        const hasMax = cliOptions.maxError > 0;
        const errors = [] as LintError[];

        const eslint = new ESLint({
            baseConfig: config as ESLinter.Config,
            resolvePluginsRelativeTo: plugins,
            fix: false,
            ignore: cliOptions.ignore
        });

        try {
            const eslintConfig = await eslint.calculateConfigForFile(path);
            // 非小程序检查跳过
            if (!eslintConfig.parser.match(/mpxml-eslint-parser\//)) {
                return [];
            }

            const [{ messages } = { messages: [] }] = await eslint.lintText(contents, {
                filePath: path,
                warnIgnored: false
            });
            messages.forEach(error => {
                if (hasMax) {
                    if (maxError > cliOptions.maxError) {
                        return;
                    }

                    maxError++;
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

export default new MpXmlLinter();
