import type { ChildProcess, SpawnOptionsWithoutStdio } from 'child_process';
import { spawn } from 'child_process';

type Spawn = (command: string, args?: string[], options?: SpawnOptionsWithoutStdio) => ChildProcess;

/**
 * 对 child_process.spawn 的包装
 *
 * @param {string} command 要支持的命令
 * @param {?Array.<string>} args 要传递给 command 的参数列表
 * @property {?Object} options 配置项
 * @return {ChildProcess} 同原 spawn 的返回对象
 */
const exec: Spawn = process.env.comspec
    ? (command, args, options) => spawn(
        process.env.comspec ?? 'cmd.exe',
        ['/c', command].concat(args ?? []),
        options
    )
    : (command, args, options) => spawn(command, args, options);


type Queue = [string[], (data: string) => void];
interface Queues extends Array<Queue> {
    child?: ChildProcess | null;
}
const queue: Queues = [];

function run() {
    if (!queue.length || queue.child) {
        return;
    }

    const [args, done] = queue.shift() || [];

    const gitProcess = queue.child = exec('git', args);

    const list: Buffer[] = [];
    let length = 0;

    const each = function (data: Buffer) {
        list.push(data);
        length += data.length;
    };

    const finish = function () {
        gitProcess.stdout?.removeAllListeners();
        done?.(Buffer.concat(list, length).toString());
    };

    const exit = function () {
        finish();
        gitProcess.removeAllListeners();
        queue.child = null;
        process.nextTick(run);
    };

    gitProcess.on('error', error => {
        console.error(`git ${ args?.join(' ') }`);
        console.error(error);
        gitProcess.stdout?.removeAllListeners();
    });

    gitProcess.on('exit', exit);
    gitProcess.stdout?.on('data', each);

    git.debug && console.log(`git ${ args?.join(' ') }`);

    return gitProcess;
}

/**
 * 通过 spawn 执行 git 子命令
 *
 * @param {string[]} args git 命令参数
 * @param {function (string)} done 命令完后使用输出的字符回调函数
 */
export default function git(args: string[], done: (contents: string) => void) {
    queue.push([args, done]);
    run();
}

// HACK: 为了避免一路透传 CLI Options 的 debug
git.debug = false;
