import utils from '../utils';

/**
 * Strip quotes string
 * @param {string} text
 * @returns {string | null}
 */
function stripQuotesForHTML(text: string): string | null {
    if (/^([`'"]).+\1$/.test(text)) {
        return text.slice(1, -1);
    }

    return null;
}

export default {
    meta: {
        docs: {
            description: 'disallow unnecessary mustache interpolations',
            categories: ['essential'],
            url: utils.getRuleUrl('no-useless-mustache')
        },
        fixable: 'code',
        messages: {
            unexpected: 'Unexpected mustache interpolation with a string literal value.'
        },
        schema: [
            {
                type: 'object',
                properties: {
                    ignoreIncludesComment: {
                        type: 'boolean'
                    },
                    ignoreStringEscape: {
                        type: 'boolean'
                    }
                }
            }
        ],
        type: 'suggestion'
    },

    create(context) {
        const opts = context.options[0] || {};
        const { ignoreIncludesComment } = opts;
        const { ignoreStringEscape } = opts;

        /**
         * Report if the value expression is string literals
         * @param {XExpressionContainer} node the node to check
         */
        function verify(node: XExpressionContainer) {
            const { expression } = node;
            const sourceCode = context.getSourceCode();
            const content = sourceCode.getText().slice(node.range[0], node.range[1]);
            if (!expression) {
                if (content.search(/^{{[\s\t\n]*}}$/) !== -1) {
                    context.report({
                        node,
                        message: 'Unexpected empty mustache interpolation.',
                        loc: node.loc,
                        fix: fixer => fixer.removeRange(node.range)
                    });
                }
                return;
            }

            let strValue: string;
            let rawValue: string;

            if (expression.type === 'Literal') {
                if (typeof expression.value !== 'string') {
                    return;
                }

                strValue = expression.value;
                rawValue = expression.raw;
            }
            else if (expression.type === 'TemplateLiteral') {
                if (expression.expressions.length > 0) {
                    return;
                }

                strValue = expression.quasis[0].value.cooked;
                rawValue = expression.quasis[0].value.raw;
            }
            else {
                return;
            }

            const tokenStore = context.parserServices.getTemplateBodyTokenStore();
            const hasComment = tokenStore
                .getTokens(node, { includeComments: true })
                .some(t => t.type === 'Block' || t.type === 'Line');

            if (ignoreIncludesComment && hasComment) {
                return;
            }

            let hasEscape = false;
            if (rawValue !== strValue) {
                // check escapes
                const chars = rawValue.split('');
                let c = chars.shift();
                while (c) {
                    if (c === '\\') {
                        c = chars.shift();
                        // ignore "\\", '"', "'", "`" and "$"
                        if (c == null || 'nrvtbfux'.includes(c)) {
                            // has useful escape.
                            hasEscape = true;
                            break;
                        }
                    }
                    c = chars.shift();
                }
            }
            if (ignoreStringEscape && hasEscape) {
                return;
            }

            context.report({
                node,
                messageId: 'unexpected',
                loc: node.loc,
                fix(fixer) {
                    if (hasComment || hasEscape) {
                        // cannot fix
                        return null;
                    }
                    // @ts-expect-error
                    const text = expression.raw ? stripQuotesForHTML(expression.raw) : null;
                    if (text == null) {
                        // unknowns
                        return null;
                    }
                    if (text.includes('\n') || /^\s|\s$/u.test(text)) {
                        // It doesn't autoFix because another rule like indent or eol space might remove spaces.
                        return null;
                    }

                    // @ts-expect-error
                    return fixer.replaceText(node, text.replace(/\\([\s\S])/g, '$1'));
                }
            });
        }

        return utils.defineTemplateBodyVisitor(context, {
            'XElement > XExpressionContainer': verify,
            'XAttribute > XExpressionContainer': verify
        });
    }
} as RuleModule;
