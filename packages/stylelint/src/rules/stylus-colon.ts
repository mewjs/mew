import { createRule } from 'stylelint-rule-creator';
import type { Node } from 'postcss-styl';

const messages = {
    expected: () => 'Expect `:` between prop and value'
};

export default createRule<typeof messages, string, boolean>({
    ruleName: '@mewjs/stylus-colon',
    messages,
    ruleCallback(report, messages, { primaryOption, root, context }) {
        if (!primaryOption) {
            return;
        }

        // @ts-expect-error
        if (root.source.lang !== 'stylus') {
            return;
        }

        root.walkDecls(item => {
            const node = item as Node;
            if (null != node.raws.stylusBetween && /^\s+$/.test(node.raws.stylusBetween)) {
                if (context.fix) {
                    node.raws.stylusBetween = ': ';
                }
                else {
                    report({
                        message: messages.expected(),
                        node,
                        line: node.source.start.line,
                        index: node.prop.length,
                    });
                }
            }
        });
    }
});
