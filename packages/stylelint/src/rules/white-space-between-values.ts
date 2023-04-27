import { createRule } from 'stylelint-rule-creator';
import { getValueIndex, fixNodeValue } from '../utils/util';

export default createRule({
    ruleName: '@mewjs/white-space-between-values',
    messages: {
        expected: () => 'Expect one whitespace between values'
    },
    ruleCallback(report, messages, { primaryOption, root, context }) {
        if (!primaryOption) {
            return;
        }

        root.walkDecls(node => {
            // stylus hash变量被误认为属性，需要忽略
            // postcss-styl 增加的 stylusBetween 属性
            // @ts-expect-error
            if (node.prop.startsWith('$') || /^\s*=\s*$/.test(node.raws.stylusBetween)) {
                return;
            }

            const { value } = node;
            const whitespaceReg = /\s+/g;
            const fix = context?.fix;
            let fixedValue = '';
            let lastMatchIndex = 0;
            let match: RegExpExecArray | null = null;
            // property 仅允许一个空格
            while ((match = whitespaceReg.exec(value))) {
                if (match[0] !== ' ') {
                    // font-face src 类似的多行模式需要排除
                    // 带 comment src 形式为` \n` 会导致正则失效
                    if (/^[\r ]?\n /.test(match[0])) {
                        continue;
                    }

                    if (fix) {
                        fixedValue += `${ value.slice(lastMatchIndex, match.index) } `;
                        lastMatchIndex = match.index + match[0].length;
                    }
                    else {
                        report({
                            message: messages.expected(),
                            node,
                            line: node.source?.start?.line,
                            index: getValueIndex(node) + match.index,
                        });
                    }
                }
            }

            if (fix) {
                if (lastMatchIndex < value.length) {
                    fixedValue += value.slice(lastMatchIndex);
                }
                fixNodeValue(fixedValue, node);
            }
        });
    }
});

