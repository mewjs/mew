import type { Configs, Config } from './typings/types';
import type { Position } from './util';
import { getInlineConfigByIndex } from './util';

export type ResultType = 'WARN' | 'ERROR' | 'INFO';

export interface Result extends Position {
    type: ResultType;
    code?: string;
    message: string;
    rule: string;
    pos: number | null;
}

export interface ReporterOptions {
    results?: Result[];
    rule: string;
    config?: Configs;
}

export type LogParams = [pos: number | null, code: string, message: string, rule?: string];

/**
 * class Reporter
 *
 * @constructor
 * @param {Object} options - options for reporter
 */
export default class Reporter {
    private results: Result[];
    private rule = '';
    private configs?: Configs;

    constructor(options: ReporterOptions = { results: [], rule: '' }) {
        this.results = options.results || [];
        this.rule = options.rule;
        this.configs = options.config;
    }

    /**
     * Config reporter with config info.
     *
     * @param {Object} value - reporter config info
     * @return {Reporter} new bound reporter
     */
    config(value: Configs): this {
        this.configs = value;
        return this;
    }

    getConfigByRule(ruleName: string): Config[] {
        return this.configs[ruleName];
    }

    /**
     * Create a new reporter bound with given rule (use as default rule).
     *
     * @param {string} rule - name of rule
     * @return {Reporter} new bound reporter
     */
    bindRule(rule: string): Reporter {
        return new Reporter({
            rule,
            results: this.results,
            config: this.configs
        });
    }

    /**
     * The report item.
     *
     * @typedef {Object} Report
     * @property {string} type - typeof the message, one of "info", "warn", "error"
     * @property {number} pos - position index (in code content) of report
     * @property {string} code - code of the report
     * @property {string} message - message of the report
     * @property {string} rule - name of the report's rule
     */

    /**
     * Save given report.
     *
     * @param {Result} item - given report item
     * @return {Reporter} reporter itself
     */
    report(result: Partial<Result>): this {
        const item = {
            type: 'WARN',
            pos: 0,
            // code: null,
            message: '',
            rule: this.rule,
            ...result
        } as Result;

        if (this.configs) {
            const cfg = getInlineConfigByIndex<string>(item.rule, item.pos, this.configs, 'enable');
            if (cfg === 'disable' || cfg === 'disable-next-line') {
                return this;
            }
        }

        this.results.push(item);

        return this;
    }


    /**
     * Get result report list.
     *
     * @return {Result[]} report list
     */
    result(): Result[] {
        return this.results.sort((a, b) => a.pos! - b.pos);
    }

    /**
     * Get result report's count.
     *
     * @return {number} report's count
     */
    total(): number {
        return this.results.length;
    }


    /**
     * Report with type "info"
     *
     * @param {number} pos - position index in code content
     * @param {string} code - code of the report
     * @param {string} message - message of the report
     * @param {string} rule - name of the report's rule
     * @return {Reporter} reporter itself
     */
    info(...args: LogParams): this {
        return this.log('INFO', ...args);
    }


    /**
     * Report with type "warn"
     *
     * @param {number} pos - position index in code content
     * @param {string} code - code of the report
     * @param {string} message - message of the report
     * @param {string} rule - name of the report's rule
     * @return {Reporter} reporter itself
     */
    warn(...args: LogParams): this {
        return this.log('WARN', ...args);
    }

    /**
     * Report with type "error"
     *
     * @param {number?} pos - position index in code content
     * @param {string} code - code of the report
     * @param {string} message - message of the report
     * @param {string} rule - name of the report's rule
     * @return {Reporter} reporter itself
     */
    error(...args: LogParams): this {
        return this.log('ERROR', ...args);
    }

    private log(type: ResultType, pos: number | null, code: string, message: string, rule?: string) {
        const item: Result = {
            type,
            pos,
            code,
            message,
            rule: this.rule ?? '',
            line: 0,
            column: 0
        };

        if (rule) {
            item.rule = rule;
        }

        return this.report(item);
    }
}

