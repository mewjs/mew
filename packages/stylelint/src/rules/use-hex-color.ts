import { createRule } from 'stylelint-rule-creator';

import type { ColorType } from '../utils/color';
import { colorToHex, getHexColor } from '../utils/color';
import { getValueIndex, fixNodeValue } from '../utils/util';

export default createRule({
    ruleName: '@mewjs/use-hex-color',
    messages: {
        expected(oldValue: string, newValue: string): string {
            return `Expect hex color\`${ newValue }\` for \`${ oldValue }\``;
        }
    },
    ruleCallback(report, messages, { primaryOption, root, context }) {
        if (!primaryOption) {
            return;
        }

        root.walkDecls(node => {
            // rgba(102, 153, 0, 0.6666666666666666)
            // rgb(102, 153, 2)
            // hsla(80, 100%, 30%, 0.6666666666666666)
            // hsl(80, 100%, 30%)
            const { value } = node;
            const colorReg = /\b(rgba?|hsla?)\(\s*(\d+(?:\.(?:\d+|))?%?|\.\d+%?)((?:\s*,\s*(?:\d+(?:\.(?:\d+|))?%?|\.\d+%?)){2,3})\s*\)/g;
            const fix = context?.fix;
            let fixedValue = getHexColor(value.toLowerCase()) ?? '';
            let lastMatchIndex = fixedValue ? value.length : 0;
            let match: RegExpExecArray | null = null;

            if (fixedValue && !fix) {
                // 报告错误
                report({
                    message: messages.expected(value, fixedValue),
                    node,
                    line: node.source?.start?.line,
                    index: getValueIndex(node),
                });
                return;
            }

            while ((match = colorReg.exec(value))) {
                const fn = match[1];
                const args = [
                    match[2],
                    ...(match[3].match(/\d+(?:\.(?:\d+|))?%?|\.\d+%?/g) || [])
                ];
                const hexColor = colorToHex(fn as ColorType, args);
                // 解析 hex color错误，忽略一下
                if (null == hexColor) {
                    continue;
                }

                if (fix) {
                    fixedValue += value.slice(lastMatchIndex, match.index) + hexColor;
                    lastMatchIndex = match.index + match[0].length;
                }
                else {
                    // 报告错误
                    report({
                        message: messages.expected(match[0], hexColor),
                        node,
                        line: node.source?.start?.line,
                        index: getValueIndex(node) + match.index,
                    });
                }
            }

            if (fix && fixedValue) {
                if (lastMatchIndex < value.length) {
                    fixedValue += value.slice(lastMatchIndex);
                }

                fixNodeValue(fixedValue, node);
            }
        });
    }
});
