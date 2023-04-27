import utils from '../utils';

interface Options {
    startTag?: 'always' | 'never';
    endTag?: 'always' | 'never';
    selfClosingTag?: 'always' | 'never';
}

/**
 * Normalize options.
 * @param {Options} options The options user configured.
 * @param {ParserServices.XTokenStore} tokens The token store of template body.
 * @returns {Options & { detectType: (node: XStartTag | XEndTag) => 'never' | 'always' | null }} The normalized options.
 */
function parseOptions(
    options: Options,
    tokens: ParserServices.XTokenStore
): Options & { detectType: (node: XStartTag | XEndTag) => 'never' | 'always' | null } {
    return {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'always',
        ...options,

        /**
         * @param {XStartTag | XEndTag} node
         * @returns {'never' | 'always' | null}
         */

        detectType(this: Options, node: XStartTag | XEndTag): 'never' | 'always' | null {
            const openType = tokens.getFirstToken(node)!.type;
            const closeType = tokens.getLastToken(node)!.type;

            if (openType === 'HTMLEndTagOpen' && closeType === 'HTMLTagClose') {
                return this.endTag!;
            }
            if (openType === 'HTMLTagOpen' && closeType === 'HTMLTagClose') {
                return this.startTag!;
            }

            if (openType === 'HTMLTagOpen' && closeType === 'HTMLSelfClosingTagClose') {
                return this.selfClosingTag!;
            }

            return null;
        }
    };
}

// TODO: Token as Node

export default {
    meta: {
        docs: {
            description: 'require or disallow a space before tag\'s closing brackets',
            categories: ['essential'],
            url: utils.getRuleUrl('html-closing-bracket-spacing')
        },
        messages: {
            unexpected: 'require or disallow a space before tag\'s closing brackets'
        },
        schema: [
            {
                type: 'object',
                properties: {
                    startTag: { enum: ['always', 'never'] },
                    endTag: { enum: ['always', 'never'] },
                    selfClosingTag: { enum: ['always', 'never'] }
                },
                additionalProperties: false
            }
        ],
        fixable: 'whitespace'
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const tokens = context.parserServices.getTemplateBodyTokenStore?.();
        const options = parseOptions(context.options[0], tokens);

        return utils.defineTemplateBodyVisitor(context,
            {

                'XStartTag, XEndTag'(node: XStartTag | XEndTag) {
                    const type = options.detectType(node);
                    const lastToken = tokens.getLastToken(node) as Token;
                    const prevToken = tokens.getLastToken(node, 1);

                    // Skip if EOF exists in the tag or linebreak exists before `>`.
                    if (type == null || prevToken == null || prevToken.loc.end.line !== lastToken.loc.start.line) {
                        return;
                    }

                    const hasSpace = prevToken.range[1] !== lastToken.range[0];
                    if (type === 'always' && !hasSpace) {
                        context.report({
                            node,
                            loc: lastToken.loc,
                            message: 'Expected a space before \'{{bracket}}\', but not found.',
                            data: { bracket: sourceCode.getText(lastToken as Node) },
                            fix: fixer => fixer.insertTextBefore(lastToken as Node, ' ')
                        });
                    }
                    else if (type === 'never' && hasSpace) {
                        context.report({
                            node,
                            loc: {
                                start: prevToken.loc.end,
                                end: lastToken.loc.end
                            },
                            message: 'Expected no space before \'{{bracket}}\', but found.',
                            data: { bracket: sourceCode.getText(lastToken as Node) },
                            fix: fixer => fixer.removeRange([prevToken.range[1], lastToken.range[0]])
                        });
                    }
                }
            });
    }
} as RuleModule;
