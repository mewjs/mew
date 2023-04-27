import utils from '../utils';

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate elif directive',
            categories: ['essential'],
            url: utils.getRuleUrl('valid-elif')
        },

        schema: []
    },

    create(context) {

        return utils.defineTemplateBodyVisitor(context, {

            'XAttribute[directive=true][key.name.name="elif"]'(node: XDirective) {
                const element = node.parent.parent;
                const { prefix } = node;
                const prevElement = utils.getPrevNode(element);

                if (!prevElement || prevElement.type !== 'XElement'
                    || (!utils.hasDirective(element, 'if') && !utils.hasDirective(element, 'elif'))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${ prefix }elif' should follow with '${ prefix }if' or '${ prefix }elif'.`
                    });
                }

                if (utils.isEmptyValueExpression(node)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${ prefix }elif' value should be expression.`
                    });
                }
            }
        });
    }
} as RuleModule;
