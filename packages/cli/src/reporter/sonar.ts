import console from '../console';
import type { LintFile, LintError, BaseError, Filters, CliOptions, OriginError } from '../types';
import { Severity } from '../util';

export interface SonarFile extends LintFile {
    errors: LintError[];
}

export interface SonarError extends BaseError {
    ruleId: string;
    message: string;
    column: number;
    nodeType: string;
    messageId: string;
    endLine: number;
    endColumn: number;
}

export interface SonarResult {
    filePath: string;
    messages: SonarError[];
    errorCount: number;
    warningCount: number;
    fixableErrorCount: number;
    fixableWarningCount: number;
    source?: string;
}

/**
 * 校验错误信息输出报告
 *
 * @param {vinyl.File} file 校验的 vinyl 文件对象
 * @param {Array.<Object>} results 收集所有错误信息的数组
 * @param {Function} filter 过滤函数组
 * @param {Object} options cli 参数
 * @return {boolean} 标记是否通过检查（仅当没有 ERROR 级别的）
 */
export function transform(file: SonarFile, results: SonarResult[], filter: Filters, options: CliOptions): boolean {
    let errorCount = 0;
    let warningCount = 0;
    let fixableErrorCount = 0;
    let fixableWarningCount = 0;
    let { errors, relative: filePath } = file;

    // 对提示信息作排序
    if (options.sort) {
        errors = errors.sort((a, b) => {
            const { line: al = 0, column: ac = 0 } = a;
            const { line: bl = 0, column: bc = 0 } = b;
            return al - bl || ac - bc;
        });
    }
    const messages = filter(errors.map(error => {
        const {
            rule = 'syntax',
            linter,
            message,
            line = 0,
            column = 0,
            origin
        } = error;

        const severity = (origin.severity === Severity.ERROR || origin.severity === 'error')
            ? Severity.ERROR
            : Severity.WARN;

        if (severity === Severity.ERROR) {
            errorCount++;
            if (origin.fix) {
                fixableErrorCount++;
            }
        }
        else {
            warningCount++;
            if (origin.fix) {
                fixableWarningCount++;
            }
        }

        return {
            ruleId: `mew:${ linter }(${ rule })`,
            severity,
            message,
            line,
            column,
            nodeType: origin.nodeType ?? '',
            messageId: (origin as OriginError).messageId ?? '',
            endLine: origin.endLine ?? line,
            endColumn: origin.endColumn ?? column
        } as SonarError;
    })) as SonarError[];

    results.push({
        filePath,
        messages,
        errorCount,
        warningCount,
        fixableErrorCount,
        fixableWarningCount,
    });

    return !errorCount;
}

/**
 * 输出错误报告
 *
 * @param {boolean} success 是否成功
 * @param {LintError[]} errors 收集所有错误信息的数组
 */
export function flush(success: boolean, errors: LintError[]) {
    console.log(JSON.stringify(errors, null, 2));
}
