import utils from '../utils';

function getName(attribute: XAttribute | XDirective) {
    if (attribute.directive) {
        return attribute.prefix
            ? attribute.key.name.rawName
            : `${ attribute.key.name.name }:${ attribute.key.argument?.rawName }`;
    }
    return attribute.key.rawName || attribute.key.name;
}


export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow duplication of attributes',
            categories: ['essential'],
            url: utils.getRuleUrl('no-duplicate-attributes')
        },
        schema: []
    },

    create(context) {

        const directiveNames = new Set();
        const attributeNames = new Set();

        return utils.defineTemplateBodyVisitor(context, {
            XStartTag() {
                directiveNames.clear();
                attributeNames.clear();
            },
            XAttribute(node: XAttribute | XDirective) {
                const name = getName(node) || null;
                if (name == null) {
                    return;
                }
                if (directiveNames.has(name) || attributeNames.has(name)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: 'Duplicate attribute \'{{name}}\'.',
                        data: { name }
                    });
                }

                if (node.directive) {
                    directiveNames.add(name);
                }
                else {
                    attributeNames.add(name);
                }
            }
        });
    }
} as RuleModule;
