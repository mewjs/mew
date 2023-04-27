import utils from '../utils';

function getRefs(node: XDirective | null): Reference[] {
    return node
        ? node.value
            .filter(i => i.type === 'XExpressionContainer' && i.references)
            // @ts-expect-error
            .reduce((references, node) => references.concat(node.references), [])
        : [];
}

function getLiteralRefs(node: XDirective | null): string[] {
    return node
        ? node.value
            .filter(i => i.type === 'XLiteral')
            // @ts-expect-error
            .reduce((references, node) => references.concat(node.value), [])
        : [];
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'disallow confusing `for` and `if` directive on the same element',
            categories: ['essential'],
            url: utils.getRuleUrl('no-confusing-for-if')
        },
        schema: []
    },

    create(context) {
        return utils.defineTemplateBodyVisitor(context, {
            'XAttribute[directive=true][key.name.name=\'if\']'(node: XDirective) {
                const element = node.parent.parent;
                const { prefix } = node;
                if (utils.hasDirective(element, 'for') || utils.hasDirective(element, 'for-items')) {
                    const forItemNode = utils.getDirective(element, 'for-item');
                    const ifRefs = getRefs(node);
                    const forRefs = forItemNode
                        ? getLiteralRefs(forItemNode)
                        : ['item'];
                    const isRefMatches = ifRefs.some(ref => forRefs.some(variable => variable === ref.id.name));
                    if (isRefMatches) {
                        context.report({
                            node,
                            loc: node.loc,
                            message: `This '${ prefix }if' should be moved to the wrapper element.`
                        });
                    }
                }
            }
        });
    }
} as RuleModule;
