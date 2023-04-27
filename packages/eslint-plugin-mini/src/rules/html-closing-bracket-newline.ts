import utils from '../utils';

function getPhrase(lineBreaks: number) {
    switch (lineBreaks) {
        case 0:
            return 'no line breaks';
        case 1:
            return '1 line break';
        default:
            return `${ lineBreaks } line breaks`;
    }
}

export default {
    meta: {
        type: 'layout',
        docs: {
            description:
        'require or disallow a line break before tag\'s closing brackets',
            categories: ['recommended'],
            url: utils.getRuleUrl('html-closing-bracket-newline')
        },
        fixable: 'whitespace',
        schema: [
            {
                type: 'object',
                properties: {
                    singleline: { enum: ['always', 'never'] },
                    multiline: { enum: ['always', 'never'] }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {
        const options = {
            singleline: 'never',
            multiline: 'always',
            ...context.options[0] || {}
        };
        const template = context.parserServices.getTemplateBodyTokenStore?.();
        return utils.defineTemplateBodyVisitor(context, {

            'XStartTag, XEndTag'(node: XStartTag | XEndTag) {
                const closingBracketToken = template.getLastToken(node)!;
                if (
                    closingBracketToken.type !== 'HTMLSelfClosingTagClose'
                    && closingBracketToken.type !== 'HTMLTagClose'
                ) {
                    return;
                }

                const prevToken = template.getTokenBefore(closingBracketToken)!;
                const type = node.loc.start.line === prevToken.loc.end.line
                    ? 'singleline'
                    : 'multiline';
                const expectedLineBreaks = options[type] === 'always' ? 1 : 0;
                const actualLineBreaks = closingBracketToken.loc.start.line - prevToken.loc.end.line;

                if (actualLineBreaks !== expectedLineBreaks) {
                    context.report({
                        node,
                        loc: {
                            start: prevToken.loc.end,
                            end: closingBracketToken.loc.start
                        },
                        message:
                            'Expected {{expected}} before closing bracket, but {{actual}} found.',
                        data: {
                            expected: getPhrase(expectedLineBreaks),
                            actual: getPhrase(actualLineBreaks)
                        },
                        fix(fixer) {

                            const range: Range = [prevToken.range[1], closingBracketToken.range[0]];
                            const text = '\n'.repeat(expectedLineBreaks);
                            return fixer.replaceTextRange(range, text);
                        }
                    });
                }
            }
        });
    }
} as RuleModule;
