import type { FormatMapper } from '@mewjs/htmlint';
import { formatAsync } from '@mewjs/htmlint';

import {
    getConfig
} from '../util';

import Fixer from '../fixer';

import jsFixer from '../js/fixer';
import cssFixer from '../css/fixer';

import type { FixerOptions, CliOptions } from '../types';
import configs from './config';

class HTMLFixer extends Fixer {
    static HTMLFixer: HTMLFixer;

    constructor(options: Partial<FixerOptions> = {}) {
        super({
            suffix: 'html,htm',
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

        delete config.mew;

        config.format = { ...buildFixer(path, options), ...config.format };

        return formatAsync(contents, config);
    }
}


/**
 * 为 htmlint 生成用于 HTML 内 script 与 style 标签内容的 fixer
 *
 * @param {string} path HTML 的文件路径，主要用于查找相关配置
 * @param {Object} options CLI 传来的配置
 * @return {Object}
 */
function buildFixer(path: string, options: CliOptions): { formatter: FormatMapper } {
    return {
        formatter: {


            async script(content, node, opt, helper) {
                const type = node.getAttribute('type');
                const pattern = /(^\s*\n)|(\n\s*$)/g;

                // javascript content
                if (!type || type === 'text/javascript') {
                    const formatted = await jsFixer.format(content, `${ path }/*.js`, options);

                    content = helper.indent(formatted, opt);
                    opt.level!--;
                }

                return Promise.resolve(content.replace(pattern, ''));
            },

            async style(content, node, opt, helper) {
                const type = node.getAttribute('type');
                const pattern = /(^\s*\n)|(\n\s*$)/g;

                // style content
                if (!type || type === 'text/css') {
                    const formatted = await cssFixer.format(content, `${ path }/*.css`, options);

                    opt.level!--;
                    content = helper.indent(formatted, opt);

                }

                return Promise.resolve(content.replace(pattern, ''));
            }
        }
    };
}


export default new HTMLFixer();
