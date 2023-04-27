import utils from '../utils';

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'disallow static inline `style` attributes',
            categories: ['essential'],
            url: utils.getRuleUrl('no-static-inline-styles')
        },

        schema: [
            {
                type: 'object',
                properties: {
                    allowBinding: {
                        type: 'boolean'
                    }
                }
            }
        ],
        messages: {
            forbiddenStaticInlineStyle: 'Static inline `style` are forbidden.',
            forbiddenStyleAttr: '`style` attributes are forbidden.'
        }
    },

    create(context) {
        const options = context.options[0] || {};
        const allowBinding = options.allowBinding === true;

        return utils.defineTemplateBodyVisitor(context, {
            'XAttribute[directive=false][key.name=\'style\']'(node) {
                if (!allowBinding || (allowBinding && utils.getValueType(node) === 'literal')) {
                    context.report({
                        node,
                        loc: node.loc,
                        messageId: allowBinding ? 'forbiddenStaticInlineStyle' : 'forbiddenStyleAttr'
                    });
                }

            }
        });
    }
} as RuleModule;
