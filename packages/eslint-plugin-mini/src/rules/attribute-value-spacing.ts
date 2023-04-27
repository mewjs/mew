import utils from '../utils';

export default {
    meta: {
        type: 'layout',
        docs: {
            description: 'disallow spaces around mustache in attribute value',
            categories: ['essential'],
            url: utils.getRuleUrl('attribute-value-spacing')
        },
        fixable: 'whitespace',
        schema: []
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        return utils.defineTemplateBodyVisitor(context, {

            'XAttribute'(node) {
                if (node.value?.some(node => node.type === 'XExpressionContainer')) {

                    const [first] = node.value;
                    const last = node.value.slice(-1).pop();

                    if ('value' in first) {
                        const expect = first.value.replace(/^\s*/, '');
                        if (expect !== first.value) {

                            const range = [
                                first.range[0],
                                first.range[0] + first.value.search(/\S|$/)
                            ];

                            context.report({
                                node: first,
                                loc: {
                                    start: first.loc.start,
                                    end: sourceCode.getLocFromIndex(range[1])
                                },
                                message: 'Unexpected spaces found',
                                // @ts-expect-error
                                fix: fixer => fixer.removeRange(range)
                            });
                        }
                    }

                    if (last && 'value' in last) {
                        const expect = last.value.replace(/\s*$/, '');
                        if (expect !== last.value) {

                            const range = [
                                last.range[0] + last.value.search(/\s*$/),
                                last.range[1]
                            ];

                            context.report({
                                node: last,
                                loc: {
                                    start: sourceCode.getLocFromIndex(range[0]),
                                    end: last.loc.end
                                },
                                message: 'Unexpected spaces found',
                                // @ts-expect-error
                                fix: fixer => fixer.removeRange(range)
                            });
                        }
                    }
                }
            }
        });
    }
} as RuleModule;
