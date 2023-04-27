/**
 * @file 校验错误信息输出
 */
import git from './git';
import analyze from './analyze';
import type { Diff, File } from './types';

/**
 * 分析提交中文件的变更信息
 *
 * @param file  模拟文件对象
 * @param done 用分析后的文件对象调用的回调函数
 */
export default function diff(file: File, done: (file: File, diff: Diff) => void) {

    const finish = function (diffs: string) {
        const result = analyze(diffs);

        file.stat = {
            size: file.contents.length,
            total: result.lines
        };

        // TODO: 可配置
        file.filter = { lines: result.range.join(','), level: 2 };

        done(file, result);
    };

    git(
        ['diff', `${ file.pid }`, file.cid, '--', file.path],
        finish
    );
}
