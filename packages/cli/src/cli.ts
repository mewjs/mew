import yargs from 'yargs';
import { version, license } from '../package.json';
import console from './console';
import type { CliOptions, Command } from './types';

/**
 * 获取命令行选项对象
 *
 * @return {CliOptions} yargs 对命令行参数解释后的对象
 */
// eslint-disable-next-line max-lines-per-function
export function getOptions(argv?: string[]): CliOptions {
    const options = yargs(argv || process.argv.slice(2))
        .usage('Usage: $0 [command] [fileOrDirectory...] [options]')
        .option('config', {
            alias: 'c',
            describe: '指定配置文件（暂未支持）',
            type: 'string'
        })
        .option('lookup', {
            alias: 'l',
            describe: '是否查找自定义配置',
            default: true,
            type: 'boolean'
        })
        .option('stream', {
            alas: 's',
            describe: '是否检查文件流',
            default: false,
            type: 'boolean'
        })
        .option('silent', {
            describe: '是否禁止 log 打印',
            default: false,
            type: 'boolean'
        })
        .option('fix', {
            describe: '是否修复问题（等于 fix --replace）',
            default: false,
            type: 'boolean'
        })
        .option('maxSize', {
            describe: '限制处理的文件大小',
            default: Number.MAX_SAFE_INTEGER,
            type: 'number'
        })
        .option('maxError', {
            describe: '限制发现的最多错误数',
            default: 0,
            type: 'number'
        })
        .option('cwd', {
            describe: '指定工作目录',
            type: 'string'
        })
        .option('format', {
            describe: '指定输出格式',
            type: 'string'
        })
        .option('color', {
            describe: '输出颜色高亮的信息',
            default: true,
            type: 'boolean'
        })
        .option('code', {
            describe: '检查错误中是否包含代码',
            default: false,
            type: 'boolean'
        })
        .option('time', {
            describe: '输出运行耗时统计',
            default: true,
            type: 'boolean'
        })
        .option('type', {
            alias: 'ext',
            describe: '要处理的文件类型，多种类型间以半角逗号分隔',
            default: 'js,jsx,ts,tsx,css,html,wxml,vue,md',
            type: 'string'
        })
        .option('project', {
            alias: 'p',
            describe: '以项目方式处理相关文件（仅当检查 TypeScript 文件时使用）',
            type: 'string'
        })
        .option('ignore', {
            describe: '不忽略 .mewignore 中的文件',
            type: 'boolean'
        })
        .option('ignorePattern', {
            describe: '使用 glob 表达式过滤要忽略的文件',
            type: 'string'
        })
        .option('sort', {
            default: true,
            describe: '是否按行列升序显示错误',
            type: 'boolean'
        })
        .command('fix', 'fix errors.', yargs => {
            yargs
                .usage('$0 fix [fileOrDirectory...] [options]')
                .option(
                    'output',
                    {
                        describe: '指定格式化后的输出目录',
                        default: './output',
                        type: 'string'
                    }
                )
                .option('replace', {
                    describe: '指定格式化后是否替换原文件',
                    default: false,
                    type: 'boolean'
                });
        })
        .command('lint', 'lint code.', yargs => {
            yargs
                .usage('$0 lint [fileOrDirectory...] [options]')
                .option(
                    'lines',
                    {
                        describe: '按代码行过滤错误（通常用于 git diff 部分检查）',
                        type: 'string'
                    }
                )
                .option(
                    'level',
                    {
                        describe: '按错误级别过滤',
                        type: 'string'
                    }
                )
                .option(
                    'maxerr',
                    {
                        default: 0,
                        describe: '最多显示的错误数',
                        type: 'number'
                    }
                )
                .option(
                    'rules',
                    {
                        describe: '按检查规则名过滤',
                        type: 'string'
                    }
                )
                .option(
                    'rule',
                    {
                        describe: '是否显示检查的代码规则',
                        default: false,
                        type: 'boolean'
                    }
                )
                .option('reporter', {
                    alias: 'r',
                    describe: '报告实现名（default|sonar）',
                    type: 'string'
                });
        })
        .command('init', 'init mew config.', yargs => {
            yargs
                .usage('$0 init [options]')
                .option(
                    'moduleType',
                    {
                        describe: '模块类型 import/export(esm) | require/exports(commonjs) | none',
                        default: 'esm',
                        type: 'string'
                    }
                )
                .option(
                    'framework',
                    {
                        describe: '项目框架 react | vue | none',
                        default: 'react',
                        type: 'string'
                    }
                )
                .option(
                    'typescript',
                    {
                        describe: '是否使用 typescript',
                        default: false,
                        type: 'boolean'
                    }
                )
                .option(
                    'env',
                    {
                        describe: '项目运行环境 browser | node',
                        type: 'string'
                    }
                )
                .option(
                    'format',
                    {
                        describe: '配置文件格式 js | yaml | json',
                        default: 'js',
                        type: 'string'
                    }
                )
                .option(
                    'hooks',
                    {
                        describe: '是否添加 git hooks',
                        default: true,
                        type: 'boolean'
                    }
                );
        })
        .version(version)
        .alias('version', 'v')
        .help('help')
        .alias('help', 'h')
        .alias('help', '?')
        .example('$0 [lint] url', '对指定 URL 作检查（按 HTML 类型）')
        .example('$0 [lint] file', '对指定文件作检查')
        .example('$0 [lint] ./directory', '对指定目录下所有相关文件作检查')
        .example('$0 fix file', '修复指定文件代码')
        .example('$0 fix ./directory', '修复指定目录下的所有相关文件')
        .example('$0 init ', '初始化配置')
        .epilogue(license);

    return options.argv;
}

function tryResolveCommand(path: string): boolean {
    try {
        require.resolve(path);
        return true;
    }
    catch (e) {
        return false;
    }
}

/**
 * 命令行参数处理
 */
export function parse() {
    const options = getOptions();

    let cmd = options._[0] as string;

    if (options.fix) {
        cmd = 'fix';
        options._.unshift(cmd);
        options.replace = true;
    }

    if (cmd && tryResolveCommand(`./cli/${ cmd }`)) {
        cmd = options._.shift() as string;
    }
    else if (!options.help) {
        cmd = 'lint';
    }

    if (options.silent && (options.format || !options.stream)) {
        console.log = () => void 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    (require(`./cli/${ cmd }`) as Command).run(options);
}
