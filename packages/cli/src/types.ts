/* eslint-disable @typescript-eslint/no-explicit-any */
import type File from 'vinyl';

export { FileFilter } from './ignored';

interface Position {
    line: number;
    column: number;
}

/**
 * 错误等级
 *
 * @enum {number}
 */
export declare enum Severity {
    WARN = 1,
    ERROR = 2,
    // error = 'error',
    // warn = 'warn'
}


/**
 * 错误等级
 */
export enum SeverityString {

    /**
     * warning
     */
    WARN = 'warning',

    /**
     * error
     */
    ERROR = 'error'
}

export type LintType = 'js'
| 'jsx'
| 'ts'
| 'tsx'
| 'md'
| 'markdown'
| 'ejs'
| 'es'
| 'es6'
| 'vue'
| 'san'
| 'atom'
| 'css'
| 'styl'
| 'stylus'
| 'less'
| 'sass'
| 'scss'
| 'html';

/**
 * eslint fix 参数
 */
export interface FixInstruction {
    range: [number, number];
    text: string;
}

export interface Suggestion {
    desc: string;
    fix: FixInstruction;
}

/**
 * eslint 错误定义
 */
export interface EslintLintError {
    line: number;
    endLine: number;
    column: number;
    endColumn: number;
    message: string;
    nodeType: string;
    ruleId: string;
    rule: string;
    severity: Severity;
    ruleInformation?: string;
    fix?: FixInstruction;
    suggestions?: Suggestion[];
}

/**
 * 检查代码结果
 */
export interface LintTextResult {

    /**
     * 是否检查通过:0 error
     */
    success: boolean;

    /**
     * 检查结果
     */
    errors: LintError[];
}

/**
 * 修复代码结果
 */
export type FixTextResult = string | null;

export interface CliOptions {
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
    fix?: boolean;
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

export interface BaseError {
    severity: Severity | string;
    line: number;
    column: number;
    rule: string;
    col?: number;
    code?: string;
    suggestions?: Suggestion[];
}

export interface OriginError extends BaseError {
    severity: Severity | string;
    nodeType?: string;
    messageId?: string;
    endLine?: number;
    endColumn?: number;
    fix?: FixInstruction;
    message: string;
    stack?: string;
    ruleInformation?: string;
}

export interface LintError extends BaseError {
    type?: string;
    origin: EslintLintError | OriginError;
    linter: string;
    message: string;
    info: string;
    endLine?: number;
    endColumn?: number;
}

export interface LintFile {
    path: string;
    relative: string;
    contents?: string | Buffer | NodeJS.ReadStream;
    url: string;
    code: string;
    isIgnored?: boolean;
    errors: LintError[];
}

export interface LintResult extends Array<LintFile> {}

export type Filter = (error: BaseError) => boolean;

export type Filters = (errors: BaseError[]) => BaseError[];


export interface ReportFileFiler {
    lines: string;
    level: number;
    rules: string;
}
export interface ReportFile extends File {
    // relative?: string;
    // path?: string;
    // contents?: string;
    url?: string;
    errors: LintError[];
    filter?: ReportFileFiler;
    isIgnored?: boolean;
}

export type LogMethod = (tpl: string, ...args: any[]) => void;

// interface Log {
//     trace: LogMethod;
//     debug: LogMethod;
//     info: LogMethod;
//     warn: LogMethod;
//     error: LogMethod;
//     fatal: LogMethod;
// }

export type Log = Record<'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal', LogMethod>;


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

export type ConfigValue = string | number | boolean | undefined | (string | number)[] | Config;

export interface Config {
    mew?: boolean;
    linters?: any;
    format?: any;
    level?: number;
    [index: number]: ConfigValue;
    [key: string]: ConfigValue;
}

export interface StyleLintConfig extends Config {
    plugins: string[];
    rules: ConfigValue;
}

export interface HTMLintConfig extends Config {
    plugins: string[];
    rules: ConfigValue;
}

export type MDLinter = false | (
    (content: string, pos: Position, type: string, indent: string) => Promise<LintError[]>
);

export type MDFixer = false | (
    (content: string, type: string) => Promise<string>
);
export interface MarkdownLintConfig extends Config {
    default: boolean;
    MD999: boolean | Record<string, any>;
}
export interface ESLintConfig extends Config {
    plugins: string[];
    env: ConfigValue;
    rules: ConfigValue;
}

export interface BaseOptions {
    type: string;
    name: string;
    suffix: string | RegExp;
    ignore: string | RegExp;
}


export interface FixerOptions extends BaseOptions {
}


export interface LinterOptions extends BaseOptions {
}

export interface Command {
    run(options: CliOptions, done?: () => void): void;
}
