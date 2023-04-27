import path from 'path';
import type { Transform } from 'stream';

import console from '../console';
import type { LintError, LintFile, Filters, CliOptions, Log, ReportFile } from '../types';
import {
    mapStream,
    Severity,
    colorize
} from '../util';
import filterBuilder from './filter';

const MAX_LINE_LEN = 4;
const MAX_COLUMN_LEN = 4;
const MAX_MESSAGE_LEN = 62;

export type TransformFn = (file: ReportFile, json: LintFile[], filter: Filters, options: CliOptions) => boolean;

export type Flush = (success: boolean, json: LintFile[], count: number, errors: number) => void;

export interface Reporter {
    options?: CliOptions;
    log?: Log;

    /**
     * 校验错误信息输出报告
     *
     * @param {vinyl.File} file 校验的 vinyl 文件对象
     * @param {LintError[]} json 收集所有错误信息的数组
     * @param {Filter} filter 过滤函数组
     * @param {CliOptions} options cli 参数
     * @return {boolean} 标记是否通过检查（仅当没有 ERROR 级别的）
     */
    transform: TransformFn;
    flush?: Flush;
}

const defaultReporter: Reporter = {


    transform(file, json, filter, options) {
        this.options = options;
        let { errors, path, relative, url } = file;
        const item = { path, relative, url, code: '', errors } as LintFile;
        errors = item.errors = file.errors = filter(errors.map(error => {
            const {
                line,
                column,
                endLine,
                endColumn,
                origin,
                message,
                linter,
                rule = 'syntax'
            } = error;

            const severity = typeof origin?.severity === 'string'
                // stylelint 的 severity 是 error, warning 字符串，这里统一转换成 eslint 的错误等级
                ? (origin.severity === 'error' || rule === 'syntax' ? 2 : 1)
                : (+origin?.severity || 1);

            const isColorize = options.color;

            let info = '';

            // 全局性的错误可能没有位置信息
            if (typeof line === 'number') {
                info += `:${ line }`;

                if (typeof column === 'number' && column > 0) {
                    info += `:${ column.toString() }`;
                }

                info = `${ info.padStart(MAX_LINE_LEN + MAX_COLUMN_LEN) } `;
            }

            // Severity 可能是数字或者字符串: eslint 数字，stylelint 字符串
            info = colorize(info, isColorize && (severity === Severity.ERROR ? 'red' : 'yellow'));

            info += message.padEnd(MAX_MESSAGE_LEN, ' ');

            if (options.rule) {
                info += ` ${ colorize(rule, isColorize && 'gray') }`;
            }

            return {
                line,
                endLine,
                column,
                endColumn,
                message,
                rule,
                info,
                linter,
                origin,
                severity,
                suggestions: error.suggestions
            };
        })) as LintError[];

        // 对提示信息作排序
        if (options.sort) {
            errors = errors.sort((a, b) => (a.line - b.line) || (a.column - b.column));
        }


        let success = true;
        if (!errors.length) {
            return success;
        }

        if (!options.silent) {
            this.log?.info('%s (%s message%s)', url || relative, errors.length, errors.length > 1 ? 's' : '');
        }

        errors.forEach(error => {
            // 仅当所有错误违反的是 [建议] 规则时算通过
            success = success && error.severity === Severity.WARN;

            if (!options.silent) {
                console.log(error.info);
            }
        });

        if (options.code) {
            item.code = file.contents?.toString() || '';
        }

        json.push(item);

        return success;
    },

    flush(success, json, count, errors) {
        if (!this.options?.silent) {
            this.log?.info(
                'Found %s issue%s in %s of %s file%s.',
                String(errors).replace(/\d(?=(\d{3})+$)/g, '$&,'),
                errors > 1 ? 's' : '',
                json.length,
                count,
                count > 1 ? 's' : ''
            );
        }
    }
};

/**
 * 默认 reporter
 *
 * @param {Reporter} reporter 实现与 defaultReporter 类型的 transform 与 flush 方法的对象
 * @param {Log} log 实现相关 log 方法的对象
 * @param {CliOptions} options cli 参数
 * @return {Transform} 转换流
 */
function buildReporter(reporter: Reporter, log: Log, options: CliOptions): Transform {
    let success = true;
    const json = [] as LintFile[];
    const globalFilter = filterBuilder.get(options);

    reporter.log = log;
    let fileCount = 0;
    let errorCount = 0;

    return mapStream(
        (file, callback) => {
            fileCount++;

            const { errors } = file;

            if (errors?.length) {
                const filter = file.filter ? filterBuilder.get(file.filter) : globalFilter;

                const transform = reporter.transform || defaultReporter.transform;
                success = transform.call(reporter, file, json, filter, options) && success;

                errorCount += file.errors.length;
            }

            callback(null, file);
        },

        /**
         * @this Transform
         */
        function done(this: Transform) {
            if (typeof reporter.flush === 'function') {
                reporter.flush(success, json, fileCount, errorCount);
            }

            this.emit('done', success, json, fileCount, errorCount);
        }
    );
}

/**
 * 获取配置指定的 reporter，否则使用 defaultReporter
 *
 * @param {Log} log 实现相关 log 方法的对象
 * @param {CliOptions} options cli 参数
 * @return {Transform} 能返回转换流的函数
 */
export function get(log: Log, options: CliOptions): Transform {
    const { reporter } = options;

    if (!reporter || reporter === 'default') {
        return buildReporter(defaultReporter, log, options);
    }

    if (typeof reporter === 'function') {
        return buildReporter({ transform: reporter as TransformFn }, log, options);
    }

    if (
        Object.prototype.toString.call(reporter) === '[object Object]'
            && ((reporter as Reporter).transform
            || (reporter as Reporter).flush)
    ) {
        return buildReporter(reporter as Reporter, log, options);
    }


    // user reporter or native reporter
    const dir = ~String(reporter).indexOf('/') ? process.cwd() : __dirname;
    const modulePath = path.join(dir, String(reporter));

    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return buildReporter(require(modulePath), log, options);
    }
    catch (error) {
        log.error(error);
        return buildReporter(defaultReporter, log, options);
    }
}
