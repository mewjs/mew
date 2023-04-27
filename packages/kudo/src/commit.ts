/**
 * @file 校验错误信息输出
 */
import type { File } from './types';

/**
 * 提交类
 *
 * @param id 提交的 id
 * @param date 提交时间
 */
export default class Commit {
    pid = '';
    files?: string[] | File[];

    constructor(public id: string, public author: string, public date: Date, public title: string) {
        this.pid = `${ id }^`;
        console.log('\tCommit: %s\n\tAuthor: %s\n\tDate: %s\n\tTitle: %s\n', id, author, date, title);
    }

    /**
     * 从 git-log 输出中分析生成提交实例
     *
     * @param log git-log 的输出
     * @return 提交实例
     */
    static from(log: string): Commit | null {
        const [id, author, date, ...title] = log.replace(/\s*[\r\n]+/g, '').split(',');

        if (date) {
            return new Commit(id, author, new Date(date), title.join(','));
        }

        return null;
    }

}
