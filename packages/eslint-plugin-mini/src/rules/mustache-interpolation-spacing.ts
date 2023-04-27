import type { AST } from 'eslint';
import utils from '../utils';

export default {
    meta: {
        type: 'layout',
        docs: {
            description: 'enforce unified spacing in mustache interpolations',
            categories: ['essential'],
            url: utils.getRuleUrl('mustache-interpolation-spacing')
        },
        fixable: 'whitespace',
        schema: [
            {
                enum: ['always', 'never']
            }
        ]
    },

    create(context) {
        const options = context.options[0] || 'always';
        const tokenStore = context.parserServices.getTemplateBodyTokenStore?.();

        return utils.defineTemplateBodyVisitor(context, {

            'XExpressionContainer[expression!=null]'(node: XExpressionContainer) {
                const openBrace = tokenStore.getFirstToken(node) as Token;
                const closeBrace = tokenStore.getLastToken(node) as Token;

                if (!openBrace
                    || !closeBrace
                    || openBrace.type !== 'XExpressionStart'
                    || closeBrace.type !== 'XExpressionEnd'
                ) {
                    return;
                }

                const firstToken = tokenStore.getTokenAfter(openBrace, {
                    includeComments: true
                }) as Token;
                const lastToken = tokenStore.getTokenBefore(closeBrace, {
                    includeComments: true
                }) as Token;

                if (options === 'always') {
                    if (openBrace.range[1] === firstToken.range[0]) {
                        context.report({
                            node: openBrace,
                            message: 'Expected 1 space after \'{{\', but not found.',
                            fix: fixer => fixer.insertTextAfter(openBrace as AST.Token, ' ')
                        });
                    }
                    if (closeBrace.range[0] === lastToken.range[1]) {
                        context.report({
                            node: closeBrace,
                            message: 'Expected 1 space before \'}}\', but not found.',
                            fix: fixer => fixer.insertTextBefore(closeBrace as Node, ' ')
                        });
                    }
                }
                else {
                    if (openBrace.range[1] !== firstToken.range[0]) {
                        context.report({
                            loc: {
                                start: openBrace.loc.start,
                                end: firstToken?.loc.start
                            },
                            message: 'Expected no space after \'{{\', but found.',
                            fix: fixer =>
                                fixer.removeRange([openBrace.range[1], firstToken.range[0]])
                        });
                    }
                    if (closeBrace.range[0] !== lastToken.range[1]) {
                        context.report({
                            loc: {
                                start: lastToken.loc.end,
                                end: closeBrace.loc.end
                            },
                            message: 'Expected no space before \'}}\', but found.',
                            fix: fixer =>
                                fixer.removeRange([lastToken.range[1], closeBrace.range[0]])
                        });
                    }
                }
            }
        });
    }
} as RuleModule;
