import utils from '../utils';
import type { ParsedHTMLComment } from '../utils/html-comments';
import htmlComments from '../utils/html-comments';

function parseOption(param: string | JSONSchema4) {
    if (param && typeof param === 'string') {
        return {
            singleline: param,
            multiline: param
        };
    }

    return {
        singleline: 'never',
        multiline: 'always',
        ...param as JSONSchema4
    };
}

/**
 * Reports the newline before the contents of a given comment if it's invalid.
 * @param {RuleContext} context
 * @param {ParsedHTMLComment} comment - comment data.
 * @param {boolean} requireNewline - `true` if line breaks are required.
 * @returns {void}
 */
function checkCommentOpen(context: RuleContext, comment: ParsedHTMLComment, requireNewline: boolean): void {
    const { value, openDecoration, open } = comment;
    if (!value) {
        return;
    }
    const beforeToken = openDecoration || open;

    if (requireNewline) {
        if (beforeToken.loc.end.line < value.loc.start.line) {
            // Is valid
            return;
        }
        context.report({
            loc: {
                start: beforeToken.loc.end,
                end: value.loc.start
            },
            messageId: openDecoration
                ? 'expectedAfterExceptionBlock'
                : 'expectedAfterHTMLCommentOpen',
            fix: openDecoration
                ? null
                // @ts-expect-error
                : fixer => fixer.insertTextAfter(beforeToken, '\n')
        });
    }
    else {
        if (beforeToken.loc.end.line === value.loc.start.line) {
            // Is valid
            return;
        }
        context.report({
            loc: {
                start: beforeToken.loc.end,
                end: value.loc.start
            },
            messageId: 'unexpectedAfterHTMLCommentOpen',
            fix: fixer =>
                fixer.replaceTextRange([beforeToken.range[1], value.range[0]], ' ')
        });
    }
}

/**
     * Reports the space after the contents of a given comment if it's invalid.
     * @param {RuleContext} context
     * @param {ParsedHTMLComment} comment - comment data.
     * @param {boolean} requireNewline - `true` if line breaks are required.
     * @returns {void}
     */
function checkCommentClose(context: RuleContext, comment: ParsedHTMLComment, requireNewline: boolean): void {
    const { value, closeDecoration, close } = comment;
    if (!value) {
        return;
    }
    const afterToken = closeDecoration || close;

    if (requireNewline) {
        if (value.loc.end.line < afterToken.loc.start.line) {
            // Is valid
            return;
        }
        context.report({
            loc: {
                start: value.loc.end,
                end: afterToken.loc.start
            },
            messageId: closeDecoration
                ? 'expectedBeforeExceptionBlock'
                : 'expectedBeforeHTMLCommentOpen',
            fix: closeDecoration
                ? null
                // @ts-expect-error
                : fixer => fixer.insertTextBefore(afterToken, '\n')
        });
    }
    else {
        if (value.loc.end.line === afterToken.loc.start.line) {
            // Is valid
            return;
        }
        context.report({
            loc: {
                start: value.loc.end,
                end: afterToken.loc.start
            },
            messageId: 'unexpectedBeforeHTMLCommentOpen',
            fix: fixer =>
                fixer.replaceTextRange([value.range[1], afterToken.range[0]], ' ')
        });
    }
}

export default {
    meta: {
        type: 'layout',

        docs: {
            description: 'enforce unified line brake in HTML comments',
            categories: ['essential'],
            url: utils.getRuleUrl('html-comment-content-newline')
        },
        fixable: 'whitespace',
        schema: [
            {
                anyOf: [
                    {
                        enum: ['always', 'never']
                    },
                    {
                        type: 'object',
                        properties: {
                            singleline: { enum: ['always', 'never', 'ignore'] },
                            multiline: { enum: ['always', 'never', 'ignore'] }
                        },
                        additionalProperties: false
                    }
                ]
            },
            {
                type: 'object',
                properties: {
                    exceptions: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    }
                },
                additionalProperties: false
            }
        ],
        messages: {
            expectedAfterHTMLCommentOpen: 'Expected line break after \'<!--\'.',
            expectedBeforeHTMLCommentOpen: 'Expected line break before \'-->\'.',
            expectedAfterExceptionBlock: 'Expected line break after exception block.',
            expectedBeforeExceptionBlock:
        'Expected line break before exception block.',
            unexpectedAfterHTMLCommentOpen: 'Unexpected line breaks after \'<!--\'.',
            unexpectedBeforeHTMLCommentOpen: 'Unexpected line breaks before \'-->\'.'
        }
    },

    create(context) {
        const option = parseOption(context.options[0]);
        return htmlComments.defineVisitor(
            context,
            context.options[1],
            comment => {
                const { value, openDecoration, closeDecoration } = comment;
                if (!value) {
                    return;
                }

                const startLine = openDecoration
                    ? openDecoration.loc.end.line
                    : value.loc.start.line;
                const endLine = closeDecoration
                    ? closeDecoration.loc.start.line
                    : value.loc.end.line;
                const newlineType = startLine === endLine ? option.singleline : option.multiline;

                if (newlineType === 'ignore') {
                    return;
                }
                checkCommentOpen(context, comment, newlineType !== 'never');
                checkCommentClose(context, comment, newlineType !== 'never');
            }
        );
    }
} as RuleModule;
