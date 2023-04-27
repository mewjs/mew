import path from 'path';
import type { Linter } from 'eslint';
import { ESLint } from 'eslint';

import { getConfig } from '../util';
import Fixer from '../fixer';
import type { FixerOptions, CliOptions } from '../types';
import configs from './config';

const plugins = path.join(__dirname, '..');

class MpXmlFixer extends Fixer {
    static MpXmlFixer: MpXmlFixer;

    constructor(options: Partial<FixerOptions> = {}) {
        super({
            suffix: 'wxml,wxs,axml,swan',
            ignore: /\.(m|min|mock|mockup)\.(wxs)$/,
            ...options,
            name: 'eslint',
            type: 'js'
        });
    }

    // eslint-disable-next-line class-methods-use-this
    register() {
        // Subclass should be implemented
    }

    /**
     * 执行对小程序文件内容的格式化
     *
     * @param {string} contents 文件内容
     * @param {string} path 文件路径
     * @param {CliOptions} options 命令行中传过来的配置项
     * @return {Promise<string>} 返回格式化后的内容
     */
    async format(contents: string, path: string, cliOptions: CliOptions): Promise<string> {
        const { name } = this.options;
        const config = getConfig(name, cliOptions.lookup && path, configs);

        delete config.mew;

        const eslint = new ESLint({
            baseConfig: config as Linter.Config,
            resolvePluginsRelativeTo: plugins,
            fix: true,
            ignore: cliOptions.ignore
        });
        try {
            const [result] = await eslint.lintText(contents, {
                filePath: path,
                warnIgnored: false
            });
            return result?.output ? result.output : contents;
        }
        catch (e) {
            return contents;
        }
    }
}

export default new MpXmlFixer();
