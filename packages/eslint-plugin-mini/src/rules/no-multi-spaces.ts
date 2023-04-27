import utils from '../utils';

const isProperty = (context: RuleContext, node: Token) => {
    const sourceCode = context.getSourceCode();
    return node.type === 'Punctuator' && sourceCode.getText(node as Node) === ':';
};

export default {
    meta: {
        type: 'layout',
        docs: {
            description: 'disallow multiple spaces',
            categories: ['essential'],
            url: utils.getRuleUrl('no-multi-spaces')
        },
        fixable: 'whitespace',
        schema: [
            {
                type: 'object',
                properties: {
                    ignoreProperties: {
                        type: 'boolean'
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {
        const options = context.options[0] || {};
        const ignoreProperties = options.ignoreProperties === true;
        const emptyListener = {};

        const sourceCode = context.getSourceCode();
        if (!sourceCode.ast || !('templateBody' in sourceCode.ast)) {
            return emptyListener;
        }

        const ast = sourceCode.ast as XProgram;
        const tokenStore = context.parserServices.getTemplateBodyTokenStore();
        const tokens = tokenStore.getTokens(ast.templateBody, {
            includeComments: true
        });

        if (!tokens.length) {
            return emptyListener;
        }

        let prevToken = tokens.shift() as Token;
        for (const token of tokens) {
            const spaces = token.range[0] - prevToken.range[1];
            const shouldIgnore = ignoreProperties
                && (isProperty(context, token) || isProperty(context, prevToken));

            if (spaces > 1
                && token.loc.start.line === prevToken.loc.start.line
                && !shouldIgnore
            ) {
                context.report({
                    node: token,
                    loc: {
                        start: prevToken.loc.end,
                        end: token.loc.start
                    },
                    message: `Multiple spaces found before '${ sourceCode.getText(token as Node) }'.`,
                    /* eslint-disable-next-line @typescript-eslint/no-loop-func */
                    fix: fixer => fixer.replaceTextRange([prevToken.range[1], token.range[0]], ' '),
                });
            }
            prevToken = token;
        }

        return emptyListener;
    }
} as RuleModule;
