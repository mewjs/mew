import fs from 'fs';
import path from 'path';
import util from 'util';
import type { Transform } from 'stream';
import { Readable } from 'stream';

import chalk from 'chalk';
import map from 'map-stream';
import Manis from '@mewjs/manis';
import yaml from 'js-yaml';
import File from 'vinyl';

import type { Config, ManisOptions } from '@mewjs/manis/lib/types';
import type { ConfigValue, BaseError, LintError, OriginError, ReportFile } from './types';

export const CONFIG_NAME = '.mewrc';
export const PACKAGE_NAME = 'package.json';
const JSON_YAML_REG = /(.+)\.(?:json|ya?ml)$/i;

let rcLoader: Manis;

export const config = (config => {
    ['css', 'markdown', 'html', 'js'].forEach(dir => {
        readConfigs(path.join(__dirname, dir), config);
    });
    return config;
})({});


export enum Severity {
    WARN = 1,
    ERROR = 2,
    // error = 'error',
    // warn = 'warn'
}


/**
 * 获取指定路径下特定的文件配置
 *
 * @param {string} key 配置文件名
 * @param {string|false} filepath 要搜索的起始路径
 * @param {Config} defaults 默认配置
 * @param {boolean} force 强制重新读取配置
 * @return {Object} 合并后的搜索路径下所有的配置对象
 */
// eslint-disable-next-line max-lines-per-function
export function getConfig<T>(
    key: string, filepath: string | false, defaults: T = {} as T, force = false
): T {

    // 未提供起始路径时，使用内置配置
    if (!filepath) {
        return config[key] || defaults;
    }

    let localLoader = rcLoader;
    if (!localLoader || force) {

        localLoader = new Manis({
            // 支持 root 配置属性
            enableRoot: true,
            files: [
                CONFIG_NAME,
                { name: PACKAGE_NAME, get: 'mew' },
                {
                    name: '.eslintrc',
                    get(eslint: Config) {
                        return { eslint };
                    }
                },
                {
                    name: '.eslintrc.yml',
                    get(eslint: Config) {
                        return { eslint };
                    }
                },
                {
                    name: '.eslintrc.js',
                    get(eslint: Config) {
                        return { eslint };
                    }
                },
                {
                    name: '.eslintrc.json',
                    get(eslint: Config) {
                        return { eslint };
                    }
                },
                {
                    name: '.stylelintrc',
                    get(stylelint: Config) {
                        return { stylelint };
                    }
                },
                {
                    name: '.stylelintrc.json',
                    get(stylelint: Config) {
                        return { stylelint };
                    }
                },
                {
                    name: '.stylelintrc.yml',
                    get(stylelint: Config) {
                        return { stylelint };
                    }
                },
                {
                    name: '.stylelintrc.js',
                    get(stylelint: Config) {
                        return { stylelint };
                    }
                },
                {
                    name: '.htmlintrc',
                    get(htmlint: Config) {
                        return { htmlint };
                    }
                },
                {
                    name: '.htmlintrc.json',
                    get(htmlint: Config) {
                        return { htmlint };
                    }
                },
                {
                    name: '.htmlintrc.yml',
                    get(htmlint: Config) {
                        return { htmlint };
                    }
                },
                {
                    name: '.htmlintrc.js',
                    get(htmlint: Config) {
                        return { htmlint };
                    }
                },
                {
                    name: '.markdownlint.yml',
                    get(markdownlint: Config) {
                        return { markdownlint };
                    }
                },
                {
                    name: '.markdownlint.js',
                    get(markdownlint: Config) {
                        return { markdownlint };
                    }
                },
                {
                    name: '.markdownlint.json',
                    get(markdownlint: Config) {
                        return { markdownlint };
                    }
                }
            ]
        } as Partial<ManisOptions>);

        localLoader.setDefault(config);
        if (!rcLoader) {
            rcLoader = localLoader;
        }
    }

    return localLoader.from(filepath)[key] as T || defaults;
}

/**
 * 清除已缓存的配置
 *
 * 默认配置文件内容会一直缓存，在监听到配置文件有变更时需要调用
 */
export function clearCachedConfig() {
    if (rcLoader) {
        rcLoader.clear();
    }
}


/**
 * 从工作目录向上查找包含指定文件的路径
 *
 * @param {string} filename 要查找的文件名
 * @param {string=} start 开始查找的目录，默认为当前目录
 * @return {(string|undefined)} 第一个能查找到文件的路径，否则返回 undefined
 */
export function findPath(filename: string, start = './'): string | undefined {
    start = path.resolve(start);

    const root = path.resolve('/');
    let filepath = path.join(start, filename);

    let dir = start;
    while (dir !== root) {
        filepath = path.join(dir, filename);

        if (fs.existsSync(filepath)) {
            return dir;
        }

        dir = path.resolve(dir, '..');
    }
}

/**
 * 构建文件匹配的 glob pattern
 *
 * @param {string[]} dirs 目录
 * @param {string=} extensions 扩展名
 * @return {string[]} 能查找到对应 dirs 目录下目标文件的对应的 glob pattern 数组
 */
export function buildPattern(dirs: string[], extensions = 'js,md,css,html,wxml'): string[] {
    extensions = extensions
        .replace(/\s+/g, '')
        .replace(/\bhtml?\b/gi, 'htm,html')
        .replace(/\bmd?\b/gi, 'md,markdown')
        .replace(/\bjs\b/gi, 'js,jsx,es,vue,ts,tsx')
        .replace(/\bcss\b/gi, 'css,less,sass,scss,styl')
        .replace(/\bwxml\b/gi, 'wxml,wxs,axml,swan,wxss')
        .replace(/^,|,\s*(?=,|$)/g, '');

    if (~extensions.indexOf(',')) {
        extensions = `{${ extensions }}`;
    }

    const defaultPath = './';
    if (!dirs || !dirs.length) {
        const cwd = findPath(CONFIG_NAME) || findPath(PACKAGE_NAME) || path.resolve(defaultPath);
        process.chdir(cwd);
        dirs = getConfig('files', defaultPath, [defaultPath], true) as string[];
    }

    function transform(dir: string) {
        if (fs.existsSync(dir)) {
            const stat = fs.statSync(dir);

            return stat.isDirectory()
                ? `${ path.join(dir, '/') }**/*.${ extensions }`
                : dir;
        }
        return dir;
    }

    const patterns = dirs.map(transform).filter(Boolean);
    patterns.push('!**/{node_modules,bower_components}/**');

    return patterns;
}


/**
 * 读取指定目录下的 JSON 配置文件，以文件名的 camelCase 形式为 key 暴露
 *
 * @param {string} dir 目录路径
 * @param {Config=} out 调用模块的 exports 对象
 * @return {Config} 绑定的模块对象
 */
export function readConfigs(dir: string, out: Config = {}): Config {
    if (!fs.existsSync(dir)) {
        return out;
    }

    fs.readdirSync(dir).forEach(file => {
        const match = file.match(JSON_YAML_REG);
        if (match?.[1]) {
            const key = match[1].replace(/-[a-z]/g, a => a[1].toUpperCase());

            const filepath = path.join(dir, file);
            out[key] = Manis.loader(fs.readFileSync(filepath, 'utf-8'), filepath) as ConfigValue;
        }
    });

    return out;
}

/**
 * 为字符固定宽度（位数）
 *
 * @param {string} src 输入字符串
 * @param {number=} width 需要固定的位数，默认为 3
 * @param {string=} chr 不够时补齐的字符，默认为 1 个空格
 * @return {string} 补齐后的字符串
 */
export function fixWidth(src: string, width = 3, chr = ' '): string {
    src = String(src);
    const { length } = src;

    if (length >= width) {
        return src;
    }

    return chr[0].repeat(width - length) + src;
}

/**
 * 格式化字符串
 *
 * @param {string} pattern 字符串模式
 * @param {...*} args 要替换的数据
 * @return {string} 数据格式化后的字符串
 */
export function format(pattern: string, ...args: any[]): string {
    return util.format.apply(null, [pattern, ...args]);
}

/**
 * 生成 ignore error 规则
 */
export function ignoreError(): BaseError {
    const info = {
        severity: Severity.WARN,
        code: '998',
        rule: 'ignore',
        line: 0,
        column: 0,
        message: 'File ignored because of a matching ignore pattern. Use "--no-ignore" to override'
    };

    return info;
}

/**
 * 从 stack 中解释错误所在位置
 *
 * @param {Partial<LintError>} info 错误的基本信息
 * @param {OriginError} error 源错误对象
 * @return {(Object | Error)} 解释成功后返回包含行列和文件信息的对象，否则返回源错误对象
 */
export function parseError(info: Partial<LintError>, error: Partial<OriginError>): LintError {

    info.origin = error as OriginError;
    info.message = error.message;

    const matches = error.stack ? error.stack.match(/\(?(.+?\.js):(\d+)(:(\d+))?\)?/) : null;
    const columnIndex = 4;
    if (!('lineNumber' in error) && matches) {
        info.line = parseInt(matches[2], 10);
        if (matches[columnIndex]) {
            info.column = parseInt(matches[columnIndex], 10);
        }

        const errorMessages = matches.input?.match(/^.*?([a-z]*Error:[^\r\n]+).*$/mi);
        if (errorMessages) {
            info.message = errorMessages[1];
        }

        info.message += `(${ matches[1].replace(/^.+\/mew\/(.+)$/, '~/$1') }).`;
    }
    else {
        info.line = error.line;
        info.column = error.col ?? error.column;
    }

    info.code = error.code || info.code || '998';
    info.rule = error.rule || info.rule || 'syntax';

    return info as LintError;
}

// TODO: 换第三方实现
/**
 * 对象属性拷贝
 *
 * @param {Object} target 目标对象
 * @param {...Object} source 源对象
 * @return {Object} 返回目标对象
 */
export function extend<T extends object>(target: T, ...args: any[]): T {
    const { toString, hasOwnProperty } = Object.prototype;

    function isObject(target: unknown) {
        return toString.call(target) === '[object Object]';
    }

    for (const src of args) {
        if (src == null) {
            continue;
        }

        for (const key in src) {
            if (hasOwnProperty.call(src, key)) {
                target[key] = isObject(src[key])
                    ? extend(isObject(target[key]) ? target[key] : {}, src[key])
                    : src[key];
            }
        }
    }

    return target;
}

/**
 * 构建用于文件名匹配的正则
 *
 * @param {string|RegExp} stringSplitByComma 逗号分隔的文件名列表或匹配的正则
 * @return {RegExp} 构建后的正则
 */
export function buildRegExp(stringSplitByComma?: string | RegExp): RegExp {
    if (stringSplitByComma instanceof RegExp) {
        return stringSplitByComma;
    }

    if (!stringSplitByComma) {
        return /.*/i;
    }

    const array = stringSplitByComma
        .replace(/[^a-z\d_,\s]/gi, '\\$&')
        .split(/\s*,\s*/);
    const reg = array.length === 1 ? array[0] : `(${ array.join('|') })`;

    return new RegExp(`\\.${ reg }$`, 'i');
}

/**
 * 为在控制台输出的字符着色
 *
 * @param {string} text 要着色的字符
 * @param {string=} color chalk 合法的颜色名，非法名将导致不着色
 * @return {string}  着色后的字符
 */
export function colorize(text: string, color?: string | false): string {
    if (color && chalk[color]) {
        return chalk[color](text);
    }

    return text;
}

type TransformWrapper = (file: ReportFile, callback: (error?: Error | null, file?: ReportFile) => void) => void;

/**
 * map-stream 化
 *
 * @param {Function} transform transform 操作
 * @param {Function=} flush flush 操作
 * @return {Transform}  转换流
 */
export function mapStream(
    transform: TransformWrapper,
    done?: (error?: Error | null, data?: ReportFile | File) => void
): Transform {
    const stream = map(transform);

    if (typeof done === 'function') {
        stream.on('end', done);
    }

    return stream;
}

/**
 * 写入配置文件内容到指定路径，支持 js,json,yml后缀
 *
 * @param {Object}} config 配置内容
 * @param {string} filePath 配置文件路径
 */
export function writeConfigFile(config: Config, filePath: string) {
    const extname = path.extname(filePath);
    let content: string;

    switch (extname) {
        case '.js':
            content = `module.exports = ${ beautifyJsConfig(config) };`;
            break;

        case '.json':
            content = JSON.stringify(config, null, 4);
            break;

        case '.yaml':
        case '.yml':
            content = yaml.dump(config, { sortKeys: true });
            break;

        default:
            throw new Error(`not support config file type ${ extname }`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * 文本转化为 mew 可识别的 stream 流
 *
 * @param {string} text 文本内容
 * @param {string} path 文件路径
 * @return {Stream}  流
 */
export function getTextStream(text: string, path: string, cwd: string = process.cwd()): Readable {
    const strBuffer = Buffer.from(text);
    const strFile = new File({
        contents: strBuffer,
        cwd,
        path,
        stat: {} as fs.Stats
    });

    strFile.stat!.size = strBuffer.byteLength;

    const strStream = new Readable({ objectMode: true });
    strStream.push(strFile);
    strStream.push(null);

    return strStream;
}


/**
 * 格式化配置为 mew 可通过的格式
 *
 * @param {Object} Config 配置对象
 * @param {number} indent 缩进
 * @return {string} 格式化后的字符串
 */
export function beautifyJsConfig(config: Config, indent = 4): string {
    const rawText = JSON.stringify(config, null, indent);
    const beautyText = rawText.replace(/\t/g, ' '.repeat(indent))
        // 替换 key
        .replace(/(?<=[ [{])(")([\w:,.!@#$%^&*\-+/]+)(")(?=: )/g,
            ($0, lq, property) => (property.match(/\W/) ? `'${ property }'` : property))
        // 替换value
        .replace(/(?<=[ [])"([^"]*?)"(?=[\n},\]])/g, '\'$1\'');
    try {
        const pText = JSON.stringify(new Function(`return ${ beautyText }`)(), null, indent);
        if (pText === rawText) {
            return beautyText;
        }
    }
    catch (e) {
        // do nothing
    }
    return rawText;
}

/**
 * 给目标对象添加属性
 *
 * @param target 目标对象
 * @param path 想要修改的属性的路径
 * @param value 目标属性对应的值
 */
export function setProperty<T extends object>(target: T, path: string[], value: string | boolean | number): T {
    if (!isObject(target) || !Array.isArray(path) || path.length === 0) {
        return target;
    }
    let temp: object = target;
    for (let i = 0; i < path.length; i++) {
        if (i === path.length - 1) {
            temp[path[i]] = value;
            return target;
        }

        if (isObject(temp[path[i]])) {
            temp = temp[path[i]];
        }
        else {
            temp[path[i]] = temp = {};
        }
    }

    return target;
}

export function getCLIName(name: string) {
    return name.replace(/^@|\/.+$/g, '');
}

function isObject<T>(target: T): boolean {
    return target !== null && typeof target === 'object';
}
