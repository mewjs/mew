/**
 * 错误等级
 *
 * @enum {number}
 */
declare enum Severity {
    WARN = 1,
    ERROR = 2,
    // error = 'error',
    // warn = 'warn'
}

interface CliOptions {
    cwd?: string;
    config?: string;
    lookup: boolean;
    stream: boolean | NodeJS.ReadableStream;
    silent: boolean;
    sort?: boolean;
    format?: string;
    color: boolean;
    code: boolean;
    time: boolean;
    type: string;
    project?: string;
    ignore?: boolean;
    ignorePattern?: string;
    output?: string;
    maxSize: number;
    maxError: number;
    debug?: boolean;
    _: (string | number)[];
    [x: string]: unknown;
}

interface BaseError {
    severity: Severity | string;
    line: number;
    column: number;
    rule: string;
    col?: number;
    code?: string;
}

interface OriginError extends BaseError {
    severity: Severity | string;
    nodeType?: string;
    messageId?: string;
    endLine?: number;
    endColumn?: number;
    fix?: any;
    message: string;
    stack?: string;
}

interface LintError extends BaseError {
    type?: string;
    origin: OriginError;
    linter: string;
    message: string;
    info: string;
}

interface LintFile {
    path: string;
    relative: string;
    contents?: string | Buffer | NodeJS.ReadStream;
    url: string;
    code: string;
    isIgnored?: boolean;
    errors: LintError[];
}

interface LintResult extends Array<LintFile> {}

type Filter = (error: BaseError) => boolean;

type Filters = (errors: BaseError[]) => BaseError[];


type LogMethod = (tpl: string, ...args: any[]) => void;

// interface Log {
//     trace: LogMethod;
//     debug: LogMethod;
//     info: LogMethod;
//     warn: LogMethod;
//     error: LogMethod;
//     fatal: LogMethod;
// }

type Log = Record<'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal', LogMethod>;


// interface ReportFile extends File {
//     errors: LintError[];
// }

// interface Transform {
//     (file: ReportFile, json: LintFile[], filter: Filters, options: CliOptions): boolean
// }

// interface Reporter {
//     log?: Log;
//     /**
//      * 校验错误信息输出报告
//      *
//      * @param {vinyl.File} file 校验的 vinyl 文件对象
//      * @param {LintError[]} json 收集所有错误信息的数组
//      * @param {Filter} filter 过滤函数组
//      * @param {CliOptions} options cli 参数
//      * @return {boolean} 标记是否通过检查（仅当没有 ERROR 级别的）
//      */
//     transform: Transform;
//     flush?: (success: boolean, json: LintError[], count: number, errors: number) => void;
// }

type ConfigValue = string | number | boolean | (string | number)[] | Config;
interface Config {
    mew?: boolean;
    linters?: any;
    format?: any;
    level?: number;
    [index: number]: ConfigValue;
    [key: string]: ConfigValue;
}


interface BaseOptions {
    type: string;
    name: string;
    suffix: string | RegExp;
    ignore: string | RegExp;
}


interface FixerOptions extends BaseOptions {
}


interface LinterOptions extends BaseOptions {
}
