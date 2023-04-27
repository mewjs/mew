import { join } from 'path';
import stylelint from 'stylelint';

import {
    getConfig,
    parseError
} from '../util';
import Linter from '../linter';
import type { LinterOptions, CliOptions, LintError } from '../types';
import configs from './config';

const configBasedir = join(__dirname, '../');

class CSSLinter extends Linter {
    static CSSLinter: CSSLinter;

    constructor(options: Partial<LinterOptions> = {}) {
        super({
            ...options,
            name: 'stylelint',
            type: 'css',
            suffix: 'css,less,sass,scss,styl,vue,wxss',
            ignore: 'm.css,min.css'
        });
    }

    /**
     * 执行对 CSS 文件内容的检查
     *
     * @param {string} contents 文件内容
     * @param {string} path 文件路径
     * @param {CliOptions} cliOptions 命令行中传过来的配置项
     * @return {Promise<LintError[]>} 返回错误信息的数组
     */
    /* eslint-disable-next-line @typescript-eslint/promise-function-async */
    check(contents: string, path: string, cliOptions: CliOptions): Promise<LintError[]> {
        const { name, type } = this.options;

        const config = getConfig(name, cliOptions.lookup && path, configs[name]);

        delete config.mew;

        let maxError = 0;
        const hasMax = cliOptions.maxError > 0;
        const errors = [] as LintError[];

        // TODO: any -> real type
        const success = function (result) {
            if (hasMax) {
                if (maxError > cliOptions.maxError) {
                    return true;
                }

                maxError++;
            }

            const { results } = result;
            results?.[0]?.warnings.forEach(error => {
                error.message = error.text.replace(` (${ error.rule })`, '');
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

            return errors;
        };

        const failure = function (reasons) {
            errors.push(
                parseError(
                    {
                        type,
                        linter: name,
                        code: '999'
                    },
                    reasons instanceof Error ? reasons : reasons[0]?.messages[0]
                )
            );

            return errors;
        };

        return stylelint
            .lint({
                config: config as stylelint.Config,
                configBasedir,
                code: contents,
                codeFilename: path,
                formatter: () => '',
                customSyntax: require.resolve('./stylus')
            })
            .then(success, failure)
            .then(() => errors);
    }
}


export default new CSSLinter();
