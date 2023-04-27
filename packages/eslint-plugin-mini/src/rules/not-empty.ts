import utils from '../utils';

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow empty file content',
            categories: ['essential'],
            url: utils.getRuleUrl('not-empty')
        },

        schema: [
            {
                type: 'object',
                properties: {
                    allowComment: {
                        type: 'boolean'
                    }
                }
            }
        ]
    },

    create(context) {
        if (!utils.isMpXmlFile(context.getFilename()) || !context.parserServices.getDocumentFragment) {
            return {};
        }

        const options = context.options[0] || {};
        const allowComment = options.allowComment !== false;

        const node = context.parserServices.getDocumentFragment();
        if (node == null) {
            context.report({
                // node: {},
                loc: {
                    start: { line: 0, column: 0 },
                    end: { line: 0, column: 0 }
                },
                message: 'disallow empty file content'
            });
            return {};
        }

        const isEmpty = allowComment
            ? node.comments.length === 0 && node.children.length === 0
            : node.children.length === 0;

        if (isEmpty) {
            context.report({
                node,
                loc: node.loc,
                message: 'disallow empty file content'
            });
        }

        return {};
    }
} as RuleModule;
