import utils from '../utils';

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate else directive',
            categories: ['essential'],
            url: utils.getRuleUrl('valid-else')
        },

        schema: []
    },

    create(context) {

        return utils.defineTemplateBodyVisitor(context, {

            'XAttribute[directive=true][key.name.name="else"]'(node: XDirective) {
                const element = node.parent.parent;
                const { prefix } = node;
                const prevElement = utils.getPrevNode(element);

                if (!prevElement || prevElement.type !== 'XElement'
                    || (!utils.hasDirective(element, 'if') && utils.hasDirective(element, 'elif'))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${ prefix }else' should follow with '${ prefix }if' or '${ prefix }elif'.`
                    });
                }

                if (!utils.hasNoValue(node)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${ prefix }else' should have no value.`
                    });
                }


                if (utils.hasDirective(element, 'elif')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${ prefix }else' and '${ prefix }elif' directives can't exist on the same element.`
                    });
                }
            }
        });
    }
} as RuleModule;
