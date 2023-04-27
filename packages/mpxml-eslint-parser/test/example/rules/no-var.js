/**
 * @file not-empty.js
 */

/* eslint-disable import/unambiguous, @typescript-eslint/no-var-requires, import/no-commonjs, @typescript-eslint/prefer-optional-chain */

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow var',
            categories: ['essential'],
            url: ''
        },
        fixable: null,

        schema: []
    },

    /** @param {RuleContext} context */
    create(context) {

        return {
            VariableDeclaration(node) {
                if (node.kind === 'var') {
                    context.report({
                        node,
                        loc: node.loc,
                        message: 'no var!'
                    });
                }
            }
        };
    }
};
