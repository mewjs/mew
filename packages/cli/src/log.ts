import { format } from 'util';
import chalk from 'chalk';

import pkg from '../package.json';
import console from './console';
import { getCLIName } from './util';
import type { Log, LogMethod } from './types';

const fns = [
    { name: 'trace', color: chalk.grey, level: 0 },
    { name: 'debug', color: chalk.grey, level: 1 },
    { name: 'info', color: chalk.green, level: 2 },
    { name: 'warn', color: chalk.yellow, level: 3 },
    { name: 'error', color: chalk.red, level: 4 },
    { name: 'fatal', color: chalk.red, level: 5 }
];

const name = getCLIName(pkg.name);

/**
 * 日志模块
 *
 * @param {boolean} color 是否使用颜色高亮输出
 * @return {Log} 包含 trace/debug/info/warn/error/fatal 等方法的 log 对象
 */
export function getLog(color: boolean): Log {
    const log = {} as Log;

    fns.forEach(item => {

        /**
         * 不同类型的 log 方法
         *
         * @param {string} format 要输出的内容.
         * @param {...*} args 变长参数.
         */
        log[item.name] = (color
            ? (tpl, ...args) => {
                const msg = format(tpl, ...args);
                if (msg) {
                    console.log(`${ name } ${ item.color(item.name.toUpperCase()) } ${ msg }`);
                }
                else {
                    console.log();
                }
            }
            : (tpl, ...args) => {

                const msg = format(tpl, ...args);
                if (msg) {
                    console.log(`${ name } [${ item.name.toUpperCase() }] ${ msg }`);
                }
                else {
                    console.log();
                }
            }) as LogMethod;
    });

    return log;
}

export default getLog;
