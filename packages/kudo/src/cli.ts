import yargs from 'yargs';

import { version, license } from '../package.json';
import git from './git';
import deduce from './index';


export interface Options {
    author?: string;
    since?: string;
    debug?: boolean;
    _: (string | number)[];
    [x: string]: unknown;
}

export default function run(argv?: string[]) {
    const options: Options = yargs(argv || process.argv.slice(2))
        .usage('Usage: $0 [author] [options]')
        .option('since', {
            alias: ['s', 'from'],
            describe: '起始时间',
            default: '',
            type: 'string'
        })
        .option('author', {
            alias: ['a', 'name'],
            describe: '代码作者',
            default: '',
            type: 'string'
        })
        .option('fetch', {
            alias: ['f', 'update'],
            describe: '先拉取最新的 git 数据',
            default: false,
            type: 'boolean'
        })
        .option('debug', {
            alias: 'd',
            describe: '调试模式：打印调试信息（会自动穿透给 mew）',
            default: false,
            type: 'boolean'
        })
        .version(version)
        .alias('version', 'v')
        .help('help')
        .alias('help', 'h')
        .alias('help', '?')
        .example('$0', '检查本地当前分支与远程分支的差异代码')
        .example('$0 --since 1.weeks.ago', '检查 1 周内本地当前分支与远程分支的差异代码')
        .example('$0 jack 3.days.ago', '检查 jack 从 3 天前开始的代码')
        .example('$0 lucy --since 1.months.ago', '检查 lucy 从 1 月前开始的代码')
        .epilogue(license)
        .argv;

    git.debug = !!options.debug;

    const [name = options.author, since = options.since] = options._;

    // 如果没有指定 name，则拉取远程最新代码，以便后续作与本地代码的 diff
    if (options.fetch || !name) {
        git(['fetch'], () => {
            deduce(name as string, since as string);
        });
    }
    else {
        deduce(name as string, since as string);
    }
}

