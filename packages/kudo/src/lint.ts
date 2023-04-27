/**
 * @file 校验错误信息输出
 */
import through2 from 'through2';

import mew from '@mewjs/cli';
import type { LintFile } from '@mewjs/cli/lib/types';
import type { File } from './types';

/**
 * 使用 mew 检查所有提交涉及到的文件
 *
 * @param {File[]} files 所有有新增代码的文件
 */
export default function lint(files: File[]) {

    let total = 0;
    const stream = through2({ highWaterMark: 1000, objectMode: true });
    files.forEach(file => {
        // if (!file.filter?.lines) {
        //     return;
        // }

        stream.write(file);
        total += file.stat!.total;
    });

    stream.end(null);

    const options = mew.getOptions();
    options.command = 'check';
    options.stream = stream;
    options.rule = true;
    // options.lookup = false;

    const { log } = console;
    // console.log = function () {};

    const finish = function (success: boolean, files: LintFile[]) {
        let errors = 0;
        const errorLines = files.reduce((count, file) => {
            const set = new Set();
            errors += file.errors.length;

            count += file.errors.reduce((n, error) => {
                if (!set.has(error.line)) {
                    n++;
                    set.add(error.line);
                }

                return n;

            }, 0);

            return count;
        }, 0);

        log('files: %s, issues: %s, changed lines: %s of %s', files.length, errors, errorLines, total);

        if (errorLines < total) {
            log(`${ (100 - (errorLines * 100 / total)).toFixed(2) }%`);
        }

        console.timeEnd('kudo');
        process.exit(success ? 0 : 1);
    };

    mew.lint(options, finish);
}
