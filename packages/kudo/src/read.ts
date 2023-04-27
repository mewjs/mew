/**
 * @file 校验错误信息输出
 */
import type Commit from './commit';
import git from './git';
import type { File } from './types';

/**
 * 是否空文件，模拟的 vinyl 文件对象的方法
 *
 * @return {boolean} 恒为 false
 */
function isNull(): false {
    return false;
}

/**
 * 读取某个提交中指定路径的文件内容
 *
 * @param {Commit} commit 提交对象实例
 * @param {string} path  要读取的文件路径
 * @param {function(Object)} done 使用包含读取到的文件内容的模拟 vinyl 文件对象调用的回调函数
 */
export default function read(commit: Commit, path: string, done: (vinylFile: File) => void) {
    git(
        ['show', `${ commit.id }:${ path }`],
        (contents: string) =>
            done({
                path,
                relative: path,
                contents,
                isNull,
                pid: commit.pid,
                cid: commit.id
            })
    );
}
