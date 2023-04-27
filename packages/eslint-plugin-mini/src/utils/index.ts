import type { Rule } from 'eslint';
import { Linter } from 'eslint';

const emptyTextReg = /^\s*$/;
const mpxmlExtReg = /\.(?:wxml|axml|swan)$/;

/**
 * @typedef {import('../../typings/global')}
 */

/**
 * is wxml or axml or swan file
 * @param {string} filename file name
 * @returns {boolean}
 */
const isMpXmlFile = (filename: string): boolean => mpxmlExtReg.test(filename);

/**
 * get rule url
 * @param {string} name rule name
 */
const getRuleUrl = (name: string) => 'https://github.com/mewjs/mew'
    + `/packages/eslint-plugin-mini/docs/rules/${ name }.md`;

/** @type { Map<string, Rule.RuleModule> | null } */
let ruleMap: Map<string, Rule.RuleModule> | null = null;

/**
 * Get the core rule implementation from the rule name
 * @param {string} name
 * @returns {Rule.RuleModule}
 */
function getCoreRule(name: string): Rule.RuleModule {
    const map = ruleMap
        || (ruleMap = new Linter().getRules());
    return map.get(name) || require(`eslint/lib/rules/${ name }`);
}

/**
 * Wrap the rule context object to override methods which access to tokens (such as getTokenAfter).
 * @param {RuleContext} context The rule context object.
 * @param {ParserServices.TokenStore} tokenStore The token store object for template.
 * @returns {RuleContext}
 */
function wrapContextToOverrideTokenMethods(context: RuleContext, tokenStore: ParserServices.XTokenStore): RuleContext {
    const eslintSourceCode = context.getSourceCode();

    /** @type {Token[] | null} */
    let tokensAndComments: Token[] | null = null;
    function getTokensAndComments() {
        if (tokensAndComments) {
            return tokensAndComments;
        }
        // @ts-expect-error
        const { templateBody } = eslintSourceCode.ast;

        tokensAndComments = templateBody
            ? tokenStore.getTokens(templateBody, {
                includeComments: true
            }) as Token[]
            : [];
        return tokensAndComments;
    }
    const sourceCode = new Proxy(({ ...eslintSourceCode }), {
        get(_object, key) {
            if (key === 'tokensAndComments') {
                return getTokensAndComments();
            }
            return key in tokenStore ? tokenStore[key] : eslintSourceCode[key];
        }
    });
    return {
        __proto__: context,
        // @ts-expect-error
        getSourceCode() {
            return sourceCode;
        }
    };
}

export default {

    getRuleUrl,

    isMpXmlFile,

    /**
     * Register the given visitor to parser services.
     * If the parser service of `vue-eslint-parser` was not found,
     * this generates a warning.
     *
     * @param {RuleContext} context The rule context to use parser services.
     * @param {TemplateListener} templateBodyVisitor The visitor to traverse the template body.
     * @param {RuleListener} [scriptVisitor] The visitor to traverse the script.
     * @returns {RuleListener} The merged visitor.
     */
    defineTemplateBodyVisitor(
        context: RuleContext,
        templateBodyVisitor: TemplateListener,
        scriptVisitor?: RuleListener
    ): RuleListener {
        if (context.parserServices.defineTemplateBodyVisitor == null) {
            if (isMpXmlFile(context.getFilename())) {
                context.report({
                    loc: { line: 1, column: 0 },
                    message: 'Use the latest mpxml-eslint-parser.'
                });
            }
            return {};
        }
        return context.parserServices.defineTemplateBodyVisitor(
            templateBodyVisitor,
            scriptVisitor
        );
    },

    /**
     * get previous node, ignore empty text node
     * @param {XElement|XText|XExpressionContainer} node node.
     * @returns {XNode|null} `true` if the start tag has the directive.
     */
    getPrevNode(node: XElement | XText | XExpressionContainer): XNode | null {
        // @ts-expect-error
        const { children } = node.parent;
        if (!children || !children.length) {
            return null;
        }
        let index = children.indexOf(node);
        if (index <= 0) {
            return null;
        }
        let prevNode: XElement | XText | XExpressionContainer | null = null;
        while ((prevNode = children[--index])) {
            if (prevNode.type !== 'XText'
                || prevNode.type === 'XText' && !emptyTextReg.test(prevNode.value)) {
                break;
            }
        }
        return prevNode;
    },

    /**
     * get next node, ignore empty text node
     * @param {XElement|XText|XExpressionContainer} node node.
     * @returns {XNode|null} `true` if the start tag has the directive.
     */
    getNextNode(node: XElement | XText | XExpressionContainer): XNode | null {
        // @ts-expect-error
        const { children } = node.parent;
        if (!children || !children.length) {
            return null;
        }
        let index = children.findIndex(node);
        if (index === -1 || index === children.length - 1) {
            return null;
        }

        let nextNode: XNode | null = null;
        while ((nextNode = children[++index])) {
            if (nextNode.type !== 'XText'
                || nextNode.type === 'XText' && !emptyTextReg.test(nextNode.value)) {
                break;
            }
        }
        return nextNode;
    },

    /**
     * Check whether the given start tag has specific attribute.
     * @param {XElement} node The start tag node to check.
     * @param {string} name The directive name to check.
     * @returns {boolean} `true` if the start tag has the directive.
     */
    hasAttribute(node: XElement, name: string): boolean {
        return Boolean(this.getAttribute(node, name));
    },

    /**
     * Get the directive which has the given name.
     *
     * @param {XElement} node The start tag node to check.
     * @param {string} name The directive name to check.
     * @returns {XDirective | null} The found directive.
     */
    getAttribute(node: XElement, name: string): XDirective | null {
        // @ts-expect-error
        return (
            node.startTag.attributes.find(
                node => (
                    !node.directive && node.key.name === name
                )
            ) || null
        );
    },

    /**
     * Check whether the given start tag has specific directive.
     * @param {XElement} node The start tag node to check.
     * @param {string} name The directive name to check.
     * @returns {boolean} `true` if the start tag has the directive.
     */
    hasDirective(node: XElement, name: string): boolean {
        return Boolean(this.getDirective(node, name));
    },

    /**
     * Get the directive which has the given name.
     *
     * @param {XElement} node The start tag node to check.
     * @param {string} name The directive name to check.
     * @returns {XDirective | null} The found directive.
     */
    getDirective(node: XElement, name: string): XDirective | null {
        // @ts-expect-error
        return (
            node.startTag.attributes.find(
                node => (
                    node.directive && node.key.name.name === name
                )
            ) || null
        );
    },

    /**
     * Check whether the given  attribute has no value (wx:else)
     * @param {XAttribute|XDirective} node The directive attribute node to check.
     * @returns {boolean}
     */
    hasNoValue(node: XAttribute | XDirective): boolean {
        if (node.value == null || !node.value.length) {
            return true;
        }
        return false;
    },

    /**
     * Check whether the given directive attribute is expression (="{{expr}}")
     * @param {XDirective} node The directive attribute node to check.
     * @returns {boolean}
     */
    isEmptyValueExpression(node: XDirective): boolean {
        if (node.value == null || !node.value.length) {
            return true;
        }
        const [value] = node.value;

        // @ts-expect-error
        if (value.expression == null) {
            return true;
        }
        return false;
    },

    /**
     * Check attribute value type
     * @param {XDirective|XAttribute} node The directive attribute node to check.
     * @returns {'none' | 'literal' | 'expression' | 'mixed'}
     */
    getValueType(node: XDirective | XAttribute): 'none' | 'literal' | 'expression' | 'mixed' {
        if (node.value == null || !node.value.length) {
            return 'none';
        }

        if (node.value.every(v => v.type === 'XLiteral')) {
            return 'literal';
        }

        if (node.value.every(v => v.type === 'XExpressionContainer')) {
            return 'expression';
        }

        return 'mixed';
    },

    /**
     * Check whether the given attribute is literal text (="expr")
     * @param {XDirective|XAttribute} node The directive attribute node to check.
     * @returns {boolean}
     */
    isEmptyValueLiteral(node: XDirective | XAttribute): boolean {
        if (node.value == null || !node.value.length) {
            return true;
        }

        return node.value.every(v => v.type === 'XLiteral' && emptyTextReg.test(v.value));
    },

    /**
     * Check whether the given directive attribute has their empty value (`=""`).
     * @param {XDirective|XAttribute} node The directive attribute node to check.
     * @returns {boolean} `true` if the directive attribute has their empty value (`=""`).
     */
    isEmptyValueMixed(node: XDirective | XAttribute): boolean {
        if (node.value == null || !node.value.length) {
            return true;
        }
        const [value] = node.value;

        if (value.type === 'XExpressionContainer' && value.expression == null) {
            return true;
        }

        if (value.type === 'XLiteral' && !value.value) {
            return true;
        }

        return false;
    },

    /**
   * Check whether the component is declared in a single line or not.
   * @param {XNode} node
   * @returns {boolean}
   */
    isSingleLine(node: XNode): boolean {
        return node.loc.start.line === node.loc.end.line;
    },

    /**
   * Checks whether or not the tokens of two given nodes are same.
   * @param {XNode} left A node 1 to compare.
   * @param {XNode} right A node 2 to compare.
   * @param {ParserServices.TokenStore | SourceCode} sourceCode The ESLint source code object.
   * @returns {boolean} the source code for the given node.
   */
    equalTokens(left: XNode, right: XNode, sourceCode: ParserServices.XTokenStore | SourceCode): boolean {
        const tokensL = sourceCode.getTokens(left);
        const tokensR = sourceCode.getTokens(right);

        if (tokensL.length !== tokensR.length) {
            return false;
        }
        for (let i = 0; i < tokensL.length; ++i) {
            if (
                tokensL[i].type !== tokensR[i].type
        || tokensL[i].value !== tokensR[i].value
            ) {
                return false;
            }
        }

        return true;
    },

    /**
     * Get the previous sibling element of the given element.
     * @param {XElement} node The element node to get the previous sibling element.
     * @returns {XElement|null} The previous sibling element.
     */
    prevSibling(node: XElement): XElement | null {
        let prevElement: XElement | null = null;

        for (const siblingNode of node.parent?.children || []) {
            if (siblingNode === node) {
                return prevElement;
            }
            if (siblingNode.type === 'XElement') {
                prevElement = siblingNode;
            }
        }

        return null;
    },

    /**
     * Wrap a given core rule to apply it to Vue.js template.
     * @param {string} coreRuleName The name of the core rule implementation to wrap.
     * @param {Object} [options] The option of this rule.
     * @param {string[]} [options.categories] The categories of this rule.
     * @returns {RuleModule} The wrapped rule implementation.
     */
    wrapCoreRule(coreRuleName: string): RuleModule {
        const coreRule = getCoreRule(coreRuleName);
        return {
            create(context) {
                const tokenStore = context.parserServices?.getTemplateBodyTokenStore?.();

                // The `context.getSourceCode()` cannot access the tokens of templates.
                // So override the methods which access to tokens by the `tokenStore`.
                if (tokenStore) {
                    context = wrapContextToOverrideTokenMethods(context, tokenStore);
                }

                // Move `Program` handlers to `XElement[parent.type!='XElement']`
                const coreHandlers = coreRule.create(context);

                const handlers = Object.entries(coreHandlers).reduce<RuleListener>(
                    (handlers, [key, handler]) => {
                        key = (key === 'Program' || key === 'Program:exit')
                            ? key.replace(/\bProgram\b/g, 'XExpressionContainer')
                            : key.replace(/^|(?<=,)/g, 'XExpressionContainer ');

                        handlers[key] = handler;

                        return handlers;
                    },
                    {}
                );

                // const handlers = { ...coreHandlers } as RuleListener;
                // for (const [key, handler] of Object.entries(handlers)) {
                //     let newKey = '';
                //     if (key === 'Program' || key === 'Program:exit') {
                //         newKey = key.replace(/\bProgram\b/g, 'XExpressionContainer');
                //     }
                //     else {
                //         newKey = key.replace(/^|(?<=,)/g, 'XExpressionContainer ');
                //     }
                //     handlers[newKey] = handler;
                //     delete handlers[key];
                // }

                // Apply the handlers to templates.
                return context.parserServices.defineTemplateBodyVisitor(handlers);
            },
            meta: {
                ...coreRule.meta, docs: {
                    // @ts-expect-error
                    ...coreRule.meta.docs,
                    category: '',
                    // @ts-expect-error
                    categories: ['essential'],
                    url: getRuleUrl(coreRuleName),
                    extensionRule: true,
                    // @ts-expect-error
                    coreRuleUrl: coreRule.meta.docs.url
                }
            },
        };
    }
};
