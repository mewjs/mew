import path from 'path';
import type { Linter } from 'eslint';
import { ESLint } from 'eslint';

import { getConfig } from '../util';
import Fixer from '../fixer';
import type { FixerOptions, CliOptions } from '../types';
import configs from './config';

const plugins = path.join(__dirname, '../');

class JSFixer extends Fixer {
    static JSFixer: JSFixer;

    constructor(options: Partial<FixerOptions> = {}) {
        super({
            ...options,
            name: 'eslint',
            type: 'js',
            suffix: 'js,jsx,es,ts,tsx,vue'
        });
    }

    // eslint-disable-next-line class-methods-use-this
    register() {
        // Subclass should be implemented
    }

    /**
     * 执行对 JS 文件内容的格式化
     *
     * @param {string} contents 文件内容
     * @param {string} path 文件路径
     * @param {CliOptions} options 命令行中传过来的配置项
     * @return {string} 返回格式化后的内容
     */
    async format(contents: string, path: string, cliOptions: CliOptions): Promise<string> {
        const { name } = this.options;
        const config = getConfig(name, cliOptions.lookup && path, configs[name]);

        const eslintOptions = {
            baseConfig: config as Linter.Config,
            resolvePluginsRelativeTo: plugins,
            fix: true,
            ignore: cliOptions.ignore
        };
        const eslint = new ESLint(eslintOptions);

        try {
            let [result] = await eslint.lintText(contents, {
                filePath: path,
                warnIgnored: false
            });
            // 这里需要单独配置对 ts 文件的检查规则
            const isNeedToParseTsFile = result?.messages[0]?.fatal
                && (result?.messages[0].message).startsWith('Parsing error:')
                && path.endsWith('.ts')
                && -1 === (await eslint.calculateConfigForFile(path)).parser?.indexOf('@typescript-eslint/parser');

            if (isNeedToParseTsFile) {
                const eslint = new ESLint({
                    ...eslintOptions,
                    overrideConfig: {
                        extends: ['plugin:@mewjs/typescript']
                    }
                });


                [result] = await eslint.lintText(contents, {
                    filePath: path,
                    warnIgnored: false
                });
            }

            return Promise.resolve(result?.output ? result.output : contents);
        }
        catch (e) {
            if (cliOptions.debug) {
                console.error(e);
            }

            return contents;
        }
    }
}

export default new JSFixer();
