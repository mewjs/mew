/**
 * @file 校验错误信息输出
 */

import type { Diff } from './types';

/**
 * 新文件的标志
 *
 * @const
 * @type {string}
 */
const NEW_FILE_MODE = 'new file mode';

/**
 * 匹配 diff 中的行数的正则
 *
 * @const
 * @type {RegExp}
 */
const CHANGED_LINE_REG = /^@@ -\d+,\d+ \+(\d+),(\d+) @@/;

/**
 * 是否新增文件
 *
 * @param {string} diffs diff 输出的字符
 * @return {boolean}  是否新增加文件的结果
 */
function isNewFile(diffs: string): boolean {
    const secondLine = diffs.indexOf('\n');
    return diffs.slice(secondLine + 1, secondLine + 1 + NEW_FILE_MODE.length) === NEW_FILE_MODE;
}

/**
 * 从 diff 输出中解释出有改变的行数及适用于 `mew --lines` 过滤的 range
 *
 * @param {string} diffs  diff 的输出字符
 * @param {boolean} isNew 是否新文件
 * @return {Diff} 包含变更行数 lines 及 range 的对象
 */
function parse(log: string, isNew: boolean): Diff {
    const diffs = log.slice(log.indexOf('@@')).split(/\r?\n/);

    let lines = 0;
    const range: number[] = [];
    let line: string | undefined;
    let index = 0;
    let last = 0;
    let section: string[] = [];

    const push = function () {
        if (!section?.[0]) {
            return;
        }

        const [start, end] = section.map(n => parseInt(n, 10));

        if (end) {
            if (end - start < 2) {
                range.push(start);
                range.push(end);
            }
            else {
                range.push(start, end);
            }
        }
        else {
            range.push(start);
        }

        section.length = 0;
    };

    while ((line = diffs.shift()) != null) {
        const match = line.match(CHANGED_LINE_REG);
        if (match) {
            if (isNew) {
                lines = parseInt(match[2] ?? 0);
                break;
            }

            index = parseInt(match[1] ?? 0);
        }
        else {
            switch (line[0]) {
                case '-':
                    break;
                case '+':
                    if (last) {
                        if (index === last + 1) {
                            last = index;
                            section[1] = `${ last }`;
                        }
                        else {
                            last = 0;
                            push();
                        }
                    }
                    else {
                        last = index;
                        section = [`${ last }`];
                    }
                    lines++;
                    index++;
                    break;
                default:
                    index++;
                    last = 0;
                    push();
                    break;
            }
        }
    }

    if (section?.length) {
        push();
    }

    return { lines, range, isNew };

}

/**
 * 从 diff 输出中分析
 *
 * @param {string} diffs diff 的输出
 * @return {Object} 包含变更行数 lines 及 range 的对象
 */
export default function analyze(diffs: string): Diff {
    const isNew = isNewFile(diffs);
    return parse(diffs, isNew);
}
