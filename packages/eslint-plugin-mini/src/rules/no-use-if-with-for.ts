import utils from '../utils';

/**
 * Check whether the given `wx:if` node is using the variable which is defined by the `wx:for` directive.
 * @param {XDirective} xIf The `wx:if` attribute node to check.
 * @returns {boolean} `true` if the `wx:if` is using the variable which is defined by the `wx:for` directive.
 */
function isUsingIterationVar(xIf: XDirective): boolean {
    if (!xIf.value.length || xIf.value[0].type !== 'XExpressionContainer') {
        return false;
    }
    const indexName = getWXforIndexName(xIf.parent);
    const itemName = getWXforItemName(xIf.parent);
    for (const reference of xIf.value[0].references) {
        if (reference.id.name === indexName || reference.id.name === itemName) {
            return true;
        }
    }
    return false;
}

/**
 * @param {XStartTag} startTag The startTag which `wx:for` in.
 * @returns {string}
 */
function getWXforItemName(startTag: XStartTag): string {
    let itemName = 'item';
    for (const attr of startTag.attributes) {
        if (attr.directive && attr.key.name.name === 'for-item') {
            // @ts-expect-error
            itemName = attr.value[0]?.value;
        }
    }
    return itemName === '' ? 'item' : itemName;
}

/**
 * @param {XStartTag} startTag The startTag which `wx:for` in.
 * @returns {string}
 */
function getWXforIndexName(startTag: XStartTag): string {
    let indexName = 'index';
    for (const attr of startTag.attributes) {
        if (attr.directive && attr.key.name.name === 'for-index') {
            // @ts-expect-error
            indexName = attr.value[0]?.value;
        }
    }
    return indexName === '' ? 'index' : indexName;
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'disallow use wx:if on the same element as wx:for',
            categories: ['essential'],
            url: utils.getRuleUrl('no-use-if-with-for')
        },
        schema: []
    },

    create(context) {
        return utils.defineTemplateBodyVisitor(context, {

            'XAttribute[directive=true][key.name.name=\'if\']'(node: XDirective) {
                const element = node.parent.parent;
                if (utils.hasDirective(element, 'for') && !isUsingIterationVar(node)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: 'This \'wx:if\' should be moved to the wrapper element.'
                    });
                }
            }
        });
    }
} as RuleModule;
