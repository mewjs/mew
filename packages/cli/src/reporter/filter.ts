import type { BaseError, Filters, Filter, CliOptions, ReportFileFiler } from '../types';

/**
 * 错误过滤模块
 *
 * @namespace
 */
const filter = {

    /**
     * 什么也不干
     *
     * @param {BaseError[]} errors 各 linter 检查出的错误信息
     * @return {BaseError[]}
     */
    noop(errors: BaseError[]): BaseError[] {
        return errors;
    },

    /**
     * 组合过滤条件
     *
     * @param {Array.<Function>} fns 过滤函数数组
     * @return {Function} 组合得到的过滤操作函数
     */
    compose(fns: ((error: BaseError) => void)[]): Filters {
        return errors => errors.filter(error => fns.every(fn => fn(error)));
    },

    /**
     * 行数过滤函数生成
     *
     * @param {string} lines 过滤行数的表达式
     * @return {Filter} 能根据表达式过滤代码行错误的函数
     */
    lines(lines: string): Filter {
        const tokens = String(lines)
            .replace(/[^()[\],\d<>=]/g, '')
            .split(',');

        let open = false;
        let exp = tokens.reduce((exp, token) => {
            let op = token.replace(/\d+/, '')[0];
            const line = token.replace(/\D+/, '');

            if (op) {
                switch (op) {
                    case '(':
                        op = '>';
                        open = true;
                        break;
                    case '[':
                        op = '>=';
                        open = true;
                        break;
                    case '<':
                    case '>':
                        open = false;
                        break;
                    case ')':
                        op = '<';
                        open = false;
                        break;
                    case ']':
                        op = '<=';
                        open = false;
                        break;
                }

                exp += `l${ op }${ line }${ open ? '&&' : '||' }`;
            }
            else {
                exp += `l===${ line }||`;
            }

            return exp;

        }, '');

        exp = exp.replace(/[&|]+$/, '');

        return new Function(
            'error',
            `var l=error.line;if(typeof l===void 0)return true;return ${ exp }`
        ) as Filter;
    },

    /**
     * 检查规则名过滤函数生成
     *
     * @param {string} rules 以逗号分隔的规则名组合
     * @return {Filter} 能过滤指定规则名以外错误的函数
     */
    rules(rulesString: string): Filter {
        const rules = new Set(
            rulesString.toLowerCase()
                .split(/,\s*/)
                .filter(Boolean)
        );

        return error => rules.has((error.rule || '').toLowerCase());
    },

    /**
     * 生成根据错误的 severity 过滤的函数
     *
     * @param {number} level 指定的错误等级
     * @return {Filter} 能过滤指定错误等级之外错误的函数
     */
    level(level: number): Filter {
        level = (level | 0) & 1;

        return error => {
            const severity = ((error.severity as number) | 0) & 1;
            return severity === level;
        };
    },

    /**
     * 获取过滤函数
     *
     * @param {ReportFileFiler|CliOptions} filters filter 函数的 CLI 值
     * @return {Function} 过滤函数
     */
    get(filters: ReportFileFiler | CliOptions): Filters {

        const fns = 'lines, rules, level'.split(/,\s*/)
            .map(key => filters[key] && filter[key](filters[key]))
            .filter(Boolean);

        return fns.length ? filter.compose(fns) : filter.noop;
    }
};

export default filter;
