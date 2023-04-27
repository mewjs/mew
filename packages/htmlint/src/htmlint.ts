import type HTMLNode from '@mewjs/dom/lib';
import { print, printAsync } from '@mewjs/html-code-gen';

import { extend, getPosition } from './util';
import parse from './parse';
import rules from './rules';
import Reporter, { type Result } from './reporter';
import * as otherFormatters from './other-formatter';
import type { Configuration } from './typings/types';

export type ConfigValue = string | number | boolean | undefined | (string | number)[] | Config;
export interface Config {
    mew?: boolean;
    linters?: any;
    format?: any;
    level?: number;
    [index: number]: ConfigValue;
    [key: string]: ConfigValue;
}
export interface Helper {
    indent(content: string, config?: Config): string;
    trim(content: string, config?: Config): string;
}

/**
     * 对标签内容的 fixer
     *
     * @param {string} content 标签内容
     * @param {HTMLElement} node 标签对象
     * @param {Config} config 配置对象
     * @param {Helper} helper 包含 indent 方法的对象
     * @return {Promise<string>} 格式化后的内容
     */
export type Formatter = (
    content: string,
    node: HTMLElement,
    config: Config,
    helper: Helper
) => string | Promise<string>;

export interface FormatMapper {
    script: Formatter;
    style: Formatter;
}

type Print = (node: HTMLNode, opt: object) => string;
type PrintAsync = (node: HTMLNode, opt: object) => Promise<string>;

/**
 * The report item.
 *
 * @typedef {Object} Report
 * @property {string} type - typeof the message, one of "info", "warn", "error"
 * @property {number} line - line number of the report
 * @property {number} column - column number of the report
 * @property {string} code - code of the report
 * @property {string} message - message of the report
 * @property {string} rule - name of the report's rule
 */

/**
 * Do hint with given code & config.
 *
 * @param {string} code - given code
 * @param {Configuration} cfg - given config
 * @return {Result[]} the hint result, list of reports
 */
export function hint(code: string, config: Partial<Configuration> = {}): Result[] {
    // get rid of \r
    code = code.replace(/\r\n?/g, '\n');
    if (!config) {
        config = {};
    }

    // max error num
    const {
        'max-error': maxError = 0,
        ...noMaxError
    } = config;
    config = noMaxError;

    // get reporter
    const reporter = new Reporter();

    // get parser
    const parser = parse.getParser();

    // collect inline configs
    const inlineConfig = rules.collectInlineConfig(parser);

    // configure reporter with inline reporter-config ( enable / disable )
    reporter.config(inlineConfig.reporter);

    // lint parser
    rules.lintParser(parser, reporter, config, inlineConfig.rules, code);

    // parse & lint document
    const document = parse(code, parser);
    rules.lintDocument(document, reporter, config, inlineConfig.rules, code);

    // get result
    let result = reporter.result();
    // num control
    if (maxError && maxError < result.length) {
        result = result.slice(0, maxError);
    }

    // do position ( pos -> line & column )
    const position = getPosition(code);
    result.forEach(item => {
        extend(item, position(item.pos!));
    });

    return result;
}

/**
 * Do hint with given code & config.
 *
 * @param {string} code - given code
 * @param {Configuration} config - given config
 * @return {Promise<Result[]>} the hint result, list of reports
 */
export async function hintAsync(code: string, config: Partial<Configuration> = {}): Promise<Result[]> {
    return Promise.resolve(hint(code, config));
}

function formatWithGivenPrint<
    T extends(Print | PrintAsync),
    R extends ReturnType<T>
>(code: string, config: Partial<Configuration> = {}, print: T): R {

    if (!config) {
        config = {};
    }

    // get parser
    const parser = parse.getParser();

    // collect inline configs
    const inlineConfig = rules.collectInlineConfig(parser);

    // parse document
    const document = parse(code, parser);

    // format options
    const options = {
        'indent-size': 4,
        'indent-char': 'space',
        'max-char': 120,
        'formatter': otherFormatters,
        ...((config.format || {}) as { formatter: FormatMapper })
    };

    rules.format(document, config, inlineConfig.rules, options);

    return print(document, options) as R;
}

/**
 * Do format with given code & config.
 *
 * @param {string} code - given code
 * @param {Configuration} config - given config
 * @return {string} the formatted code
 */
export function format(code: string, config: Partial<Configuration> | null = {}): string {
    return formatWithGivenPrint(code, config, print);
}

/**
 * Do async format with given code & config.
 *
 * @param {string} code - given code
 * @param {Object} config - given config
 * @return {Promise<string>} the formatted code
 */
export async function formatAsync(code: string, config: Partial<Configuration> = {}): Promise<string> {
    return formatWithGivenPrint(code, config, printAsync);
}

export const addRule = rules.add.bind(rules);
