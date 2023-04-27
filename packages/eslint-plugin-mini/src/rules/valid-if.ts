import utils from '../utils';

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate if directive',
            categories: ['essential'],
            url: utils.getRuleUrl('valid-if')
        },

        schema: []
    },

    create(context) {

        return utils.defineTemplateBodyVisitor(context, {

            'XAttribute[directive=true][key.name.name="if"]'(node: XDirective) {
                const element = node.parent.parent;
                const { prefix } = node;
                if (utils.hasDirective(element, 'else')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${ prefix }if' and '${ prefix }else' directives can't exist on the same element.`
                    });
                }
                if (utils.hasDirective(element, 'elif')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${ prefix }if' and '${ prefix }elif' directives can't exist on the same element.`
                    });
                }

                if (node.key.argument) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${ prefix }if' directive require no argument.`
                    });
                }

                if (utils.isEmptyValueExpression(node)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${ prefix }if' value should be expression.`
                    });
                }
            }
        });
    }
} as RuleModule;
