import utils from '../utils';

export default {
    meta: {
        type: 'layout',
        docs: {
            description: 'disallow spaces around equal signs in attribute',
            categories: ['essential'],
            url: utils.getRuleUrl('arrow-spacing')
        },
        fixable: 'whitespace',
        schema: []
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const tokenStore = context.parserServices?.getTemplateBodyTokenStore?.();

        return utils.defineTemplateBodyVisitor(context, {
            XAttribute(node) {
                if (!node.value || !node.key) {
                    return;
                }

                const association = tokenStore.getTokenAfter(node.key) || null;
                if (!association || association.type !== 'HTMLAssociation') {
                    return;
                }

                const firstValue = tokenStore.getTokenAfter(association) || null;
                if (!firstValue || !firstValue.range) {
                    return;
                }

                const range: Range = [node.key.range[1], firstValue.range[0]];
                const eqText = sourceCode.text.slice(range[0], range[1]);
                const expect = eqText.trim();

                if (eqText !== expect) {
                    context.report({
                        node: node.key,
                        loc: {
                            start: node.key.loc.end,
                            end: node.value[0].loc.start
                        },
                        message: 'Unexpected spaces found around equal signs.',
                        fix: fixer => fixer.replaceTextRange(range, expect)
                    });
                }
            }
        });
    }
} as RuleModule;
