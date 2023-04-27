// @ts-nocheck
const KNOWN_NODES = new Set([
    'ArrayExpression',
    'ArrayPattern',
    'ArrowFunctionExpression',
    'AssignmentExpression',
    'AssignmentPattern',
    'AwaitExpression',
    'BinaryExpression',
    'BlockStatement',
    'BreakStatement',
    'CallExpression',
    'CatchClause',
    'ChainExpression',
    'ClassBody',
    'ClassDeclaration',
    'ClassExpression',
    'ConditionalExpression',
    'ContinueStatement',
    'DebuggerStatement',
    'DoWhileStatement',
    'EmptyStatement',
    'ExportAllDeclaration',
    'ExportDefaultDeclaration',
    'ExportNamedDeclaration',
    'ExportSpecifier',
    'ExpressionStatement',
    'ForInStatement',
    'ForOfStatement',
    'ForStatement',
    'FunctionDeclaration',
    'FunctionExpression',
    'Identifier',
    'IfStatement',
    'ImportDeclaration',
    'ImportDefaultSpecifier',
    'ImportExpression',
    'ImportNamespaceSpecifier',
    'ImportSpecifier',
    'LabeledStatement',
    'Literal',
    'LogicalExpression',
    'MemberExpression',
    'MetaProperty',
    'MethodDefinition',
    'NewExpression',
    'ObjectExpression',
    'ObjectPattern',
    'Program',
    'Property',
    'RestElement',
    'ReturnStatement',
    'SequenceExpression',
    'SpreadElement',
    'Super',
    'SwitchCase',
    'SwitchStatement',
    'TaggedTemplateExpression',
    'TemplateElement',
    'TemplateLiteral',
    'ThisExpression',
    'ThrowStatement',
    'TryStatement',
    'UnaryExpression',
    'UpdateExpression',
    'VariableDeclaration',
    'VariableDeclarator',
    'WhileStatement',
    'WithStatement',
    'YieldExpression',
    'XAttribute',
    'XDirectiveKey',
    'XDocumentFragment',
    'XElement',
    'XEndTag',
    'XExpressionContainer',
    'XModuleContainer',
    'XForExpression',
    'XIdentifier',
    'XLiteral',
    'XOnExpression',
    'XStartTag',
    'XText'
]);
const NON_STANDARD_KNOWN_NODES = new Set([
    'ExperimentalRestProperty',
    'ExperimentalSpreadProperty'
]);
const LT_CHAR = /[\r\n\u2028\u2029]/;
const LINES = /[^\r\n\u2028\u2029]+(?:$|\r\n|[\r\n\u2028\u2029])/g;
const BLOCK_COMMENT_PREFIX = /^\s*\*/;
const ITERATION_OPTS = Object.freeze({
    includeComments: true,
    filter: isNotWhitespace
});
const PREFORMATTED_ELEMENT_NAMES = ['pre', 'textarea'];

interface IndentOptions {
    indentChar: ' ' | '\t';
    indentSize: number;
    baseIndent: number;
    scriptBaseIndent: number;
    attribute: number;
    closeBracket: {
        startTag: number;
        endTag: number;
        selfClosingTag: number;
    };
    switchCase: number;
    alignAttributesVertically: boolean;
    ignores: string[];
}

interface IndentUserOptions {
    indentChar?: ' ' | '\t' ;
    indentSize?: number;
    baseIndent?: number;
    scriptBaseIndent?: number;
    attribute?: number;
    closeBracket?: IndentOptions['closeBracket'] | number;
    switchCase?: number;
    alignAttributesVertically?: boolean;
    ignores?: string[];
}

/**
 * Normalize options.
 * @param {number|"tab"|undefined} type The type of indentation.
 * @param {IndentUserOptions} options Other options.
 * @param {Partial<IndentOptions>} defaultOptions The default value of options.
 * @returns {IndentOptions} Normalized options.
 */
function parseOptions(
    type: number | 'tab' | undefined,
    options: IndentUserOptions,
    defaultOptions: Partial<IndentOptions>
): IndentOptions {

    const ret: IndentOptions = {
        indentChar: ' ',
        indentSize: 2,
        baseIndent: 0,
        scriptBaseIndent: 0,
        attribute: 1,
        closeBracket: {
            startTag: 0,
            endTag: 0,
            selfClosingTag: 0
        },
        switchCase: 0,
        alignAttributesVertically: true,
        ignores: [],
        ...defaultOptions
    };

    if (Number.isSafeInteger(type)) {
        ret.indentSize = Number(type);
    }
    else if (type === 'tab') {
        ret.indentChar = '\t';
        ret.indentSize = 1;
    }

    if (Number.isSafeInteger(options.baseIndent)) {
        ret.baseIndent = options.baseIndent || 0;
    }

    if (Number.isSafeInteger(options.scriptBaseIndent)) {
        ret.scriptBaseIndent = options.scriptBaseIndent || 0;
    }

    if (Number.isSafeInteger(options.attribute)) {
        ret.attribute = options.attribute || 1;
    }
    if (Number.isSafeInteger(options.closeBracket)) {
        const pos = Number(options.closeBracket);
        ret.closeBracket = {
            startTag: pos,
            endTag: pos,
            selfClosingTag: pos
        };
    }
    else if (options.closeBracket) {
        ret.closeBracket = {
            startTag: 0,
            endTag: 0,
            selfClosingTag: 0,
            // @ts-expect-error
            ...options.closeBracket
        };
    }
    if (Number.isSafeInteger(options.switchCase)) {
        // @ts-expect-error
        ret.switchCase = options.switchCase;
    }

    if (options.alignAttributesVertically != null) {
        ret.alignAttributesVertically = options.alignAttributesVertically;
    }
    if (options.ignores != null) {
        ret.ignores = options.ignores;
    }

    return ret;
}

/**
 * Check whether the given token is an arrow.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `true` if the token is an arrow.
 */
function isArrow(token?: Token | null): boolean {
    return token != null && token.type === 'Punctuator' && token.value === '=>';
}

/**
 * Check whether the given token is a left parenthesis.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `true` if the token is a left parenthesis.
 */
function isLeftParen(token?: Token | null): boolean {
    return token != null && token.type === 'Punctuator' && token.value === '(';
}

/**
 * Check whether the given token is a left parenthesis.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `false` if the token is a left parenthesis.
 */
function isNotLeftParen(token?: Token | null): boolean {
    return token != null && (token.type !== 'Punctuator' || token.value !== '(');
}

/**
 * Check whether the given token is a right parenthesis.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `true` if the token is a right parenthesis.
 */
function isRightParen(token?: Token | null): boolean {
    return token != null && token.type === 'Punctuator' && token.value === ')';
}

/**
 * Check whether the given token is a right parenthesis.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `false` if the token is a right parenthesis.
 */
function isNotRightParen(token?: Token | null): boolean {
    return token != null && (token.type !== 'Punctuator' || token.value !== ')');
}

/**
 * Check whether the given token is a left brace.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `true` if the token is a left brace.
 */
function isLeftBrace(token?: Token | null): boolean {
    return token != null && token.type === 'Punctuator' && token.value === '{';
}

/**
 * Check whether the given token is a right brace.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `true` if the token is a right brace.
 */
function isRightBrace(token?: Token | null): boolean {
    return token != null && token.type === 'Punctuator' && token.value === '}';
}

/**
 * Check whether the given token is a left bracket.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `true` if the token is a left bracket.
 */
function isLeftBracket(token?: Token | null): boolean {
    return token != null && token.type === 'Punctuator' && token.value === '[';
}

/**
 * Check whether the given token is a right bracket.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `true` if the token is a right bracket.
 */
function isRightBracket(token?: Token | null): boolean {
    return token != null && token.type === 'Punctuator' && token.value === ']';
}

/**
 * Check whether the given token is a semicolon.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `true` if the token is a semicolon.
 */
function isSemicolon(token?: Token | null): boolean {
    return token != null && token.type === 'Punctuator' && token.value === ';';
}

/**
 * Check whether the given token is a comma.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `true` if the token is a comma.
 */
function isComma(token?: Token | null): boolean {
    return token != null && token.type === 'Punctuator' && token.value === ',';
}

/**
 * Check whether the given token is a wildcard.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a wildcard.
 */
function isWildcard(token: Token): boolean {
    return token != null && token.type === 'Punctuator' && token.value === '*';
}

/**
 * Check whether the given token is a whitespace.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `true` if the token is a whitespace.
 */
function isNotWhitespace(token?: Token | null): boolean {
    return token != null && token.type !== 'HTMLWhitespace';
}

/**
 * Check whether the given token is a comment.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `true` if the token is a comment.
 */
function isComment(token?: Token | null): boolean {
    return (
        token != null
        && (token.type === 'Block'
        || token.type === 'Line'
        || token.type === 'Shebang'
        || (typeof token.type
          === 'string'
        // Although acorn supports new tokens, espree may not yet support new tokens.
        && token.type.endsWith('Comment')))
    );
}

/**
 * Check whether the given token is a comment.
 * @param {Token|undefined|null} token The token to check.
 * @returns {boolean} `false` if the token is a comment.
 */
function isNotComment(token?: Token | null): boolean {
    return (
        token != null
        && token.type !== 'Block'
        && token.type !== 'Line'
        && token.type !== 'Shebang'
        && !(
            typeof token.type
        === 'string'
      // Although acorn supports new tokens, espree may not yet support new tokens.
      && token.type.endsWith('Comment'))
    );
}

/**
 * Check whether the given node is not an empty text node.
 * @param {XNode} node The node to check.
 * @returns {boolean} `false` if the token is empty text node.
 */
function isNotEmptyTextNode(node: XNode): boolean {
    return !(node.type === 'XText' && node.value.trim() === '');
}

/**
 * Get the last element.
 * @template T
 * @param {T[]} xs The array to get the last element.
 * @returns {T | undefined} The last element or undefined.
 */
function last<T>(xs: T[]): T | undefined {
    return xs.length === 0 ? void 0 : xs[xs.length - 1];
}

/**
 * Check whether the node is at the beginning of line.
 * @param {XNode|null} node The node to check.
 * @param {number} index The index of the node in the nodes.
 * @param {(XNode|null)[]} nodes The array of nodes.
 * @returns {boolean} `true` if the node is at the beginning of line.
 */
function isBeginningOfLine(node: XNode | null, index: number, nodes: (XNode | null)[]): boolean {
    if (node != null) {
        for (let i = index - 1; i >= 0; --i) {
            const prevNode = nodes[i];
            if (prevNode == null) {
                continue;
            }

            return node.loc.start.line !== prevNode.loc.end.line;
        }
    }
    return false;
}

/**
 * Check whether a given token is a closing token which triggers unindent.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a closing token.
 */
function isClosingToken(token: Token): boolean {
    return (
        token != null
    && (token.type === 'HTMLEndTagOpen'
      || token.type === 'VExpressionEnd'
      || (token.type === 'Punctuator'
        && (token.value === ')' || token.value === '}' || token.value === ']')))
    );
}

/**
 * Creates AST event handlers for html-indent.
 *
 * @param {RuleContext} context The rule context.
 * @param {ParserServices.XTokenStore | SourceCode} tokenStore The token store object to get tokens.
 * @param {Partial<IndentOptions>} defaultOptions The default value of options.
 * @returns {NodeListener} AST event handlers.
 */
export const defineVisitor = function create(
    context: RuleContext,
    tokenStore: ParserServices.XTokenStore | SourceCode,
    defaultOptions: Partial<IndentOptions>
): NodeListener {
    if (!context.getFilename().match(/\.(?:wxml|axml|swan)$/)) {
        return {};
    }
    // TODO: fix for wxml
    const options = parseOptions(
        context.options[0],
        context.options[1] || {},
        defaultOptions
    );
    const sourceCode = context.getSourceCode();
    const offsets = new Map();
    const ignoreTokens = new Set();

    /**
   * Set offset to the given tokens.
   * @param {Token|Token[]|null|(Token|null)[]} token The token to set.
   * @param {number} offset The offset of the tokens.
   * @param {Token} baseToken The token of the base offset.
   * @returns {void}
   */
    function setOffset(token: Token | Token[] | null | (Token | null)[], offset: number, baseToken: Token): void {
        if (!token) {
            return;
        }
        if (Array.isArray(token)) {
            for (const t of token) {
                offsets.set(t, {
                    baseToken,
                    offset,
                    baseline: false,
                    expectedIndent: void 0
                });
            }
        }
        else {
            offsets.set(token, {
                baseToken,
                offset,
                baseline: false,
                expectedIndent: void 0
            });
        }
    }

    /**
     * Set baseline flag to the given token.
     * @param {Token} token The token to set.
     * @returns {void}
     */
    function setBaseline(token: Token): void {
        const offsetInfo = offsets.get(token);
        if (offsetInfo != null) {
            offsetInfo.baseline = true;
        }
    }

    /**
     * Sets preformatted tokens to the given element node.
     * @param {XElement} node The node to set.
     * @returns {void}
     */
    function setPreformattedTokens(node: XElement): void {
        const endToken
      // @ts-expect-error
      = (node.endTag && tokenStore.getFirstToken(node.endTag))
      // @ts-expect-error
      || tokenStore.getTokenAfter(node);

        const option = {
            includeComments: true,
            filter: token => token != null && (token.type === 'HTMLText'
                || token.type === 'HTMLRCDataText'
                || token.type === 'HTMLTagOpen'
                || token.type === 'HTMLEndTagOpen'
                || token.type === 'HTMLComment')
        };
        for (const token of tokenStore.getTokensBetween(
            // @ts-expect-error
            node.startTag,
            endToken,
            option
        )) {
            ignoreTokens.add(token);
        }
        ignoreTokens.add(endToken);
    }

    /**
     * Get the first and last tokens of the given node.
     * If the node is parenthesized, this gets the outermost parentheses.
     * @param {XNode} node The node to get.
     * @param {number} [borderOffset] The least offset of the first token. Default is 0. This value is used to prevent false positive in the following case: `(a) => {}` The parentheses are enclosing the whole parameter part rather than the first parameter, but this offset parameter is needed to distinguish.
     * @returns {{firstToken:Token,lastToken:Token}} The gotten tokens.
     */
    function getFirstAndLastTokens(node: XNode, borderOffset = 0): { firstToken: Token; lastToken: Token } {
        borderOffset |= 0;

        // @ts-expect-error
        let firstToken = tokenStore.getFirstToken(node);
        // @ts-expect-error
        let lastToken = tokenStore.getLastToken(node);

        // Get the outermost left parenthesis if it's parenthesized.
        let t;
        let u;
        while (
            // @ts-expect-error
            (t = tokenStore.getTokenBefore(firstToken)) != null
            // @ts-expect-error
            && (u = tokenStore.getTokenAfter(lastToken)) != null
            && isLeftParen(t)
            && isRightParen(u)
            && t.range[0] >= borderOffset
        ) {
            firstToken = t;
            lastToken = u;
        }

        // @ts-expect-error
        return { firstToken, lastToken };
    }

    /**
     * Process the given node list.
     * The first node is offsetted from the given left token.
     * Rest nodes are adjusted to the first node.
     * @param {(XNode|null)[]} nodeList The node to process.
     * @param {XNode|Token|null} left The left parenthesis token.
     * @param {XNode|Token|null} right The right parenthesis token.
     * @param {number} offset The offset to set.
     * @param {boolean} [alignVertically=true] The flag to align vertically. If `false`, this doesn't align vertically even if the first node is not at beginning of line.
     * @returns {void}
     */
    function processNodeList(
        nodeList: (XNode | null)[],
        left: XNode | Token | null,
        right: XNode | Token | null,
        offset: number,
        alignVertically = true
    ): void {
        let t;
        // @ts-expect-error
        const leftToken = left && tokenStore.getFirstToken(left);
        // @ts-expect-error
        const rightToken = right && tokenStore.getFirstToken(right);

        if (nodeList.length >= 1) {
            let baseToken: Token | null = null;
            let lastToken = left;
            const alignTokensBeforeBaseToken = [] as Token[];
            const alignTokens = [] as Token[];

            for (const node of nodeList) {
                if (node == null) {
                    // Holes of an array.
                    continue;
                }
                const elementTokens = getFirstAndLastTokens(
                    node,
                    lastToken ? 0 : lastToken!.range[1]
                );

                // Collect comma/comment tokens between the last token of the previous node and the first token of this node.
                if (lastToken != null) {
                    t = lastToken;
                    while (
                        // @ts-expect-error
                        (t = tokenStore.getTokenAfter(t, ITERATION_OPTS)) != null
                        && t.range[1] <= elementTokens.firstToken.range[0]
                    ) {
                        if (baseToken == null) {
                            alignTokensBeforeBaseToken.push(t);
                        }
                        else {
                            alignTokens.push(t);
                        }
                    }
                }

                if (baseToken == null) {
                    baseToken = elementTokens.firstToken;
                }
                else {
                    alignTokens.push(elementTokens.firstToken);
                }

                // Save the last token to find tokens between this node and the next node.
                // eslint-disable-next-line prefer-destructuring
                lastToken = elementTokens.lastToken;
            }

            // Check trailing commas and comments.
            if (rightToken != null && lastToken != null) {
                t = lastToken;
                while (
                    // @ts-expect-error
                    (t = tokenStore.getTokenAfter(t, ITERATION_OPTS)) != null && t.range[1] <= rightToken.range[0]
                ) {
                    if (baseToken == null) {
                        alignTokensBeforeBaseToken.push(t);
                    }
                    else {
                        alignTokens.push(t);
                    }
                }
            }

            // Set offsets.
            if (leftToken != null) {
                setOffset(alignTokensBeforeBaseToken, offset, leftToken);
            }
            if (baseToken != null) {
                // Set offset to the first token.
                if (leftToken != null) {
                    setOffset(baseToken, offset, leftToken);
                }

                // Set baseline.
                if (nodeList.some(isBeginningOfLine)) {
                    setBaseline(baseToken);
                }

                if (!alignVertically && leftToken != null) {
                    // Align tokens relatively to the left token.
                    setOffset(alignTokens, offset, leftToken);
                }
                else {
                    // Align the rest tokens to the first token.
                    setOffset(alignTokens, 0, baseToken);
                }
            }
        }

        if (rightToken != null && leftToken != null) {
            setOffset(rightToken, 0, leftToken);
        }
    }

    /**
     * Process the given node as body.
     * The body node maybe a block statement or an expression node.
     * @param {XNode} node The body node to process.
     * @param {Token} baseToken The base token.
     * @returns {void}
     */
    function processMaybeBlock(node: XNode, baseToken: Token): void {
        const { firstToken } = getFirstAndLastTokens(node);
        setOffset(firstToken, isLeftBrace(firstToken) ? 0 : 1, baseToken);
    }

    /**
     * Collect prefix tokens of the given property.
     * The prefix includes `async`, `get`, `set`, `static`, and `*`.
     * @param {Property|MethodDefinition} node The property node to collect prefix tokens.
     */
    function getPrefixTokens(node: Property | MethodDefinition) {
        const prefixes: Token[] = [];

        // @ts-expect-error
        let token: Token | null = tokenStore.getFirstToken(node);
        // @ts-expect-error
        while (token != null && token.range[1] <= node.key.range[0]) {
            prefixes.push(token);
            // @ts-expect-error
            token = tokenStore.getTokenAfter(token);
        }
        while (isLeftParen(last(prefixes)) || isLeftBracket(last(prefixes))) {
            prefixes.pop();
        }

        return prefixes;
    }

    /**
     * Find the head of chaining nodes.
     * @param {XNode} node The start node to find the head.
     * @returns {Token} The head token of the chain.
     */
    function getChainHeadToken(node: XNode): Token {
        const { type } = node;
        while (node.parent && node.parent.type === type) {
            // @ts-expect-error
            const prevToken = tokenStore.getTokenBefore(node);
            if (isLeftParen(prevToken)) {
                // The chaining is broken by parentheses.
                break;
            }
            node = node.parent;
        }
        // @ts-expect-error
        return tokenStore.getFirstToken(node);
    }

    /**
     * Check whether a given token is the first token of:
     *
     * - ExpressionStatement
     * - XExpressionContainer
     * - A parameter of CallExpression/NewExpression
     * - An element of ArrayExpression
     * - An expression of SequenceExpression
     *
     * @param {Token} token The token to check.
     * @param {XNode} belongingNode The node that the token is belonging to.
     * @returns {boolean} `true` if the token is the first token of an element.
     */
    function isBeginningOfElement(token: Token, belongingNode: XNode): boolean {
        let node = belongingNode;

        while (node?.parent != null) {
            const { parent } = node;
            if (parent.type.endsWith('Statement') || parent.type.endsWith('Declaration')) {
                return parent.range[0] === token.range[0];
            }

            if (parent.type === 'XExpressionContainer') {
                if (node.range[0] !== token.range[0]) {
                    return false;
                }

                // @ts-expect-error
                const prevToken = tokenStore.getTokenBefore(belongingNode);
                if (isLeftParen(prevToken)) {
                    // It is not the first token because it is enclosed in parentheses.
                    return false;
                }
                return true;
            }

            if (parent.type === 'CallExpression' || parent.type === 'NewExpression') {
                const openParen = tokenStore.getTokenAfter(
                    parent.callee,
                    isNotRightParen
                );
                return parent.arguments.some(
                    param =>
                        getFirstAndLastTokens(param, openParen!.range[1]).firstToken
                            .range[0] === token.range[0]
                );
            }

            if (parent.type === 'ArrayExpression') {
                return parent.elements.some(
                    element =>
                        element != null
                        && getFirstAndLastTokens(element).firstToken.range[0]
                        === token.range[0]
                );
            }

            if (parent.type === 'SequenceExpression') {
                return parent.expressions.some(
                    expr => getFirstAndLastTokens(expr).firstToken.range[0] === token.range[0]
                );
            }

            node = parent;
        }

        return false;
    }

    /**
     * Set the base indentation to a given top-level AST node.
     * @param {Node} node The node to set.
     * @param {number} expectedIndent The number of expected indent.
     * @returns {void}
     */
    function processTopLevelNode(node: Node, expectedIndent: number): void {
        // @ts-expect-error
        const token = tokenStore.getFirstToken(node);
        const offsetInfo = offsets.get(token);
        if (offsetInfo) {
            offsetInfo.expectedIndent = expectedIndent;
        }
        else {
            offsets.set(token, {
                baseToken: null,
                offset: 0,
                baseline: false,
                expectedIndent
            });
        }
    }

    /**
     * Ignore all tokens of the given node.
     * @param {XNode} node The node to ignore.
     * @returns {void}
     */
    function ignore(node: XNode): void {
        // @ts-expect-error
        for (const token of tokenStore.getTokens(node)) {
            offsets.delete(token);
            ignoreTokens.add(token);
        }
    }

    /**
     * Define functions to ignore nodes into the given visitor.
     * @param {NodeListener} visitor The visitor to define functions to ignore nodes.
     * @returns {NodeListener} The visitor.
     */
    function processIgnores(visitor: NodeListener): NodeListener {
        for (const ignorePattern of options.ignores) {
            const key = `${ ignorePattern }:exit`;

            if (Object.prototype.hasOwnProperty.call(visitor, key)) {
                const handler = visitor[key];
                visitor[key] = function f(node, ...args) {
                    const ret = handler.call(this, node, ...args);
                    ignore(node);
                    return ret;
                };
            }
            else {
                visitor[key] = ignore;
            }
        }

        return visitor;
    }

    /**
     * Calculate correct indentation of the line of the given tokens.
     * @param {Token[]} tokens Tokens which are on the same line.
     * @returns { { expectedIndent: number, expectedBaseIndent: number } |null } Correct indentation. If it failed to calculate then `null`.
     */
    function getExpectedIndents(tokens: Token[]): { expectedIndent: number; expectedBaseIndent: number } | null {
        const expectedIndents = [] as number[];

        for (let i = 0; i < tokens.length; ++i) {
            const token = tokens[i];
            const offsetInfo = offsets.get(token);

            if (offsetInfo != null) {
                if (typeof offsetInfo.expectedIndent === 'number') {
                    expectedIndents.push(offsetInfo.expectedIndent);
                }
                else {
                    const baseOffsetInfo = offsets.get(offsetInfo.baseToken);
                    if (baseOffsetInfo?.expectedIndent != null
                        && (i === 0 || !baseOffsetInfo.baseline)) {
                        expectedIndents.push(baseOffsetInfo.expectedIndent + offsetInfo.offset * options.indentSize);
                        if (baseOffsetInfo.baseline) {
                            break;
                        }
                    }
                }
            }
        }
        if (!expectedIndents.length) {
            return null;
        }

        return {
            expectedIndent: expectedIndents[0],
            expectedBaseIndent: expectedIndents.reduce((a, b) => Math.min(a, b))
        };
    }

    /**
     * Get the text of the indentation part of the line which the given token is on.
     * @param {Token} firstToken The first token on a line.
     * @returns {string} The text of indentation part.
     */
    function getIndentText(firstToken: Token): string {
        const { text } = sourceCode;
        let i = firstToken.range[0] - 1;

        while (i >= 0 && !LT_CHAR.test(text[i])) {
            i -= 1;
        }

        return text.slice(i + 1, firstToken.range[0]);
    }

    /**
     * Define the function which fixes the problem.
     * @param {Token} token The token to fix.
     * @param {number} actualIndent The number of actual indentation.
     * @param {number} expectedIndent The number of expected indentation.
     * @returns { (fixer: RuleFixer) => Fix } The defined function.
     */
    function defineFix(token: Token, actualIndent: number, expectedIndent: number): (fixer: RuleFixer) => Fix {
        if (token.type === 'Block' && token.loc.start.line !== token.loc.end.line) {
            // Fix indentation in multiline block comments.
            // @ts-expect-error
            const lines = sourceCode.getText(token).match(LINES) || [];
            const firstLine = lines.shift();
            if (lines.every(l => BLOCK_COMMENT_PREFIX.test(l))) {
                return fixer => {

                    /** @type {Range} */
                    const range: Range = [token.range[0] - actualIndent, token.range[1]];
                    const indent = options.indentChar.repeat(expectedIndent);

                    return fixer.replaceTextRange(
                        range,
                        `${ indent }${ firstLine }${ lines
                            .map(l => l.replace(BLOCK_COMMENT_PREFIX, `${ indent } *`))
                            .join('') }`
                    );
                };
            }
        }

        return fixer => {
            const range: Range = [token.range[0] - actualIndent, token.range[0]];
            const indent = options.indentChar.repeat(expectedIndent);
            return fixer.replaceTextRange(range, indent);
        };
    }

    /**
     * Validate the given token with the pre-calculated expected indentation.
     * @param {Token} token The token to validate.
     * @param {number} expectedIndent The expected indentation.
     * @param {number[]} [optionalExpectedIndents] The optional expected indentation.
     * @returns {void}
     */
    function validateCore(token: Token, expectedIndent: number, optionalExpectedIndents?: number[]): void {
        const { line } = token.loc.start;
        const indentText = getIndentText(token);

        // If there is no line terminator after the `<script>` start tag,
        // `indentText` contains non-whitespace characters.
        // In that case, do nothing in order to prevent removing the `<script>` tag.
        if (indentText.trim() !== '') {
            return;
        }

        const actualIndent = token.loc.start.column;
        const unit = options.indentChar === '\t' ? 'tab' : 'space';

        for (let i = 0; i < indentText.length; ++i) {
            if (indentText[i] !== options.indentChar) {
                context.report({
                    loc: {
                        start: { line, column: i },
                        end: { line, column: i + 1 }
                    },
                    message: 'Expected {{expected}} character, but found {{actual}} character.',
                    data: {
                        expected: options.indentChar,
                        actual: indentText[i]
                    },
                    fix: defineFix(token, actualIndent, expectedIndent)
                });
                return;
            }
        }

        if (actualIndent !== expectedIndent
            && (optionalExpectedIndents == null || !optionalExpectedIndents.includes(actualIndent))
        ) {
            context.report({
                loc: {
                    start: { line, column: 0 },
                    end: { line, column: actualIndent }
                },
                message: 'Expected indentation of {{expectedIndent}} {{unit}}{{expectedIndentPlural}}'
                    + ' but found {{actualIndent}} {{unit}}{{actualIndentPlural}}.',
                data: {
                    // @ts-expect-error
                    expectedIndent,
                    // @ts-expect-error
                    actualIndent,
                    unit,
                    expectedIndentPlural: expectedIndent === 1 ? '' : 's',
                    actualIndentPlural: actualIndent === 1 ? '' : 's'
                },
                fix: defineFix(token, actualIndent, expectedIndent)
            });
        }
    }

    /**
     * Get the expected indent of comments.
     * @param {Token} nextToken The next token of comments.
     * @param {number} nextExpectedIndent The expected indent of the next token.
     * @param {number} lastExpectedIndent The expected indent of the last token.
     * @returns {number[]}
     */
    function getCommentExpectedIndents(
        nextToken: Token,
        nextExpectedIndent: number,
        lastExpectedIndent: number
    ): number[] {
        if (typeof lastExpectedIndent === 'number' && isClosingToken(nextToken)) {
            if (nextExpectedIndent === lastExpectedIndent) {
                // For solo comment. E.g.,
                // <div>
                //    <!-- comment -->
                // </div>
                return [nextExpectedIndent + options.indentSize, nextExpectedIndent];
            }

            // For last comment. E.g.,
            // <div>
            //    <div></div>
            //    <!-- comment -->
            // </div>
            return [lastExpectedIndent, nextExpectedIndent];
        }

        // Adjust to next normally. E.g.,
        // <div>
        //    <!-- comment -->
        //    <div></div>
        // </div>
        return [nextExpectedIndent];
    }

    /**
     * Validate indentation of the line that the given tokens are on.
     * @param {Token[]} tokens The tokens on the same line to validate.
     * @param {Token[]} comments The comments which are on the immediately previous lines of the tokens.
     * @param {Token|null} lastToken The last validated token. Comments can adjust to the token.
     * @returns {void}
     */
    function validate(tokens: Token[], comments: Token[], lastToken: Token | null): void {
        // Calculate and save expected indentation.
        const firstToken = tokens[0];
        const actualIndent = firstToken.loc.start.column;
        const expectedIndents = getExpectedIndents(tokens);
        if (!expectedIndents) {
            return;
        }

        const { expectedBaseIndent, expectedIndent } = expectedIndents;

        // Save.
        const baseline = new Set();
        for (const token of tokens) {
            const offsetInfo = offsets.get(token);
            if (offsetInfo != null) {
                if (offsetInfo.baseline) {
                    // This is a baseline token, so the expected indent is the column of this token.
                    if (options.indentChar === ' ') {
                        offsetInfo.expectedIndent = Math.max(
                            0,
                            token.loc.start.column + expectedBaseIndent - actualIndent
                        );
                    }
                    else {
                        // In hard-tabs mode, it cannot align tokens strictly, so use one additional offset.
                        // But the additional offset isn't needed if it's at the beginning of the line.
                        offsetInfo.expectedIndent = expectedBaseIndent + (token === tokens[0] ? 0 : 1);
                    }
                    baseline.add(token);
                }
                else if (baseline.has(offsetInfo.baseToken)) {
                    // The base token is a baseline token on this line, so inherit it.
                    offsetInfo.expectedIndent = offsets.get(
                        offsetInfo.baseToken
                    ).expectedIndent;
                    baseline.add(token);
                }
                else {
                    // Otherwise, set the expected indent of this line.
                    offsetInfo.expectedIndent = expectedBaseIndent;
                }
            }
        }

        // It does not validate ignore tokens.
        if (ignoreTokens.has(firstToken)) {
            return;
        }

        // Calculate the expected indents for comments.
        // It allows the same indent level with the previous line.
        const lastOffsetInfo = offsets.get(lastToken);
        const lastExpectedIndent = lastOffsetInfo?.expectedIndent;
        const commentOptionalExpectedIndents = getCommentExpectedIndents(
            firstToken,
            expectedIndent,
            lastExpectedIndent
        );

        // Validate.
        for (const comment of comments) {
            const commentExpectedIndents = getExpectedIndents([comment]);
            const commentExpectedIndent = commentExpectedIndents
                ? commentExpectedIndents.expectedIndent
                : commentOptionalExpectedIndents[0];

            validateCore(
                comment,
                commentExpectedIndent,
                commentOptionalExpectedIndents
            );
        }
        validateCore(firstToken, expectedIndent);
    }

    // ------------------------------------------------------------------------------
    // Main
    // ------------------------------------------------------------------------------

    return processIgnores({


        // @ts-expect-error
        XAttribute(node: XAttribute) {
            // @ts-expect-error
            const keyToken = tokenStore.getFirstToken(node);
            // @ts-expect-error
            const eqToken = tokenStore.getTokenAfter(node.key);

            if (eqToken != null && eqToken.range[1] <= node.range[1]) {
                // @ts-expect-error
                setOffset(eqToken, 1, keyToken);

                // @ts-expect-error
                const valueToken = tokenStore.getTokenAfter(eqToken);
                if (valueToken != null && valueToken.range[1] <= node.range[1]) {
                    // @ts-expect-error
                    setOffset(valueToken, 1, keyToken);
                }
            }
        },

        XElement(node: XElement) {
            if (PREFORMATTED_ELEMENT_NAMES.includes(node.name)) {
                // @ts-expect-error
                const startTagToken = tokenStore.getFirstToken(node);
                // @ts-expect-error
                const endTagToken = node.endTag && tokenStore.getFirstToken(node.endTag);
                // @ts-expect-error
                setOffset(endTagToken, 0, startTagToken);
                setPreformattedTokens(node);
            }
            else {
                const isTopLevel = node.parent.type !== 'XElement';
                const offset = isTopLevel ? options.baseIndent : 1;
                processNodeList(
                    node.children.filter(isNotEmptyTextNode),
                    node.startTag,
                    node.endTag,
                    offset,
                    false
                );
            }
        },

        XEndTag(node: XEndTag) {
            const element = node.parent;
            // @ts-expect-error
            const startTagOpenToken = tokenStore.getFirstToken(element.startTag);
            // @ts-expect-error
            const closeToken = tokenStore.getLastToken(node);

            // @ts-expect-error
            if (closeToken.type.endsWith('TagClose')) {
                // @ts-expect-error
                setOffset(closeToken, options.closeBracket.endTag, startTagOpenToken);
            }
        },

        XExpressionContainer(node: XExpressionContainer) {
            // TODO: Fix for expression range
            if (node.expression != null && node.range[0] !== node.expression.range[0]) {
                // @ts-expect-error
                const startQuoteToken = tokenStore.getFirstToken(node);
                // @ts-expect-error
                const endQuoteToken = tokenStore.getLastToken(node);
                // @ts-expect-error
                const childToken = tokenStore.getTokenAfter(startQuoteToken);

                // @ts-expect-error
                setOffset(childToken, 1, startQuoteToken);
                // @ts-expect-error
                setOffset(endQuoteToken, 0, startQuoteToken);
            }
        },

        XModuleContainer(node: XModuleContainer) {
            const baseIndent = options.indentSize * (options.scriptBaseIndent || 0);
            // TODO: Fix for module range
            if (node.body != null) {
                for (const childNode of node.body) {
                    // @ts-expect-error
                    processTopLevelNode(childNode, baseIndent);
                }
            }
        },

        XStartTag(node: XStartTag) {
            // @ts-expect-error
            const openToken = tokenStore.getFirstToken(node);
            // @ts-expect-error
            const closeToken = tokenStore.getLastToken(node);

            processNodeList(
                node.attributes,
                openToken,
                null,
                options.attribute,
                options.alignAttributesVertically
            );
            if (closeToken?.type.endsWith('TagClose')) {
                const offset = closeToken.type === 'HTMLSelfClosingTagClose'
                    ? options.closeBracket.selfClosingTag
                    : options.closeBracket.startTag;
                setOffset(closeToken, offset, openToken!);
            }
        },

        XText(node: XText) {
            // @ts-expect-error
            const tokens = tokenStore.getTokens(node, isNotWhitespace);
            // @ts-expect-error
            const firstTokenInfo = offsets.get(tokenStore.getFirstToken(node));

            for (const token of tokens) {
                offsets.set(token, { ...firstTokenInfo });
            }
        },

        'ArrayExpression, ArrayPattern'(node: ArrayExpression | ArrayPattern) {
            processNodeList(
                // @ts-expect-error
                node.elements, tokenStore.getFirstToken(node), tokenStore.getLastToken(node), 1
            );
        },

        ArrowFunctionExpression(node: ArrowFunctionExpression & NodeParentExtension) {
            // @ts-expect-error
            const firstToken = tokenStore.getFirstToken(node);
            // @ts-expect-error
            const secondToken = tokenStore.getTokenAfter(firstToken);
            const leftToken = node.async ? secondToken : firstToken;
            // @ts-expect-error
            const arrowToken = tokenStore.getTokenBefore(node.body, isArrow);

            if (node.async) {
                // @ts-expect-error
                setOffset(secondToken, 1, firstToken);
            }
            if (isLeftParen(leftToken)) {
                const rightToken = tokenStore.getTokenAfter(
                    // @ts-expect-error
                    last(node.params) || leftToken,
                    isRightParen
                );
                // @ts-expect-error
                processNodeList(node.params, leftToken, rightToken, 1);
            }

            // @ts-expect-error
            setOffset(arrowToken, 1, firstToken);
            // @ts-expect-error
            processMaybeBlock(node.body, firstToken);
        },

        'AssignmentExpression, AssignmentPattern, BinaryExpression, LogicalExpression'(
            node: AssignmentExpression | AssignmentPattern | BinaryExpression | LogicalExpression
        ) {
            // @ts-expect-error
            const leftToken = getChainHeadToken(node);
            const opToken = tokenStore.getTokenAfter(
                // @ts-expect-error
                node.left,
                isNotRightParen
            )!;
            // @ts-expect-error
            const rightToken = tokenStore.getTokenAfter(opToken);
            // @ts-expect-error
            const prevToken = tokenStore.getTokenBefore(leftToken);
            const shouldIndent = prevToken == null || prevToken.loc.end.line === leftToken.loc.start.line
                // @ts-expect-error
                || isBeginningOfElement(leftToken, node);

            setOffset([opToken, rightToken], shouldIndent ? 1 : 0, leftToken);
        },

        'AwaitExpression, RestElement, SpreadElement, UnaryExpression'(
            node: AwaitExpression | RestElement | SpreadElement | UnaryExpression
        ) {
            // @ts-expect-error
            const firstToken = tokenStore.getFirstToken(node);
            // @ts-expect-error
            const nextToken = tokenStore.getTokenAfter(firstToken);

            // @ts-expect-error
            setOffset(nextToken, 1, firstToken);
        },

        'BlockStatement, ClassBody'(node: BlockStatement | ClassBody) {
            processNodeList(
                // @ts-expect-error
                node.body,
                tokenStore.getFirstToken(node),
                tokenStore.getLastToken(node),
                1
            );
        },

        'BreakStatement, ContinueStatement, ReturnStatement, ThrowStatement'(
            node: BreakStatement | ContinueStatement | ReturnStatement | ThrowStatement
        ) {
            if (
                ((node.type === 'ReturnStatement' || node.type === 'ThrowStatement') && node.argument != null)
                || ((node.type === 'BreakStatement' || node.type === 'ContinueStatement')
                && node.label != null)
            ) {
                const firstToken = tokenStore.getFirstToken(node);
                // @ts-expect-error
                const nextToken = tokenStore.getTokenAfter(firstToken);

                // @ts-expect-error
                setOffset(nextToken, 1, firstToken);
            }
        },

        CallExpression(node: CallExpression) {
            const firstToken = tokenStore.getFirstToken(node);
            const rightToken = tokenStore.getLastToken(node);
            // @ts-expect-error
            const leftToken = tokenStore.getTokenAfter(node.callee, isLeftParen);

            // @ts-expect-error
            setOffset(leftToken, 1, firstToken);
            // @ts-expect-error
            processNodeList(node.arguments, leftToken, rightToken, 1);
        },

        ImportExpression(node: ImportExpression) {
            const firstToken = tokenStore.getFirstToken(node);
            const rightToken = tokenStore.getLastToken(node);
            // @ts-expect-error
            const leftToken = tokenStore.getTokenAfter(firstToken, isLeftParen);

            // @ts-expect-error
            setOffset(leftToken, 1, firstToken);
            // @ts-expect-error
            processNodeList([node.source], leftToken, rightToken, 1);
        },

        CatchClause(node: CatchClause) {
            const firstToken = tokenStore.getFirstToken(node);
            const bodyToken = tokenStore.getFirstToken(node.body);

            if (node.param != null) {
                // @ts-expect-error
                const leftToken = tokenStore.getTokenAfter(firstToken);
                const rightToken = tokenStore.getTokenAfter(node.param);

                // @ts-expect-error
                setOffset(leftToken, 1, firstToken);
                // @ts-expect-error
                processNodeList([node.param], leftToken, rightToken, 1);
            }
            // @ts-expect-error
            setOffset(bodyToken, 0, firstToken);
        },


        'ClassDeclaration, ClassExpression'(node: ClassDeclaration | ClassExpression) {
            const firstToken = tokenStore.getFirstToken(node);
            const bodyToken = tokenStore.getFirstToken(node.body);

            if (node.id != null) {
                // @ts-expect-error
                setOffset(tokenStore.getFirstToken(node.id), 1, firstToken);
            }
            if (node.superClass != null) {
                // @ts-expect-error
                const extendsToken = tokenStore.getTokenAfter(node.id || firstToken);
                // @ts-expect-error
                const superClassToken = tokenStore.getTokenAfter(extendsToken);
                // @ts-expect-error
                setOffset(extendsToken, 1, firstToken);
                // @ts-expect-error
                setOffset(superClassToken, 1, extendsToken);
            }
            // @ts-expect-error
            setOffset(bodyToken, 0, firstToken);
        },


        ConditionalExpression(node: ConditionalExpression) {
            const prevToken = tokenStore.getTokenBefore(node)!;
            const firstToken = tokenStore.getFirstToken(node)!;
            const questionToken = tokenStore.getTokenAfter(
                // @ts-expect-error
                node.test,
                isNotRightParen
            )!;
            // @ts-expect-error
            const consequentToken = tokenStore.getTokenAfter(questionToken);
            const colonToken = tokenStore.getTokenAfter(
                // @ts-expect-error
                node.consequent,
                isNotRightParen
            )!;
            // @ts-expect-error
            const alternateToken = tokenStore.getTokenAfter(colonToken);
            const isFlat = prevToken
                // @ts-expect-error
                && prevToken.loc.end.line !== node.loc.start.line
                // @ts-expect-error
                && node.test.loc.end.line === node.consequent.loc.start.line;

            if (isFlat) {
                setOffset(
                    [questionToken, consequentToken, colonToken, alternateToken],
                    0,
                    firstToken
                );
            }
            else {
                setOffset([questionToken, colonToken], 1, firstToken);
                setOffset([consequentToken, alternateToken], 1, questionToken);
            }
        },


        DoWhileStatement(node: DoWhileStatement) {
            const doToken = tokenStore.getFirstToken(node);
            const whileToken = tokenStore.getTokenAfter(
                // @ts-expect-error
                node.body,
                isNotRightParen
            )!;
            // @ts-expect-error
            const leftToken = tokenStore.getTokenAfter(whileToken);
            // @ts-expect-error
            const testToken = tokenStore.getTokenAfter(leftToken);
            const lastToken = tokenStore.getLastToken(node);
            const rightToken = isSemicolon(lastToken)
                // @ts-expect-error
                ? tokenStore.getTokenBefore(lastToken)
                : lastToken;

            // @ts-expect-error
            processMaybeBlock(node.body, doToken);
            // @ts-expect-error
            setOffset(whileToken, 0, doToken);
            setOffset(leftToken, 1, whileToken);
            // @ts-expect-error
            setOffset(testToken, 1, leftToken);
            // @ts-expect-error
            setOffset(rightToken, 0, leftToken);
        },

        ExportAllDeclaration(node: ExportAllDeclaration) {
            const tokens = tokenStore.getTokens(node);
            const firstToken = tokens.shift()!;
            if (isSemicolon(last(tokens))) {
                tokens.pop();
            }
            if (node.exported) {
                // export * as foo from "mod"
                // @ts-expect-error
                const starToken = tokens.find(isWildcard) as Token;
                // @ts-expect-error
                const asToken = tokenStore.getTokenAfter(starToken);
                // @ts-expect-error
                const exportedToken = tokenStore.getTokenAfter(asToken);
                // @ts-expect-error
                const afterTokens = tokens.slice(tokens.indexOf(exportedToken) + 1);

                setOffset(starToken, 1, firstToken);
                setOffset(asToken, 1, starToken);
                setOffset(exportedToken, 1, starToken);
                setOffset(afterTokens, 1, firstToken);
            }
            else {
                setOffset(tokens, 1, firstToken);
            }
        },

        ExportDefaultDeclaration(node: ExportDefaultDeclaration) {
            const exportToken = tokenStore.getFirstToken(node);
            const defaultToken = tokenStore.getFirstToken(node, 1);
            // @ts-expect-error
            const declarationToken = getFirstAndLastTokens(node.declaration)
                .firstToken;
            // @ts-expect-error
            setOffset([defaultToken, declarationToken], 1, exportToken);
        },

        ExportNamedDeclaration(node: ExportNamedDeclaration) {
            const exportToken = tokenStore.getFirstToken(node);
            if (node.declaration) {
                // export var foo = 1;
                const declarationToken = tokenStore.getFirstToken(node, 1);
                // @ts-expect-error
                setOffset(declarationToken, 1, exportToken);
            }
            else {
                const firstSpecifier = node.specifiers[0];
                if (!firstSpecifier || firstSpecifier.type === 'ExportSpecifier') {
                    // export {foo, bar}; or export {foo, bar} from "mod";
                    const leftParenToken = tokenStore.getFirstToken(node, 1);
                    const rightParenToken = tokenStore.getLastToken(
                        // @ts-expect-error
                        node,
                        isRightBrace
                    )!;
                    // @ts-expect-error
                    setOffset(leftParenToken, 0, exportToken);
                    // @ts-expect-error
                    processNodeList(node.specifiers, leftParenToken, rightParenToken, 1);

                    // @ts-expect-error
                    const maybeFromToken = tokenStore.getTokenAfter(rightParenToken);
                    if (
                        maybeFromToken != null
            // @ts-expect-error
            && sourceCode.getText(maybeFromToken) === 'from'
                    ) {
                        const fromToken = maybeFromToken;
                        const nameToken = tokenStore.getTokenAfter(fromToken);
                        // @ts-expect-error
                        setOffset([fromToken, nameToken], 1, exportToken);
                    }
                }
                else {
                    // maybe babel-eslint
                }
            }
        },

        ExportSpecifier(node: ExportSpecifier) {
            const tokens = tokenStore.getTokens(node);
            const firstToken = tokens.shift()!;
            setOffset(tokens, 1, firstToken);
        },


        'ForInStatement, ForOfStatement'(node: ForInStatement | ForOfStatement) {
            const forToken = tokenStore.getFirstToken(node);
            const awaitToken = (node.type === 'ForOfStatement'
                && node.await
                // @ts-expect-error
                && tokenStore.getTokenAfter(forToken))
                || null;
            // @ts-expect-error
            const leftParenToken = tokenStore.getTokenAfter(awaitToken || forToken);
            // @ts-expect-error
            const leftToken = tokenStore.getTokenAfter(leftParenToken);
            const inToken = tokenStore.getTokenAfter(
                // @ts-expect-error
                leftToken,
                isNotRightParen
            )!;
            // @ts-expect-error
            const rightToken = tokenStore.getTokenAfter(inToken);
            const rightParenToken = tokenStore.getTokenBefore(
                // @ts-expect-error
                node.body,
                isNotLeftParen
            );

            if (awaitToken != null) {
                // @ts-expect-error
                setOffset(awaitToken, 0, forToken);
            }
            // @ts-expect-error
            setOffset(leftParenToken, 1, forToken);
            // @ts-expect-error
            setOffset(leftToken, 1, leftParenToken);
            // @ts-expect-error
            setOffset(inToken, 1, leftToken);
            // @ts-expect-error
            setOffset(rightToken, 1, leftToken);
            // @ts-expect-error
            setOffset(rightParenToken, 0, leftParenToken);
            // @ts-expect-error
            processMaybeBlock(node.body, forToken);
        },


        ForStatement(node: ForStatement) {
            const forToken = tokenStore.getFirstToken(node);
            // @ts-expect-error
            const leftParenToken = tokenStore.getTokenAfter(forToken);
            const rightParenToken = tokenStore.getTokenBefore(
                // @ts-expect-error
                node.body,
                isNotLeftParen
            );

            // @ts-expect-error
            setOffset(leftParenToken, 1, forToken);
            processNodeList(
                // @ts-expect-error
                [node.init, node.test, node.update],
                leftParenToken,
                rightParenToken,
                1
            );
            // @ts-expect-error
            processMaybeBlock(node.body, forToken);
        },


        'FunctionDeclaration, FunctionExpression'(node: FunctionDeclaration | FunctionExpression) {
            const firstToken = tokenStore.getFirstToken(node);
            if (isLeftParen(firstToken)) {
                // Methods.
                const leftToken = firstToken;
                const rightToken = tokenStore.getTokenAfter(
                    // @ts-expect-error
                    last(node.params) || leftToken,
                    isRightParen
                );
                const bodyToken = tokenStore.getFirstToken(node.body);

                // @ts-expect-error
                processNodeList(node.params, leftToken, rightToken, 1);
                // @ts-expect-error
                setOffset(bodyToken, 0, tokenStore.getFirstToken(node.parent));
            }
            else {
                // Normal functions.
                const functionToken = node.async
                    // @ts-expect-error
                    ? tokenStore.getTokenAfter(firstToken)
                    : firstToken;
                const starToken = node.generator
                    // @ts-expect-error
                    ? tokenStore.getTokenAfter(functionToken)
                    : null;
                const idToken = node.id && tokenStore.getFirstToken(node.id);
                const leftToken = tokenStore.getTokenAfter(
                    // @ts-expect-error
                    idToken || starToken || functionToken
                );
                const rightToken = tokenStore.getTokenAfter(
                    // @ts-expect-error
                    last(node.params) || leftToken,
                    isRightParen
                );
                const bodyToken = tokenStore.getFirstToken(node.body);

                if (node.async) {
                    // @ts-expect-error
                    setOffset(functionToken, 0, firstToken);
                }
                if (node.generator) {
                    // @ts-expect-error
                    setOffset(starToken, 1, firstToken);
                }
                if (node.id != null) {
                    // @ts-expect-error
                    setOffset(idToken, 1, firstToken);
                }
                // @ts-expect-error
                setOffset(leftToken, 1, firstToken);
                // @ts-expect-error
                processNodeList(node.params, leftToken, rightToken, 1);
                // @ts-expect-error
                setOffset(bodyToken, 0, firstToken);
            }
        },


        IfStatement(node: IfStatement) {
            const ifToken = tokenStore.getFirstToken(node);
            // @ts-expect-error
            const ifLeftParenToken = tokenStore.getTokenAfter(ifToken);
            const ifRightParenToken = tokenStore.getTokenBefore(
                // @ts-expect-error
                node.consequent,
                isRightParen
            );

            // @ts-expect-error
            setOffset(ifLeftParenToken, 1, ifToken);
            // @ts-expect-error
            setOffset(ifRightParenToken, 0, ifLeftParenToken);
            // @ts-expect-error
            processMaybeBlock(node.consequent, ifToken);

            if (node.alternate != null) {
                const elseToken = tokenStore.getTokenAfter(
                    // @ts-expect-error
                    node.consequent,
                    isNotRightParen
                )!;

                // @ts-expect-error
                setOffset(elseToken, 0, ifToken);
                // @ts-expect-error
                processMaybeBlock(node.alternate, elseToken);
            }
        },

        ImportDeclaration(node: ImportDeclaration) {
            const firstSpecifier = node.specifiers[0];
            const secondSpecifier = node.specifiers[1];
            const importToken = tokenStore.getFirstToken(node);
            // @ts-expect-error
            const hasSemi = tokenStore.getLastToken(node).value === ';';

            /** @type {Token[]} */
            // tokens to one indent
            const tokens: Token[] = [];

            if (!firstSpecifier) {
                // There are 2 patterns:
                //     import "foo"
                //     import {} from "foo"
                const secondToken = tokenStore.getFirstToken(node, 1);
                if (isLeftBrace(secondToken)) {
                    setOffset(
                        // @ts-expect-error
                        [secondToken, tokenStore.getTokenAfter(secondToken)],
                        0,
                        // @ts-expect-error
                        importToken
                    );
                    tokens.push(
                        // @ts-expect-error
                        // from
                        tokenStore.getLastToken(node, hasSemi ? 2 : 1),
                        // "foo"
                        tokenStore.getLastToken(node, hasSemi ? 1 : 0)
                    );
                }
                else {
                    // @ts-expect-error
                    tokens.push(tokenStore.getLastToken(node, hasSemi ? 1 : 0));
                }
            }
            else if (firstSpecifier.type === 'ImportDefaultSpecifier') {
                if (
                    secondSpecifier
          && secondSpecifier.type === 'ImportNamespaceSpecifier'
                ) {
                    // There is a pattern:
                    //     import Foo, * as foo from "foo"
                    tokens.push(
                        // Foo
                        // @ts-expect-error
                        tokenStore.getFirstToken(firstSpecifier),
                        // comma
                        tokenStore.getTokenAfter(firstSpecifier),
                        // *
                        tokenStore.getFirstToken(secondSpecifier),
                        // from
                        tokenStore.getLastToken(node, hasSemi ? 2 : 1),
                        // "foo"
                        tokenStore.getLastToken(node, hasSemi ? 1 : 0)
                    );
                }
                else {
                    // There are 3 patterns:
                    //     import Foo from "foo"
                    //     import Foo, {} from "foo"
                    //     import Foo, {a} from "foo"
                    const idToken = tokenStore.getFirstToken(firstSpecifier);
                    const nextToken = tokenStore.getTokenAfter(firstSpecifier);
                    if (isComma(nextToken)) {
                        // @ts-expect-error
                        const leftBrace = tokenStore.getTokenAfter(nextToken);
                        const rightBrace = tokenStore.getLastToken(node, hasSemi ? 3 : 2);
                        // @ts-expect-error
                        setOffset([idToken, nextToken], 1, importToken);
                        // @ts-expect-error
                        setOffset(leftBrace, 0, idToken);
                        // @ts-expect-error
                        processNodeList(node.specifiers.slice(1), leftBrace, rightBrace, 1);
                        tokens.push(
                            // from
                            // @ts-expect-error
                            tokenStore.getLastToken(node, hasSemi ? 2 : 1),
                            // "foo"
                            tokenStore.getLastToken(node, hasSemi ? 1 : 0)
                        );
                    }
                    else {
                        tokens.push(
                            // @ts-expect-error
                            idToken,
                            // from
                            nextToken,
                            // "foo"
                            // @ts-expect-error
                            tokenStore.getTokenAfter(nextToken)
                        );
                    }
                }
            }
            else if (firstSpecifier.type === 'ImportNamespaceSpecifier') {
                // There is a pattern:
                //     import * as foo from "foo"
                tokens.push(
                    // *
                    // @ts-expect-error
                    tokenStore.getFirstToken(firstSpecifier),
                    // from
                    // @ts-expect-error
                    tokenStore.getLastToken(node, hasSemi ? 2 : 1),
                    // "foo"
                    // @ts-expect-error
                    tokenStore.getLastToken(node, hasSemi ? 1 : 0)
                );
            }
            else {
                // There is a pattern:
                //     import {a} from "foo"
                const leftBrace = tokenStore.getFirstToken(node, 1);
                const rightBrace = tokenStore.getLastToken(node, hasSemi ? 3 : 2);
                // @ts-expect-error
                setOffset(leftBrace, 0, importToken);
                // @ts-expect-error
                processNodeList(node.specifiers, leftBrace, rightBrace, 1);
                tokens.push(
                    // from
                    // @ts-expect-error
                    tokenStore.getLastToken(node, hasSemi ? 2 : 1),
                    // "foo"
                    // @ts-expect-error
                    tokenStore.getLastToken(node, hasSemi ? 1 : 0)
                );
            }

            // @ts-expect-error
            setOffset(tokens, 1, importToken);
        },

        ImportSpecifier(node: ImportSpecifier) {
            // @ts-expect-error
            if (node.local.range[0] !== node.imported.range[0]) {
                const tokens = tokenStore.getTokens(node);
                const firstToken = tokens.shift()!;
                setOffset(tokens, 1, firstToken);
            }
        },


        ImportNamespaceSpecifier(node: ImportNamespaceSpecifier) {
            const tokens = tokenStore.getTokens(node);
            const firstToken = tokens.shift()!;
            setOffset(tokens, 1, firstToken);
        },


        LabeledStatement(node: LabeledStatement) {
            const labelToken = tokenStore.getFirstToken(node);
            // @ts-expect-error
            const colonToken = tokenStore.getTokenAfter(labelToken);
            // @ts-expect-error
            const bodyToken = tokenStore.getTokenAfter(colonToken);

            // @ts-expect-error
            setOffset([colonToken, bodyToken], 1, labelToken);
        },


        'MemberExpression, MetaProperty'(node: MemberExpression | MetaProperty) {
            const objectToken = tokenStore.getFirstToken(node);
            if (node.type === 'MemberExpression' && node.computed) {
                const leftBracketToken = tokenStore.getTokenBefore(
                    // @ts-expect-error
                    node.property,
                    isLeftBracket
                )!;
                // @ts-expect-error
                const propertyToken = tokenStore.getTokenAfter(leftBracketToken);
                const rightBracketToken = tokenStore.getTokenAfter(
                    // @ts-expect-error
                    node.property,
                    isRightBracket
                );

                // @ts-expect-error
                setOffset(leftBracketToken, 1, objectToken);
                setOffset(propertyToken, 1, leftBracketToken);
                setOffset(rightBracketToken, 0, leftBracketToken);
            }
            else {
                const dotToken = tokenStore.getTokenBefore(node.property);
                // @ts-expect-error
                const propertyToken = tokenStore.getTokenAfter(dotToken);

                // @ts-expect-error
                setOffset([dotToken, propertyToken], 1, objectToken);
            }
        },


        'MethodDefinition, Property'(node: MethodDefinition | Property) {
            const isMethod = node.type === 'MethodDefinition' || node.method;
            const prefixTokens = getPrefixTokens(node);
            const hasPrefix = prefixTokens.length >= 1;

            for (let i = 1; i < prefixTokens.length; ++i) {
                setOffset(prefixTokens[i], 0, prefixTokens[i - 1]);
            }

            let lastKeyToken: Token;
            if (node.computed) {
                const keyLeftToken = tokenStore.getFirstToken(
                    // @ts-expect-error
                    node,
                    isLeftBracket
                )!;
                // @ts-expect-error
                const keyToken = tokenStore.getTokenAfter(keyLeftToken);
                const keyRightToken = (lastKeyToken = tokenStore.getTokenAfter(
                    // @ts-expect-error
                    node.key,
                    isRightBracket
                )!);

                if (hasPrefix) {
                    setOffset(keyLeftToken, 0, last(prefixTokens)!);
                }
                setOffset(keyToken, 1, keyLeftToken);
                setOffset(keyRightToken, 0, keyLeftToken);
            }
            else {
                // @ts-expect-error
                const idToken = (lastKeyToken = tokenStore.getFirstToken(node.key));

                if (hasPrefix) {
                    setOffset(idToken, 0, last(prefixTokens)!);
                }
            }

            if (isMethod) {
                // @ts-expect-error
                const leftParenToken = tokenStore.getTokenAfter(lastKeyToken);

                setOffset(leftParenToken, 1, lastKeyToken);
            }
            else if (node.type === 'Property' && !node.shorthand) {
                // @ts-expect-error
                const colonToken = tokenStore.getTokenAfter(lastKeyToken);
                // @ts-expect-error
                const valueToken = tokenStore.getTokenAfter(colonToken);

                setOffset([colonToken, valueToken], 1, lastKeyToken);
            }
        },

        NewExpression(node: NewExpression) {
            const newToken = tokenStore.getFirstToken(node);
            // @ts-expect-error
            const calleeToken = tokenStore.getTokenAfter(newToken);
            const rightToken = tokenStore.getLastToken(node);
            const leftToken = isRightParen(rightToken)
                // @ts-expect-error
                ? tokenStore.getFirstTokenBetween(node.callee, rightToken, isLeftParen)
                : null;

            // @ts-expect-error
            setOffset(calleeToken, 1, newToken);
            if (leftToken != null) {
                // @ts-expect-error
                setOffset(leftToken, 1, calleeToken);
                // @ts-expect-error
                processNodeList(node.arguments, leftToken, rightToken, 1);
            }
        },


        'ObjectExpression, ObjectPattern'(node: ObjectExpression | ObjectPattern) {
            processNodeList(
                // @ts-expect-error
                node.properties,
                tokenStore.getFirstToken(node),
                tokenStore.getLastToken(node),
                1
            );
        },

        SequenceExpression(node: SequenceExpression) {
            // @ts-expect-error
            processNodeList(node.expressions, null, null, 0);
        },

        SwitchCase(node: SwitchCase) {
            const caseToken = tokenStore.getFirstToken(node);

            if (node.test) {
                // @ts-expect-error
                const colonToken = tokenStore.getTokenAfter(caseToken);

                // @ts-expect-error
                setOffset(colonToken, 1, caseToken);
            }
            else {
                // @ts-expect-error
                const testToken = tokenStore.getTokenAfter(caseToken);
                // @ts-expect-error
                const colonToken = tokenStore.getTokenAfter(node.test, isNotRightParen);

                // @ts-expect-error
                setOffset([testToken, colonToken], 1, caseToken);
            }

            if (node.consequent.length === 1 && node.consequent[0].type === 'BlockStatement'
            ) {
                // @ts-expect-error
                setOffset(tokenStore.getFirstToken(node.consequent[0]), 0, caseToken);
            }
            else if (node.consequent.length >= 1) {
                // @ts-expect-error
                setOffset(tokenStore.getFirstToken(node.consequent[0]), 1, caseToken);
                // @ts-expect-error
                processNodeList(node.consequent, null, null, 0);
            }
        },


        SwitchStatement(node: SwitchStatement) {
            const switchToken = tokenStore.getFirstToken(node);
            // @ts-expect-error
            const leftParenToken = tokenStore.getTokenAfter(switchToken);
            // @ts-expect-error
            const discriminantToken = tokenStore.getTokenAfter(leftParenToken);
            const leftBraceToken = tokenStore.getTokenAfter(
                node.discriminant,
                // @ts-expect-error
                isLeftBrace
            );
            // @ts-expect-error
            const rightParenToken = tokenStore.getTokenBefore(leftBraceToken);
            const rightBraceToken = tokenStore.getLastToken(node);

            // @ts-expect-error
            setOffset(leftParenToken, 1, switchToken);
            // @ts-expect-error
            setOffset(discriminantToken, 1, leftParenToken);
            // @ts-expect-error
            setOffset(rightParenToken, 0, leftParenToken);
            // @ts-expect-error
            setOffset(leftBraceToken, 0, switchToken);
            processNodeList(
                // @ts-expect-error
                node.cases,
                leftBraceToken,
                rightBraceToken,
                options.switchCase
            );
        },


        TaggedTemplateExpression(node: TaggedTemplateExpression) {
            // @ts-expect-error
            const tagTokens = getFirstAndLastTokens(node.tag, node.range[0]);
            // @ts-expect-error
            const quasiToken = tokenStore.getTokenAfter(tagTokens.lastToken);

            setOffset(quasiToken, 1, tagTokens.firstToken);
        },


        TemplateLiteral(node: TemplateLiteral) {
            const firstToken = tokenStore.getFirstToken(node);
            const quasiTokens = node.quasis
                .slice(1)
                // @ts-expect-error
                .map(n => tokenStore.getFirstToken(n));
            const expressionToken = node.quasis
                .slice(0, -1)
                // @ts-expect-error
                .map(n => tokenStore.getTokenAfter(n));

            // @ts-expect-error
            setOffset(quasiTokens, 0, firstToken);
            // @ts-expect-error
            setOffset(expressionToken, 1, firstToken);
        },


        TryStatement(node: TryStatement) {
            const tryToken = tokenStore.getFirstToken(node);
            const tryBlockToken = tokenStore.getFirstToken(node.block);

            // @ts-expect-error
            setOffset(tryBlockToken, 0, tryToken);

            if (node.handler != null) {
                const catchToken = tokenStore.getFirstToken(node.handler);

                // @ts-expect-error
                setOffset(catchToken, 0, tryToken);
            }

            if (node.finalizer != null) {
                const finallyToken = tokenStore.getTokenBefore(node.finalizer);
                const finallyBlockToken = tokenStore.getFirstToken(node.finalizer);

                // @ts-expect-error
                setOffset([finallyToken, finallyBlockToken], 0, tryToken);
            }
        },


        UpdateExpression(node: UpdateExpression) {
            const firstToken = tokenStore.getFirstToken(node);
            // @ts-expect-error
            const nextToken = tokenStore.getTokenAfter(firstToken);

            // @ts-expect-error
            setOffset(nextToken, 1, firstToken);
        },


        VariableDeclaration(node: VariableDeclaration) {
            processNodeList(
                // @ts-expect-error
                node.declarations,
                tokenStore.getFirstToken(node),
                null,
                1
            );
        },


        VariableDeclarator(node: VariableDeclarator) {
            if (node.init != null) {
                const idToken = tokenStore.getFirstToken(node);
                const eqToken = tokenStore.getTokenAfter(node.id);
                // @ts-expect-error
                const initToken = tokenStore.getTokenAfter(eqToken);

                // @ts-expect-error
                setOffset([eqToken, initToken], 1, idToken);
            }
        },


        'WhileStatement, WithStatement'(node: WhileStatement | WithStatement) {
            const firstToken = tokenStore.getFirstToken(node);
            // @ts-expect-error
            const leftParenToken = tokenStore.getTokenAfter(firstToken);
            // @ts-expect-error
            const rightParenToken = tokenStore.getTokenBefore(node.body, isRightParen);

            // @ts-expect-error
            setOffset(leftParenToken, 1, firstToken);
            // @ts-expect-error
            setOffset(rightParenToken, 0, leftParenToken);
            // @ts-expect-error
            processMaybeBlock(node.body, firstToken);
        },


        YieldExpression(node: YieldExpression) {
            if (node.argument != null) {
                const yieldToken = tokenStore.getFirstToken(node);

                // @ts-expect-error
                setOffset(tokenStore.getTokenAfter(yieldToken), 1, yieldToken);
                if (node.delegate) {
                    // @ts-expect-error
                    setOffset(tokenStore.getTokenAfter(yieldToken, 1), 1, yieldToken);
                }
            }
        },


        // Process semicolons.
        ':statement'(node: Statement) {
            const firstToken = tokenStore.getFirstToken(node);
            const lastToken = tokenStore.getLastToken(node);
            if (isSemicolon(lastToken) && firstToken !== lastToken) {
                // @ts-expect-error
                setOffset(lastToken, 0, firstToken);
            }

            // Set to the semicolon of the previous token for semicolon-free style.
            // E.g.,
            //   foo
            //   ;[1,2,3].forEach(f)
            const info = offsets.get(firstToken);
            // @ts-expect-error
            const prevToken = tokenStore.getTokenBefore(firstToken);
            // @ts-expect-error
            if (info != null && isSemicolon(prevToken) && prevToken.loc.end.line === firstToken.loc.start.line
            ) {
                offsets.set(prevToken, info);
            }
        },


        // Process parentheses.
        // `:expression` does not match with MetaProperty and TemplateLiteral as a bug: https://github.com/estools/esquery/pull/59
        ':expression, MetaProperty, TemplateLiteral'(node: Expression | MetaProperty | TemplateLiteral) {
            let leftToken = tokenStore.getTokenBefore(node);
            let rightToken = tokenStore.getTokenAfter(node);
            let firstToken = tokenStore.getFirstToken(node);

            while (isLeftParen(leftToken) && isRightParen(rightToken)) {
                // @ts-expect-error
                setOffset(firstToken, 1, leftToken);
                // @ts-expect-error
                setOffset(rightToken, 0, leftToken);

                firstToken = leftToken;
                // @ts-expect-error
                leftToken = tokenStore.getTokenBefore(leftToken);
                // @ts-expect-error
                rightToken = tokenStore.getTokenAfter(rightToken);
            }
        },


        // Ignore tokens of unknown nodes.
        '*:exit'(node: XNode) {
            if (!KNOWN_NODES.has(node.type) && !NON_STANDARD_KNOWN_NODES.has(node.type)) {
                ignore(node);
            }
        },


        // Top-level process.
        // Program(node) {
        //     // @ts-ignore
        //     const firstToken = node.tokens[0];
        //     const isScriptTag = firstToken != null
        //         && firstToken.type === 'Punctuator'
        //         && firstToken.value === '<script>';
        //     const baseIndent = isScriptTag
        //         ? options.indentSize * options.baseIndent
        //         : 0;

        //     for (const statement of node.body) {
        //         // @ts-ignore
        //         processTopLevelNode(statement, baseIndent);
        //     }
        // },


        'XElement[parent.type!=\'XElement\']'(node: Node) {
            processTopLevelNode(node, 0);
        },


        // Do validation.
        ':matches(Program, XElement[parent.type!=\'XElement\']):exit'(node: Program | XElement) {
            let comments: Token[] = [];

            let tokensOnSameLine = [] as Token[];
            let isBesideMultilineToken = false;
            let lastValidatedToken: Token | null = null;

            // Validate indentation of tokens.
            // @ts-expect-error
            for (const token of tokenStore.getTokens(node, ITERATION_OPTS)) {
                if (tokensOnSameLine.length === 0 || tokensOnSameLine[0].loc.start.line === token.loc.start.line
                ) {
                    // This is on the same line (or the first token).
                    tokensOnSameLine.push(token);
                }
                else if (tokensOnSameLine.every(isComment)) {
                    // New line is detected, but the all tokens of the previous line are comment.
                    // Comment lines are adjusted to the next code line.
                    comments.push(tokensOnSameLine[0]);
                    // @ts-expect-error
                    isBesideMultilineToken = (last(tokensOnSameLine)).loc.end.line === token.loc.start.line;
                    tokensOnSameLine = [token];
                }
                else {
                    // New line is detected, so validate the tokens.
                    if (!isBesideMultilineToken) {
                        validate(tokensOnSameLine, comments, lastValidatedToken);
                        lastValidatedToken = tokensOnSameLine[0];
                    }
                    // @ts-expect-error
                    isBesideMultilineToken = (last(tokensOnSameLine)).loc.end.line === token.loc.start.line;
                    tokensOnSameLine = [token];
                    comments = [];
                }
            }
            if (tokensOnSameLine.length >= 1 && tokensOnSameLine.some(isNotComment)) {
                validate(tokensOnSameLine, comments, lastValidatedToken);
            }
        }
    });
};

export default defineVisitor;
