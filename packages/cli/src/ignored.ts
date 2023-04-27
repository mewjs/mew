import fs from 'fs';
import path from 'path';
import type { Transform } from 'stream';
import minimatch from 'minimatch';

import {
    mapStream
} from './util';
import console from './console';
import type { CliOptions } from './types';

/**
 * 配置 mew 忽略文件的文件名
 *
 */
const IGNORE_FILENAME = '.mewignore';

export interface IgnoreOptions {
    cwd: string;
    patterns?: string[];
    ignorePattern?: string | string[];
    ignoreFilename?: string;
}

/**
 * 加载忽略规则文件并解释 cli 参数中的 ignore
 *
 * @param {string} filename ignore 文件名
 * @param {IgnoreOptions|CliOptions} options yargs 处理后的 cli 参数
 * @return {string[]} 包含 ignorePattern 规则的字符串数组
 */
function load(filename: string, options: IgnoreOptions | CliOptions): string[] {
    const ignorePattern = options.ignorePattern || [];
    const patterns = typeof ignorePattern === 'string'
        ? [ignorePattern]
        : ignorePattern;
    if (options.cwd) {
        if (typeof filename !== 'string') {
            console.trace(filename, options);
            process.exit(1);
        }
        filename = path.resolve(options.cwd, filename);
    }

    function valid(line: string) {
        line = line.trim();
        return line !== '' && !line.startsWith('#');
    }

    if (fs.existsSync(filename)) {
        return fs.readFileSync(filename, 'utf8')
            .split(/\r?\n/)
            .filter(valid)
            .concat(patterns);
    }

    return patterns;
}

/**
 * 根据 .mewignore 与 --no-ignore 的规则过滤文件
 *
 * @param {Object} options 配置项
 * @param {string} ignoreFilename 直接指定的忽略文件路径
 * @return {Transform} 转换流
 */
export default function ignored(options: CliOptions, ignoreFilename: string = IGNORE_FILENAME): Transform {

    const patterns = options.ignore === false
        ? []
        : [...load(ignoreFilename, options), ...load('.eslintignore', options)];

    return mapStream(
        (file, callback) => {
            const filepath = (file.relative || '').replace('\\', '/');

            const matchOptions = {
                dot: true,
                nocase: true
            };

            const isIgnore = patterns.reduce((ignored, pattern) => {
                const negated = pattern.startsWith('!');

                if (negated) {
                    pattern = pattern.slice(1);
                }

                const matches = minimatch(filepath, pattern, matchOptions)
                    || minimatch(filepath, `${ pattern }/**`, matchOptions);
                const result = matches ? !negated : ignored;

                if (options.debug && result) {
                    console.log('%s is ignored by %s.', filepath, pattern);
                }

                return result;
            }, false);

            if (isIgnore) {
                // lint 单个文件被 ignored 需要提示给前端
                if (options.replace == null && options._.some(path => String(path).endsWith(filepath))) {
                    file.isIgnored = true;
                    return callback(null, file);
                }

                return callback();
            }

            return callback(null, file);
        }
    );
}

/**
 * 文件过滤器，根据 ignore 规则过滤文件
 */
export class FileFilter {
    cwd: string;
    patterns: string[];

    /**
     * 文件过滤器
     *
     * @param {string} cwd cwd 目录
     * @param {string[]} options.patterns glob 格式的忽略规则列表
     * @param {string} options.ignoreFilename 配置文件名
     */
    constructor(cwd: string, options: Partial<IgnoreOptions> = { ignoreFilename: IGNORE_FILENAME }) {

        this.patterns = Array.isArray(options.patterns)
            ? options.patterns
            : load(options.ignoreFilename || IGNORE_FILENAME, { cwd });

        this.cwd = cwd;
    }

    /**
     * 判断文件是否被忽略
     *
     * @param {string} filepath 文件路径
     * @return {boolean}
     */
    isIgnored(filepath: string): boolean {
        if (path.isAbsolute(filepath) && filepath.startsWith(this.cwd)) {
            filepath = path.relative(this.cwd, filepath);
        }

        filepath = filepath.replace('\\', '/');

        const matchOptions = {
            dot: true,
            nocase: true
        };

        const isIgnore = this.patterns.reduce((ignored, pattern) => {
            const negated = pattern.startsWith('!');
            if (negated) {
                pattern = pattern.slice(1);
            }

            const matches = minimatch(filepath, pattern, matchOptions)
                || minimatch(filepath, `${ pattern }/**`, matchOptions);
            return matches ? !negated : ignored;
        }, false);

        return isIgnore;
    }
}
