import { join } from 'path';
import stylelint from 'stylelint';
import less from 'postcss-less';

import { getConfig } from '../util';
import Fixer from '../fixer';
import console from '../console';
import type { FixerOptions, CliOptions } from '../types';
import configs from './config';

const configBasedir = join(__dirname, '../');

interface PostCSSResult {
    _postcssResult: {
        opts: { syntax: unknown };
        root: {
            toString(syntax: unknown): string;
        };
    };
}

interface Output {
    results: [PostCSSResult];
}

// TODO: any -> real type
function getOutputCss(output: Output, contents: string): string {
    if (!output.results[0] || !('_postcssResult' in output.results[0])) {
        return contents;
    }

    const { results: [{ _postcssResult: { opts: { syntax }, root } }] } = output;
    const css = root.toString(syntax);

    if (syntax === less) {
        // Less needs us to manually strip whitespace at the end of single-line comments ¯\_(ツ)_/¯
        return css.replace(/(\n?\s*\/\/.*?)[ \t]*(\r?\n)/g, '$1$2');
    }

    return css;
}

class CSSFixer extends Fixer {
    static CSSFixer: CSSFixer;

    constructor(options: Partial<FixerOptions> = {}) {
        super({
            ...options,
            name: 'stylelint',
            type: 'css',
            suffix: /\.((?:c|le|sa|sc|wx)ss|styl|vue)$/
        });
    }

    // eslint-disable-next-line class-methods-use-this
    register() {
        // Subclass should be implemented
    }

    /**
     * 执行对 CSS 文件内容的格式化
     *
     * @param {string} contents 文件内容
     * @param {string} path 文件路径
     * @param {CliOptions} options 命令行中传过来的配置项
     * @return {Promise<string>} 返回格式化后的内容
     */
    async format(contents: string, path: string, options: CliOptions): Promise<string> {
        const { name } = this.options;
        const config = getConfig(name, options.lookup && path, configs[name]);

        const syntax = /\.(css|html?)$/.test(path) ? 'less' : path.split('.').pop();

        try {
            const output = await stylelint
                .lint({
                    config,
                    configBasedir,
                    code: contents,
                    codeFilename: path,
                    fix: true,
                    customSyntax: syntax === 'stylus' ? require.resolve('./stylus') : void 0
                });

            return getOutputCss(output, contents);
        }
        catch (error) {
            if (options.debug) {
                console.error(error);
            }

            return contents;
        }
    }
}


export default new CSSFixer();
