/* eslint-disable import/unambiguous, @typescript-eslint/no-var-requires, import/no-commonjs, @typescript-eslint/prefer-optional-chain */

function getName(attribute) {
    if (attribute.key.name.name === 'bind') {
        return (
            (attribute.key.modifiers
            && attribute.key.modifiers[0]
            && attribute.key.modifiers[0].type === 'XIdentifier'
            && `${attribute.key.name.name}${attribute.key.modifiers[0].name}`)
            || null
        );
    }
    return attribute.key.rawName || attribute.key.name;
}


module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow duplication of attributes',
            categories: ['essential'],
            url: ''
        },
        fixable: null,

        schema: [
            {
                type: 'object',
                properties: {
                    allowCoexistClass: {
                        type: 'boolean'
                    },
                    allowCoexistStyle: {
                        type: 'boolean'
                    }
                }
            }
        ]
    },

    /** @param {RuleContext} context */
    create(context) {
        const options = context.options[0] || {};
        const allowCoexistStyle = options.allowCoexistStyle !== false;
        const allowCoexistClass = options.allowCoexistClass !== false;

        const directiveNames = new Set();
        const attributeNames = new Set();

        function isDuplicate(name, isDirective) {
            if ((allowCoexistStyle && name === 'style') || (allowCoexistClass && name === 'class')) {
                return isDirective ? directiveNames.has(name) : attributeNames.has(name);
            }
            return directiveNames.has(name) || attributeNames.has(name);
        }

        return context.parserServices.defineTemplateBodyVisitor({
            XStartTag() {
                directiveNames.clear();
                attributeNames.clear();
            },
            XAttribute(node) {
                const name = getName(node);
                if (name == null) {
                    return;
                }
                if (isDuplicate(name, node.directive)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: 'Duplicate attribute \'{{name}}\'.',
                        data: {name}
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
};
