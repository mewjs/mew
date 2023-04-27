import utils from '../utils';

const eventDirectives = new Set(['bind', 'on', 'catch', 'capture-bind', 'capture-catch']);

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'validate bind directive',
            categories: ['essential'],
            url: utils.getRuleUrl('valid-bind')
        },
        schema: [
            {
                type: 'object',
                properties: {
                    allowExpression: {
                        type: 'boolean'
                    }
                }
            }
        ]
    },

    create(context) {
        const options = context.options[0] || {};
        const allowExpression = options.allowExpression === true;

        return utils.defineTemplateBodyVisitor(context, {
            'XAttribute[directive=true]'(node: XDirective) {
                if (!eventDirectives.has(node.key.name.name)) {
                    return;
                }

                if (!node.key.argument || !node.key.argument.name) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${ node.key.argument!.rawName }' should have event name.`
                    });
                }

                if (utils.isEmptyValueMixed(node)
                    || (!allowExpression && utils.getValueType(node) !== 'literal')
                    || (allowExpression && !['literal', 'expression'].includes(utils.getValueType(node)))
                ) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${ node.key.name.rawName }${ node.key.argument!.rawName }' `
                            + `value should be ${ allowExpression ? 'expression or literal' : 'literal' }.`
                    });
                }
            }
        });
    }
} as RuleModule;
