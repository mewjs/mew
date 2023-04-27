import sortedIndexBy from 'lodash/sortedIndexBy';
import sortedLastIndexBy from 'lodash/sortedLastIndexBy';
import type {
    Reference,
    Token,
    XAttribute,
    XDirective,
    XDirectiveKey,
    XDocumentFragment,
    XElement,
    XExpressionContainer,
    XIdentifier,
    XModuleContainer,
    XNode
} from '../ast';
import {
    ParseError
} from '../ast';
import { debug } from '../common/debug';
import type { LocationCalculator } from '../common/location-calculator';
import {
    parseExpression, parseWxsElement
} from '../script';
import { analyzeExternalReferences } from '../script/scope-analyzer';

// quick directive
const quickDirectivePrefix = /^(?:wx:|a:|s-)/;
const bindDirectivePrefix = /^(?:data-|change:|model:|bind:?|on|catch:?|capture-bind:|capture-catch:|mut-bind:)/;

/**
 * Get the belonging document of the given node.
 * @param leafNode The node to get.
 * @returns The belonging document.
 */
function getOwnerDocument(leafNode: XNode): XDocumentFragment | null {
    let node: XNode | null = leafNode;
    while (node != null && node.type !== 'XDocumentFragment') {
        node = node.parent;
    }
    return node as XDocumentFragment;
}

/**
 * Parse the given attribute name as a directive key.
 * @param node The identifier node to parse.
 * @param document The document to add parsing errors.
 * @returns The directive key node.
 */
function parseDirectiveKeyStatically(
    node: XIdentifier,
    document: XDocumentFragment | null,
): XDirectiveKey {
    const {
        name: text,
        rawName: rawText,
        range: [offset],
        loc: {
            start: { column, line },
        },
    } = node;
    const directiveKey: XDirectiveKey = {
        type: 'XDirectiveKey',
        range: node.range,
        loc: node.loc,
        parent: node.parent as any,
        name: null as any,
        argument: null as any,
        modifiers: null,
    };

    // key process index
    let i = 0;

    const createIdentifier = (
        start: number,
        end: number,
        name?: string,
    ): XIdentifier => ({
        type: 'XIdentifier',
        parent: directiveKey,
        range: [offset + start, offset + end],
        loc: {
            start: { column: column + start, line },
            end: { column: column + end, line },
        },
        name: name || text.slice(start, end),
        rawName: rawText.slice(start, end),
    });

    // Parse.
    // control directive
    if (text.match(quickDirectivePrefix)) {
        const prefix = RegExp.lastMatch;
        directiveKey.name = createIdentifier(0, text.length, text.slice(prefix.length));
        i = text.length;
    }
    // bind:tap, data-hi
    else if (text.match(bindDirectivePrefix)) {
        const prefix = RegExp.lastMatch;
        directiveKey.name = createIdentifier(0, prefix.length, prefix.replace(/[:-]$/, ''));
        i = prefix.length;
        directiveKey.argument = createIdentifier(i, text.length, text.slice(prefix.length));
    }

    if (directiveKey.name.name === 'wx:' || directiveKey.name.name === 'a:' || directiveKey.name.name === 's-') {
        insertError(
            document,
            new ParseError(
                `Unexpected token '${
                    text[directiveKey.name.range[1] - offset]
                }'`,
                void 0,
                directiveKey.name.range[1],
                directiveKey.name.loc.end.line,
                directiveKey.name.loc.end.column,
            ),
        );
    }

    return directiveKey;
}

/**
 * Parse the tokens of a given key node.
 * @param node The key node to parse.
 */
function parseDirectiveKeyTokens(node: XDirectiveKey): Token[] {
    const { name, argument, modifiers } = node;
    const shorthand = name.range[1] - name.range[0] === 1;
    const tokens: Token[] = [];

    if (shorthand) {
        tokens.push({
            type: 'Punctuator',
            range: name.range,
            loc: name.loc,
            value: name.rawName,
        });
    }
    else {
        tokens.push({
            type: 'HTMLIdentifier',
            range: name.range,
            loc: name.loc,
            value: name.rawName,
        });

        if (argument) {
            tokens.push({
                type: 'Punctuator',
                range: [name.range[1], argument.range[0]],
                loc: { start: name.loc.end, end: argument.loc.start },
                value: ':',
            });
        }
    }

    if (argument) {
        tokens.push({
            type: 'HTMLIdentifier',
            range: argument.range,
            loc: argument.loc,
            value: (argument as XIdentifier).rawName,
        });
    }

    let lastNode = (argument as XIdentifier | null) || name;
    if (modifiers) {
        for (const modifier of modifiers) {
            if (modifier.rawName === '') {
                continue;
            }
            tokens.push(
                {
                    type: 'Punctuator',
                    range: [lastNode.range[1], modifier.range[0]],
                    loc: { start: lastNode.loc.end, end: modifier.loc.start },
                    value: '.',
                },
                {
                    type: 'HTMLIdentifier',
                    range: modifier.range,
                    loc: modifier.loc,
                    value: modifier.rawName,
                },
            );
            lastNode = modifier;
        }
    }

    return tokens;
}

/**
 * Parse the given attribute name as a directive key.
 * @param node The identifier node to parse.
 * @returns The directive key node.
 */
function createDirectiveKey(
    node: XIdentifier,
    document: XDocumentFragment | null,
): XDirectiveKey {
    // Parse node and tokens.
    const directiveKey = parseDirectiveKeyStatically(node, document);
    const tokens = parseDirectiveKeyTokens(directiveKey);
    replaceTokens(document, directiveKey, tokens);
    return directiveKey;
}

interface HasRange {
    range: [number, number];
}

/**
 * Get `x.range[0]`.
 * @param x The object to get.
 * @returns `x.range[0]`.
 */
function byRange0(x: HasRange): number {
    return x.range[0];
}

/**
 * Get `x.range[1]`.
 * @param x The object to get.
 * @returns `x.range[1]`.
 */
function byRange1(x: HasRange): number {
    return x.range[1];
}

/**
 * Get `x.pos`.
 * @param x The object to get.
 * @returns `x.pos`.
 */
function byIndex(x: ParseError): number {
    return x.index;
}

/**
 * Replace the tokens in the given range.
 * @param document The document that the node is belonging to.
 * @param node The node to specify the range of replacement.
 * @param newTokens The new tokens.
 */
function replaceTokens(
    document: XDocumentFragment | null,
    node: HasRange,
    newTokens: Token[],
): void {
    if (document == null) {
        return;
    }

    const index = sortedIndexBy(document.tokens, node, byRange0);
    const count = sortedLastIndexBy(document.tokens, node, byRange1) - index;
    document.tokens.splice(index, count, ...newTokens);
}

/**
 * Insert the given comment tokens.
 * @param document The document that the node is belonging to.
 * @param newComments The comments to insert.
 */
function insertComments(
    document: XDocumentFragment | null,
    newComments: Token[],
): void {
    if (document == null || newComments.length === 0) {
        return;
    }

    const index = sortedIndexBy(document.comments, newComments[0], byRange0);
    document.comments.splice(index, 0, ...newComments);
}

/**
 * Insert the given error.
 * @param document The document that the node is belonging to.
 * @param error The error to insert.
 */
function insertError(
    document: XDocumentFragment | null,
    error: ParseError,
): void {
    if (document == null) {
        return;
    }

    const index = sortedIndexBy(document.errors, error, byIndex);
    document.errors.splice(index, 0, error);
}

/**
 * Resolve the variable of the given reference.
 * @param referene The reference to resolve.
 * @param element The belonging element of the reference.
 */
function resolveReference(referene: Reference, element: XElement): void {
    let node: XNode | null = element;

    // Find the variable of this reference.
    while (node != null && node.type === 'XElement') {
        for (const variable of node.variables) {
            if (variable.id.name === referene.id.name) {
                referene.variable = variable;
                variable.references.push(referene);
                return;
            }
        }

        node = node.parent;
    }
}

/**
 * Information of a mustache.
 */
export interface Mustache {
    value: string;
    startToken: Token;
    endToken: Token;
}

/**
 * Replace the given attribute by a directive.
 * @param code Whole source code text.
 * @param parserOptions The parser options to parse expressions.
 * @param locationCalculator The location calculator to adjust the locations of nodes.
 * @param node The attribute node to replace. This function modifies this node directly.
 */
export function convertToDirective(
    node: XAttribute,
): void {
    debug(
        '[template] convert to directive: %s="%s" %j',
        node.key.name,
        node.value[0],
        node.range,
    );
    const document = getOwnerDocument(node);
    const directive: XDirective = node as any;

    directive.directive = true;
    directive.prefix = node.key.rawName.match(quickDirectivePrefix)
        ? RegExp.lastMatch as any
        : null;

    directive.key = createDirectiveKey(
        node.key,
        document
    );
}

/**
 * Parse the content of the given mustache.
 * @param parserOptions The parser options to parse expressions.
 * @param globalLocationCalculator The location calculator to adjust the locations of nodes.
 * @param node The expression container node. This function modifies the `expression` and `references` properties of this node.
 * @param mustache The information of mustache to parse.
 */
export function processMustache(
    parserOptions: any,
    globalLocationCalculator: LocationCalculator,
    node: XExpressionContainer,
    mustache: Mustache,
    isSpreadObject = false
): void {
    debug('[template] convert mustache {{%s}} %j', mustache.value, (mustache as any).range);
    let code = mustache.value;
    if (isSpreadObject) {
        code = `{${ code }}`;
        mustache.startToken.range[1] -= 1;
        mustache.startToken.loc.end.column -= 1;
        mustache.startToken.value = '{';

        mustache.endToken.range[0] += 1;
        mustache.endToken.loc.start.column += 1;
        mustache.endToken.value = '}';
    }

    const range: [number, number] = [
        mustache.startToken.range[1],
        mustache.endToken.range[0]
    ];

    const document = getOwnerDocument(node);
    try {
        const locationCalculator = globalLocationCalculator.getSubCalculatorAfter(
            range[0],
        );
        const ret = parseExpression(
            code,
            locationCalculator,
            parserOptions,
            { allowEmpty: true },
        );

        node.expression = ret.expression || null;
        node.references = ret.references;
        if (ret.expression != null) {
            ret.expression.parent = node;
        }
        if (ret.tokens.length) {
            replaceTokens(document, { range }, ret.tokens);
        }
        insertComments(document, ret.comments);
    }
    catch (e) {
        debug('[template] Parse error: %s', e);

        if (ParseError.isParseError(e)) {
            insertError(document, e);
        }
        else {
            throw e;
        }
    }
}

/**
 * Parse the content of the given mustache.
 * @param parserOptions The parser options to parse expressions.
 * @param globalLocationCalculator The location calculator to adjust the locations of nodes.
 * @param node The expression container node. This function modifies the `expression` and `references` properties of this node.
 */
export function processWxsModule(
    parserOptions: any,
    globalLocationCalculator: LocationCalculator,
    node: XElement
) {
    // TODO:
    debug('[template] parse Wxs module %s %j', node.name, node.range);
    const document = getOwnerDocument(node);
    try {
        const wxmlParseOptions = {
            ...parserOptions,
            parser: 'espree',
            ecmaVersion: 5,
            sourceType: 'script'
        };
        const { ast } = parseWxsElement(node, globalLocationCalculator, wxmlParseOptions);
        const references = analyzeExternalReferences(ast, wxmlParseOptions);
        const moduleContainer: XModuleContainer = {
            type: 'XModuleContainer',
            parent: node,
            loc: ast.loc,
            range: ast.range,
            body: ast.body,
            references
        };
        node.children.splice(0, 1, moduleContainer);

        if (ast.tokens && ast.tokens.length > 0) {
            replaceTokens(document, { range: ast.range }, ast.tokens);
        }

        insertComments(document, ast.comments || []);
    }
    catch (e) {
        debug('[template] Parse error: %s', e);

        if (ParseError.isParseError(e)) {
            insertError(document, e);
        }
        else {
            throw e;
        }
    }
}

/**
 * Resolve all references of the given expression container.
 * @param container The expression container to resolve references.
 */
export function resolveReferences(container: XExpressionContainer): void {
    let element: XNode | null = container.parent;

    // Get the belonging element.
    while (element != null && element.type !== 'XElement') {
        element = element.parent;
    }

    // Resolve.
    if (element != null) {
        for (const reference of container.references) {
            resolveReference(reference, element as XElement);
        }
    }
}
