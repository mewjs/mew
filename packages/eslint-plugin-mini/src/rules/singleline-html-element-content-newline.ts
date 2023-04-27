import type { CountOptions, SkipOptions } from '@mewjs/mpxml-eslint-parser/lib/external/token-store';
import utils from '../utils';

import casing from '../utils/casing';
import INLINE_ELEMENTS from '../utils/inline-non-void-elements.json';

function isSinglelineElement(element: XElement & { endTag: XEndTag }) {
    return element.loc.start.line === element.endTag.loc.start.line;
}

interface Options {
    ignores: string[];
    ignoreWhenEmpty: boolean;
    ignoreWhenNoAttributes: boolean;
}

function parseOptions(options?: Options): Options {
    const {
        ignores = INLINE_ELEMENTS,
        ignoreWhenEmpty = true,
        ignoreWhenNoAttributes = true
    } = options || {};

    return {
        ignores,
        ignoreWhenNoAttributes,
        ignoreWhenEmpty
    };
}

type XElementWithEngWTag = XElement & { endTag: XEndTag };

/**
 * Check whether the given element is empty or not.
 * This ignores whitespaces, doesn't ignore comments.
 * @param {XElement & { endTag: XEndTag } } node The element node to check.
 * @param {SourceCode} sourceCode The source code object of the current context.
 * @returns {boolean} `true` if the element is empty.
 */
function isEmpty(node: XElementWithEngWTag, sourceCode: SourceCode): boolean {
    const start = node.startTag.range[1];
    const end = node.endTag.range[0];

    return sourceCode.text.slice(start, end).trim() === '';
}

export default {
    meta: {
        type: 'layout',
        docs: {
            description:
        'require a line break before and after the contents of a singleline element',
            categories: ['recommended'],
            url: utils.getRuleUrl('singleline-html-element-content-newline')
        },
        fixable: 'whitespace',
        schema: [
            {
                type: 'object',
                properties: {
                    ignoreWhenNoAttributes: {
                        type: 'boolean'
                    },
                    ignoreWhenEmpty: {
                        type: 'boolean'
                    },
                    ignores: {
                        type: 'array',
                        items: { type: 'string' },
                        uniqueItems: true,
                        additionalItems: false
                    }
                },
                additionalProperties: false
            }
        ],
        messages: {
            unexpectedAfterClosingBracket:
        'Expected 1 line break after opening tag (`<{{name}}>`), but no line breaks found.',
            unexpectedBeforeOpeningBracket:
        'Expected 1 line break before closing tag (`</{{name}}>`), but no line breaks found.'
        }
    },

    create(context) {
        const options = parseOptions(context.options[0]);
        const { ignores } = options;
        const { ignoreWhenNoAttributes } = options;
        const { ignoreWhenEmpty } = options;
        const template = context.parserServices?.getTemplateBodyTokenStore?.();
        const sourceCode = context.getSourceCode();

        let inIgnoreElement: XElement | null = null;

        /** @param {XElement} node */
        function isIgnoredElement(node: XElement) {
            return (
                ignores.includes(node.name)
                || ignores.includes(casing.pascalCase(node.rawName))
                || ignores.includes(casing.kebabCase(node.rawName))
            );
        }

        return utils.defineTemplateBodyVisitor(context, {

            XElement(node) {
                if (inIgnoreElement) {
                    return;
                }
                if (isIgnoredElement(node)) {
                    inIgnoreElement = node;
                    return;
                }
                if (node.startTag.selfClosing || !node.endTag) {
                    // self closing
                    return;
                }

                const elem = node as XElementWithEngWTag;

                if (!isSinglelineElement(elem)) {
                    return;
                }
                if (ignoreWhenNoAttributes && elem.startTag.attributes.length === 0) {
                    return;
                }

                const getTokenOption: (CountOptions | SkipOptions) = {
                    includeComments: true,
                    filter: token => token.type !== 'HTMLWhitespace'
                };
                if (
                    ignoreWhenEmpty
                    && elem.children.length === 0
                    && template.getFirstTokensBetween(
                        elem.startTag,
                        elem.endTag,
                        getTokenOption
                    ).length === 0
                ) {
                    return;
                }

                const contentFirst = template.getTokenAfter(
                    elem.startTag,
                    getTokenOption
                ) as Token;
                const contentLast = template.getTokenBefore(
                    elem.endTag,
                    getTokenOption
                ) as Token;

                context.report({
                    node: template.getLastToken(elem.startTag) as Token,
                    loc: {
                        start: elem.startTag.loc.end,
                        end: contentFirst.loc.start
                    },
                    messageId: 'unexpectedAfterClosingBracket',
                    data: {
                        name: elem.rawName
                    },
                    fix(fixer) {
                        const range: Range = [elem.startTag.range[1], contentFirst.range[0]];
                        return fixer.replaceTextRange(range, '\n');
                    }
                });

                if (isEmpty(elem, sourceCode)) {
                    return;
                }

                context.report({
                    node: template.getFirstToken(elem.endTag) as Token,
                    loc: {
                        start: contentLast.loc.end,
                        end: elem.endTag.loc.start
                    },
                    messageId: 'unexpectedBeforeOpeningBracket',
                    data: {
                        name: elem.rawName
                    },
                    fix(fixer) {

                        const range: Range = [contentLast.range[1], elem.endTag.range[0]];
                        return fixer.replaceTextRange(range, '\n');
                    }
                });
            },

            'XElement:exit'(node: XElement) {
                if (inIgnoreElement === node) {
                    inIgnoreElement = null;
                }
            }
        });
    }
} as RuleModule;
