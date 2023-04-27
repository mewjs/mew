import utils from '../utils';

export default {
    meta: {
        docs: {
            description: 'enforce end tag style',
            categories: ['essential'],
            url: utils.getRuleUrl('html-end-tags')
        },
        fixable: 'code',
        messages: {
            unexpected: 'missing end tag'
        },
        schema: []
    },

    create(context) {

        return utils.defineTemplateBodyVisitor(context,
            {

                'XElement'(node: XElement) {
                    const { name } = node;
                    const isSelfClosing = node.startTag.selfClosing;
                    const hasEndTag = node.endTag != null;

                    if (!hasEndTag && !isSelfClosing) {
                        context.report({
                            node: node.startTag,
                            loc: node.startTag.loc,
                            message: '\'<{{name}}>\' should have end tag.',
                            data: { name }
                        });
                    }
                }
            });

    }


} as RuleModule;
