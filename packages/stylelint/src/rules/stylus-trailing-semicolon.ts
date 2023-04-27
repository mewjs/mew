import { createRule } from 'stylelint-rule-creator';
import hasBlock from 'stylelint/lib/utils/hasBlock';
import type { Node } from 'postcss-styl';

import {
    getTrailingIndex,
    inCssLiteral,
    isObjectProperty
} from '../utils/util';

const messages = {
    expected: () => 'Expected a trailing semicolon'
};

function findLastNode(nodes: Node[]) {
    for (let index = nodes.length - 1; index >= 0; index--) {
        const node = nodes[index];
        if (node.type === 'comment') {
            continue;
        }
        return node;
    }
}

export default createRule({
    ruleName: '@mewjs/stylus-trailing-semicolon',
    messages,
    ruleCallback(report, messages, { primaryOption, root, context }) {
        if (!primaryOption) {
            return;
        }

        // @ts-expect-error
        if (root.source.lang !== 'stylus') {
            return;
        }

        root.walkAtRules(atRule => {
            if (hasBlock(atRule)) {
                return;
            }

            verifyNode(atRule);
        });

        root.walkDecls(verifyNode);

        function verifyNode(node) {
            if (inCssLiteral(node) || isObjectProperty(node)) {
                return;
            }

            const lastNode = findLastNode(node.parent.nodes);
            const isLast = node === lastNode;
            const omittedSemi = isLast
                ? !node.parent.raws.semicolon
                : node.omittedSemi;

            // 省略了分号
            if (omittedSemi) {
                if (context.fix) {
                    const newValue = node.value;
                    if (typeof node.raws.value === 'object') {
                        const { stylus, value: rawValue } = node.raws.value;
                        if (stylus) {
                            node.raws.value.stylus = node.raws.value.stylus.replace(rawValue, `${ newValue };`);
                        }

                        node.raws.value.raw = node.raws.value.raw.replace(rawValue, `${ newValue };`);
                    }
                    else if (null == node.raws.value) {
                        if (node.call) {
                            node.params += ';';
                        }
                        else {
                            node.value += ';';
                        }

                        // stylus css 场景只需要设置 `omittedSemi`?
                        node.omittedSemi = false;
                    }
                }
                else {
                    report({
                        message: messages.expected(),
                        node,
                        line: node.source?.start?.line,
                        index: getTrailingIndex(node)
                    });
                }
            }

        }
    }
});
