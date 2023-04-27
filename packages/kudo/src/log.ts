/**
 * @file 校验错误信息输出
 */
import git from './git';
import Commit from './commit';

/**
 * 从 git-log 输出中分析所有提交
 *
 * @param {string[]} args git-log 命令参数
 * @param {function(Commit?)} done 以分析出所有提交实例数组调用的回调函数
 */
export default function log(args: string[], done: (commit?: Commit) => void) {

    const parseCommits = function (logs: string) {
        const commits = logs.split(/\r?\n/)
            .map(log => Commit.from(log))
            .filter(Boolean)
            .sort((a, b) => a!.date.getTime() - b!.date.getTime()) as Commit[];

        if (!commits.length) {
            return done();
        }

        const commit = commits.pop()!;

        // 只需要考虑首尾 commit 之间的差异，中间的 commit 可以忽略
        if (commits[0]) {
            commit.pid = commits[0].pid;
        }

        done(commit);
    };

    args.unshift('log');
    git(args, parseCommits);
}
