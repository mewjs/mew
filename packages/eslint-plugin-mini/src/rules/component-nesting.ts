import utils from '../utils';
import {
    selfCloseComponents,
    blockComponents,
    inlineBlockComponents,
    inlineComponents,
    topLevelComponents
} from '../utils/component';

function isSelfClose(node: XElement) {
    if (!node.children.length) {
        return true;
    }
    return node.children.every(i => i.type === 'XText' && /^\s*$/.test(i.value));
}

function getInlineParent(node: XElement | XDocumentFragment) {
    while (node && node.type !== 'XDocumentFragment') {
        if (inlineComponents.includes(node.name)) {
            return node;
        }

        node = node.parent;
    }

    return null;
}

function isAtTopLevel(node: XElement) {
    return !node.parent || node.parent.type === 'XDocumentFragment';
}

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate component nesting',
            categories: ['essential'],
            url: utils.getRuleUrl('component-nesting')
        },

        schema: [
            {
                type: 'object',
                properties: {
                    allowEmptyBlock: {
                        type: 'boolean'
                    },
                    ignoreEmptyBlock: {
                        type: 'array',
                        items: {
                            allOf: [{ type: 'string' }]
                        },
                        uniqueItems: true
                    }
                }
            }
        ]
    },

    /** @param {RuleContext} context */
    create(context) {
        const { allowEmptyBlock = false, ignoreEmptyBlock = ['view'] } = context.options[0] || {};

        return utils.defineTemplateBodyVisitor(context, {

            'XElement'(node: XElement) {
                if (selfCloseComponents.includes(node.name) && !isSelfClose(node)) {
                    context.report({
                        node: node,
                        loc: node.loc,
                        message: 'self close component shouldn\'t have children.'
                    });
                }

                // wxs has src attribute is self close
                if (node.name === 'wxs' && utils.hasAttribute(node, 'src') && !isSelfClose(node)) {
                    context.report({
                        node: node,
                        loc: node.loc,
                        message: '\'wxs\' with \'src\' shouldn\'t have children.'
                    });
                }

                if (topLevelComponents.includes(node.name) && !isAtTopLevel(node)) {
                    if (node.name === 'template' && utils.hasAttribute(node, 'is')) {
                        // do nothing
                    }
                    else {
                        context.report({
                            node: node,
                            loc: node.loc,
                            message: 'top level component shouldn\'t nested in other component.'
                        });
                    }
                }

                if ((blockComponents.includes(node.name) || inlineBlockComponents.includes(node.name))) {
                    const parent = getInlineParent(node);
                    if (parent) {
                        context.report({
                            node: node,
                            loc: node.loc,
                            message: 'component \'{{name}}\' shouldn\'t nested in component \'{{parentName}}\'.',
                            data: {
                                name: node.name,
                                parentName: parent.name
                            }
                        });
                    }

                    // not allow empty block
                    if (!allowEmptyBlock
                        && !ignoreEmptyBlock.includes(node.name)
                        && !selfCloseComponents.includes(node.name)
                        && isSelfClose(node)) {
                        context.report({
                            node: node,
                            loc: node.loc,
                            message: 'component \'{{name}}\' should have children.',
                            data: {
                                name: node.name
                            }
                        });
                    }
                }
            }
        });
    }
} as RuleModule;
