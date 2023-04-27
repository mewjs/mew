/**
 * @file 找到变更的文件
 */
import git from './git';

/**
 * 从 git-show 输出中匹配文件路径的正则
 */
const FILE_REG = /^\s*\S+(?=\s*\|)/gm;

/**
 * 从 git-show 输出中分析提交区间的所有前端文件
 *
 * @param range 提交区间（firstCommitId^..lastCommitId）
 * @param done 使用包含本次相关文件的提交对象调用的回调函数
 */
export default function show(range: string, done: (files: string[]) => void) {
    const finish = function (data: string) {
        const files: string[] = [];
        new Set(
            (data.match(FILE_REG) || [])
                .map(name => name.trim())
                .filter(name => /.+\.(?:[jt]sx?|css|s[ac]ss|styl|less|html?|vue|md)$/.test(name))
        ).forEach(file => files.push(file));

        done(files);
    };

    git(
        [
            'show',
            range,
            '--pretty=format:',
            '--diff-filter=AM',
            '--stat=1200',
            '--stat-graph-width=1'
        ],
        finish
    );
}

