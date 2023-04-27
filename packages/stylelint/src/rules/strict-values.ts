import { createRule } from 'stylelint-rule-creator';
import type { Declaration } from 'postcss';
import cssTree from 'css-tree';

import isCssFunction from '../utils/is-css-function';
import { getValueIndex } from '../utils/util';

function checkFontDisplay(node: Declaration) {
    if (!node.value || !node.value.match(/^(?:auto|block|swap|fallback|optional)$/)) {
        return {
            error: { mismatchOffset: 0 }
        };
    }

    return true;
}

function checkCSSScheme(node: Declaration) {
    if (!node.value || !node.value.match(/^(?:inherit|normal|revert|unset|light|dark|light dark)$/)) {
        return {
            error: { mismatchOffset: 0 }
        };
    }

    return true;
}


// 当前不能检查的属性集合，需特殊处理
const specialPropHandlers = {
    // mdn-data 描述错误，检查出错
    'font-display': checkFontDisplay,
    'color-scheme': checkCSSScheme,
};

const syntax = cssTree.lexer;
interface Config {
    ignoreUnits: string[];
}

const messages = {
    expected: (prop: string) => `Invalid value for \`${ prop }\``
};

export default createRule<typeof messages, string, boolean, Config>({
    ruleName: '@mewjs/strict-values',
    messages,
    ruleCallback(report, messages, { primaryOption, secondaryOptions, root, context }) {
        if (!primaryOption) {
            return;
        }

        const config = secondaryOptions;
        // 自定义css单位检查
        let unitIgnoreReg: RegExp;
        if (config?.ignoreUnits) {
            unitIgnoreReg = new RegExp(`\\b-?(?:\\d+|(?:\\d+)?\\.\\d+)(${ config.ignoreUnits.join('|') })\\b`, 'i');
        }

        root.walkDecls(node => {
            // TODO: var cssTree 暂时不支持，需要忽略
            if (node.prop.startsWith('--')
                || node.value.match(/var\(\s*--[^)]+\)/)) {
                return;
            }
            // less sass 变量不支持, stylus arguments 参数不支持
            if (node.prop.startsWith('$')
                || node.prop.startsWith('@')
                || node.value.match(/(?:^|\s|\()-?[$@][\w-.$@]+/)
                || node.value.match(/\barguments\b/)) {
                return;
            }

            // less sass 函数不支持，非白名单中的函数不支持检查
            if (node.value.match(/(?:^|\s|\()([\w-.$]+)\s*\(/)) {
                if (!isCssFunction(RegExp.$1)) {
                    return;
                }
            }

            // stylus hash变量需要忽略
            // @ts-expect-error
            if (node.prop.startsWith('$') || /^\s*=\s*$/.test(node.raws.stylusBetween)) {
                return;
            }

            // 自定义css单位需要忽略, width: 10rpx; padding: 1upx 2upx;
            if (unitIgnoreReg?.test(node.value)) {
                return;
            }

            // TODO: any
            let match: any = null;
            if (specialPropHandlers[node.prop]) {
                match = specialPropHandlers[node.prop](node);
            }
            else {
                const ast = cssTree.parse(`${ node.prop }:${ node.value }`, { context: 'declaration' });
                match = syntax.matchDeclaration(ast);
            }

            if (match?.error) {
                report({
                    message: messages.expected(node.prop),
                    node,
                    line: node.source?.start?.line,
                    index: getValueIndex(node) + match.error.mismatchOffset
                });
            }
        });
    }
});
