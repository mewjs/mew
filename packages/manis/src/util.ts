import { homedir } from 'os';
import { resolve, dirname } from 'path';
import merge from 'merge';
import { load, type LoadOptions } from 'js-yaml';
import stripJSONComment from 'strip-json-comments';

import type { Config, Loader, Stopper } from './types';

const { toString } = Object.prototype;


/**
 * 对象属性拷贝
 *
 * @param target 目标对象
 * @param sources 源对象
 * @return 返回目标对象
 */
export function extend<T>(target: Partial<T>, ...sources: (Partial<T> | null | undefined)[]): Partial<T> {
    for (const source of sources) {
        if (source == null) {
            continue;
        }

        target = merge.recursive(true, target, source);
    }

    return target;
}

/**
 * 混合对象
 *
 * @param args 要混合的对象
 * @return 混合后的对象
 */
export function mix<T>(...args: (Partial<T> | null)[]): Partial<T> {
    return extend(Object.create(null), ...args);
}

/**
 * 挑选第一个非空的对象
 *
 * @param objects 对象集合
 * @return 第 1 个非空的对象
 */
export function pick<T>(objects: (T | null | undefined)[]): T {
    for (const object of objects) {
        if (object && Object.keys(object).length > 0) {
            return object;
        }
    }

    return Object.create(null);
}

// [object <CustomTypeHere>]
const TYPE_PREFIX_LENGTH = '[object '.length;
const TYPE_SUFFIX_LENGTH = ']'.length;

/**
 * Get type of target
 *
 * @param target 需要判断的类型
 * @return 类型的字符串描述
 */
export const typeOf = (target: unknown): string =>
    toString.call(target)
        .slice(TYPE_PREFIX_LENGTH, -TYPE_SUFFIX_LENGTH)
        .toLowerCase();


/**
 * User's home directory
 */
export const homeDirectory = homedir();

/**
 * Default loader
 *
 * @param content string to be parsed
 * @param path config file path
 * @param options options for yaml.safe
 * @return config object
 */
export const defaultLoader: Loader = (
    content: string,
    path: string,
    options: LoadOptions = { filename: path, json: true }
): Config => {
    if (path.endsWith('.js')) {
        return (require(path) ?? {}) as Config;
    }

    try {
        return (
            load(stripJSONComment(content), options) ?? {}
        ) as Config;
    }
    catch (e) {
        throw new Error(
            `Cannot read config file: ${ path }\nError: ${ e.message }`
        );
    }
};

/**
 * Default stopper
 *
 * @param currentPath current path
 * @param root root path
 * @param times 对应路径的 JSON
 * @return 是否继续查找
 */
export const defaultStopper: Stopper = (
    currentPath: string,
    root: string,
    times: number
): boolean => times > 100 || String(currentPath).toLowerCase() === String(root).toLowerCase();

/**
 * 从工作目录向上查找包含指定文件的路径
 *
 * @inner
 * @param start 开始查找的目录
 * @param stopper 终结查找的判断方法
 */
export function findUp(
    start: string,
    callback: (dir: string) => boolean,
    stopper = defaultStopper
) {

    let root = resolve('/');

    // windows 下可能存在盘符不一致， 或者盘符大小写不一致的情况
    // 比如此处，可能存在下列几种情况：
    //     1: root === 'C:\', start === 'C:\test.js'
    //     2: root === 'C:\', start === 'c:\test.js'
    //     3: root === 'C:\', start === 'D:\test.js'
    //     4: root === 'C:\', start === 'd:\test.js'
    // 其中， 2， 3， 4 三种情况会导致后续的 while 循环变成无限循环
    // 此处将 root 的大小写和 start 保持一致
    if (/^[a-z]:/i.test(root) && /^[a-z]:/i.test(start)) {
        if (/^[a-z]:/.test(start)) {
            root = root.toLowerCase();
        }
        else {
            root = root.toUpperCase();
        }
    }

    let last: string;
    let times = 0;

    while (true) {
        if (stopper(start, root, ++times) || callback(start)) {
            break;
        }

        last = start;
        start = dirname(start);

        // Windows 下， 如果进行到根目录， 上面的 resolve 执行后没有变化
        // 即 resolve('D:\', '..') === 'D:\'
        // 此时若 root 为不同盘符， 比如'C:\', 上面的默认 stopper 会永远返回 false
        // 成为无限循环， 此处判断后 break
        if (last === start) {
            break;
        }
    }
}
