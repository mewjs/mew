/**
 * @file 校验错误信息输出
 */

import log from './log';
import show from './show';
import diff from './diff';
import read from './read';
import lint from './lint';
import type Commit from './commit';
import type { Diff, File } from './types';

/**
 * 计算相关提交的信息
 *
 * @param {Commit} commit 提交实例
 * @param {function(Commit)} done  以计算后的提交实例为参数的回调函数
 */
function compute(commit: Commit, done: (commit: Commit) => void) {
    let count = commit.files?.length ?? 0;
    if (!count) {
        done(commit);
        return;
    }

    const files: File[] = [];

    const countdown = function (file: File, diff: Diff) {
        count--;
        if (diff.lines || diff.isNew || file.filter?.lines) {
            files.push(file);
        }

        if (!count) {
            commit.files = files;
            done(commit);
        }
    };

    const diffCount = (file: File) => diff(file, countdown);

    (commit.files as string[])?.forEach(path => {
        read(commit, path, diffCount);
    });
}

/**
 * 开始分析指定 author 在指定时间内的提交
 *
 * @param {string=} name 提交代码的作者名字
 * @param {string=} since git 格式的时间段表示
 */
export default function deduce(name?: string, since?: string) {
    const args = ['--pretty=format:%h,%an,%ad,%s'];
    if (since) {
        args.unshift(`--author=${ name }`, `--since='${ since }'`);
    }

    if (name) {
        args.unshift(`--author=${ name }`);
    }
    else {
        args.unshift('HEAD..FETCH_HEAD');
    }

    console.time('kudo');

    log(args, commit => {
        if (!commit) {
            console.log('have no commit with git command: %s.', args.join(' '));
            return;
        }

        const countdown = (commit: Commit) => {
            lint(commit.files as File[]);
        };

        show(`${ commit.pid }..${ commit.id }`, files => {
            commit.files = files;
            compute(commit, countdown);
        });
    });
}
