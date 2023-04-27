import utils from '../utils';

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate for directive',
            categories: ['essential'],
            url: utils.getRuleUrl('valid-for')
        },

        schema: [
            {
                type: 'object',
                properties: {
                    withKey: {
                        type: 'boolean'
                    },
                    withItem: {
                        type: 'boolean'
                    }
                }
            }
        ]
    },

    create(context) {
        const options = context.options[0] || {};

        const forVisitor = (node: XDirective) => {
            const { prefix, key: { name: { name } } } = node;
            const element = node.parent.parent;

            if (false !== options.withKey && !utils.hasDirective(element, 'key')) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${ prefix }${ name }' should provide '${ prefix }key' to improve performance.`
                });
            }

            if (options.withItem && !utils.hasDirective(element, 'for-item')) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${ prefix }${ name }' should provide '${ prefix }for-item'.`
                });
            }

            if (utils.getValueType(node) !== 'expression' || utils.isEmptyValueExpression(node)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${ prefix }${ name }' value should be expression.`
                });
            }
        };

        const forItemVisitor = (node: XDirective) => {
            const { prefix, key: { name: { name } } } = node;
            const element = node.parent.parent;

            if (!utils.hasDirective(element, 'for') && !utils.hasDirective(element, 'for-items')) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${ prefix }${ name }' should has '${ prefix }for'.`
                });
            }

            if (utils.getValueType(node) !== 'literal' || utils.isEmptyValueLiteral(node)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${ prefix }${ name }' value should be literal text.`
                });
            }
        };

        return utils.defineTemplateBodyVisitor(context, {

            'XAttribute[directive=true][key.name.name="for"]': forVisitor,
            'XAttribute[directive=true][key.name.name="for-items"]': forVisitor,
            'XAttribute[directive=true][key.name.name="for-item"]': forItemVisitor,
            'XAttribute[directive=true][key.name.name="for-index"]': forItemVisitor,
            'XAttribute[directive=true][key.name.name="key"]': forItemVisitor,
        });
    }
} as RuleModule;
