import sortedIndexBy from 'lodash/sortedIndexBy';
import type {
    ESLintCallExpression,
    ESLintExpression,
    ESLintExpressionStatement,
    ESLintExtendedProgram,
    HasLocation,
    Node,
    Reference,
    Token,
    Variable,
    XElement,
    OffsetRange
} from '../ast';
import {
    traverseNodes,
    ParseError
} from '../ast';
import { debug } from '../common/debug';
import type { LocationCalculator } from '../common/location-calculator';
import {
    analyzeExternalReferences,
} from './scope-analyzer';
import type { ESLintCustomParser } from './espree';
import { getEspree } from './espree';

/**
 * Do post-process of parsing an expression.
 *
 * 1. Set `node.parent`.
 * 2. Fix `node.range` and `node.loc` for HTML entities.
 *
 * @param result The parsing result to modify.
 * @param locationCalculator The location calculator to modify.
 */
function postProcess(
    result: ESLintExtendedProgram,
    locationCalculator: LocationCalculator,
): void {
    // There are cases which the same node instance appears twice in the tree.
    // E.g. `let {a} = {}` // This `a` appears twice at `Property#key` and `Property#value`.
    const traversed = new Set<Node | number[]>();

    traverseNodes(result.ast, {
        visitorKeys: result.visitorKeys,

        enterNode(node, parent) {
            if (!traversed.has(node)) {
                traversed.add(node);
                node.parent = parent;

                // `babel-eslint@8` has shared `Node#range` with multiple nodes.
                // See also: https://github.com/vuejs/eslint-plugin-vue/issues/208
                if (!traversed.has(node.range)) {
                    traversed.add(node.range);
                    locationCalculator.fixLocation(node);
                }
            }
        },

        leaveNode() {
            // Do nothing.
        },
    });

    for (const token of result.ast.tokens || []) {
        locationCalculator.fixLocation(token);
    }
    for (const comment of result.ast.comments || []) {
        locationCalculator.fixLocation(comment);
    }
}


/**
 * Get the comma token before a given node.
 * @param tokens The token list.
 * @param node The node to get the comma before this node.
 * @returns The comma token.
 */
function getCommaTokenBeforeNode(tokens: Token[], node: Node): Token | null {
    let tokenIndex = sortedIndexBy<{ range: OffsetRange }>(
        tokens,
        {
            range: node.range
        },
        t => t.range[0],
    );

    while (tokenIndex >= 0) {
        const token = tokens[tokenIndex];
        if (token.type === 'Punctuator' && token.value === ',') {
            return token;
        }
        tokenIndex -= 1;
    }

    return null;
}

/**
 * Throw syntax error for empty.
 * @param locationCalculator The location calculator to get line/column.
 */
function throwEmptyError(
    locationCalculator: LocationCalculator,
    expected: string,
): never {
    const loc = locationCalculator.getLocation(0);
    const e = new ParseError(
        `Expected to be ${ expected }, but got empty.`,
        void 0,
        0,
        loc.line,
        loc.column,
    );
    locationCalculator.fixErrorLocation(e);

    throw e;
}

/**
 * Throw syntax error for unexpected token.
 * @param locationCalculator The location calculator to get line/column.
 * @param name The token name.
 * @param token The token object to get that location.
 */
function throwUnexpectedTokenError(name: string, token: HasLocation): never {
    const e = new ParseError(
        `Unexpected token '${ name }'.`,
        void 0,
        token.range[0],
        token.loc.start.line,
        token.loc.start.column,
    );

    throw e;
}

/**
 * Throw syntax error of outside of code.
 * @param locationCalculator The location calculator to get line/column.
 */
function throwErrorAsAdjustingOutsideOfCode(
    e: any,
    code: string,
    locationCalculator: LocationCalculator,
): never {
    if (ParseError.isParseError(e)) {
        const endOffset = locationCalculator.getOffsetWithGap(code.length);
        if (e.index >= endOffset) {
            e.message = 'Unexpected end of expression.';
        }
    }

    throw e;
}

/**
 * Parse the given source code.
 *
 * @param code The source code to parse.
 * @param locationCalculator The location calculator for postProcess.
 * @param parserOptions The parser options.
 * @returns The result of parsing.
 */
function parseScriptFragment(
    code: string,
    locationCalculator: LocationCalculator,
    parserOptions: any,
): ESLintExtendedProgram {
    try {
        const result = parseScript(code, parserOptions);
        postProcess(result, locationCalculator);
        return result;
    }
    catch (e) {
        const perr = ParseError.normalize(e);
        if (perr) {
            locationCalculator.fixErrorLocation(perr);
            throw perr;
        }
        throw e;
    }
}


/**
 * Parse the source code of inline scripts.
 * @param code The source code of inline scripts.
 * @param locationCalculator The location calculator for the inline script.
 * @param parserOptions The parser options.
 * @returns The result of parsing.
 */
function parseExpressionBody(
    code: string,
    locationCalculator: LocationCalculator,
    parserOptions: any,
    allowEmpty = false,
): ExpressionParseResult<ESLintExpression> {
    debug('[script] parse expression: "0(%s)"', code);

    try {
        const { ast } = parseScriptFragment(
            `0(${ code })`,
            locationCalculator.getSubCalculatorShift(-2),
            parserOptions,
        );
        const tokens = ast.tokens || [];
        const comments = ast.comments || [];
        const references = analyzeExternalReferences(ast, parserOptions);
        const statement = ast.body[0] as ESLintExpressionStatement;
        const callExpression = statement.expression as ESLintCallExpression;
        let expression = callExpression.arguments[0];

        if (!allowEmpty && !expression) {
            return throwEmptyError(locationCalculator, 'an expression');
        }

        if (expression && expression.type === 'SpreadElement') {
            return throwUnexpectedTokenError('...', expression);
        }

        if (callExpression.arguments[1]) {
            const node = callExpression.arguments[1];
            return throwUnexpectedTokenError(
                ',',
                getCommaTokenBeforeNode(tokens, node) || node,
            );
        }

        // Remove parens.
        tokens.shift();
        tokens.shift();
        tokens.pop();

        expression = expression as ESLintExpression;
        return { expression, tokens, comments, references, variables: [] };
    }
    catch (e) {
        return throwErrorAsAdjustingOutsideOfCode(e, code, locationCalculator);
    }
}

/**
 * The result of parsing expressions.
 */
export interface ExpressionParseResult<T extends Node> {
    expression: T | null;
    tokens: Token[];
    comments: Token[];
    references: Reference[];
    variables: Variable[];
}

/**
 * Parse the given source code.
 *
 * @param code The source code to parse.
 * @param parserOptions The parser options.
 * @returns The result of parsing.
 */
export function parseScript(
    code: string,
    parserOptions: any,
): ESLintExtendedProgram {
    const parser: ESLintCustomParser = typeof parserOptions.parser === 'string'
        ? require(parserOptions.parser)
        : getEspree();
    const result: any = typeof parser.parseForESLint === 'function'
        ? parser.parseForESLint(code, parserOptions)
        : parser.parse(code, parserOptions);

    if (result.ast != null) {
        return result;
    }
    return { ast: result };
}


/**
 * Parse the source code of the given `<wxs>` element.
 * @param node The `<wxs>` element to parse.
 * @param globalLocationCalculator The location calculator for postProcess.
 * @param parserOptions The parser options.
 * @returns The result of parsing.
 */
export function parseWxsElement(
    node: XElement,
    globalLocationCalculator: LocationCalculator,
    parserOptions: any,
): ESLintExtendedProgram {
    // TODO: wxs module
    const textNode = node.children[0];
    const offset = textNode != null && textNode.type === 'XText'
        ? textNode.range[0]
        : node.startTag.range[1];
    const code = textNode != null && textNode.type === 'XText' ? textNode.value : '';
    const locationCalculator = globalLocationCalculator.getSubCalculatorAfter(
        offset
    );
    const result = parseScriptFragment(
        code,
        locationCalculator,
        parserOptions
    );

    result.ast.loc = textNode.loc;
    result.ast.range = textNode.range;
    return result;
}

/**
 * Parse the source code of inline scripts.
 * @param code The source code of inline scripts.
 * @param locationCalculator The location calculator for the inline script.
 * @param parserOptions The parser options.
 * @returns The result of parsing.
 */
export function parseExpression(
    code: string,
    locationCalculator: LocationCalculator,
    parserOptions: any,
    { allowEmpty = false } = {},
): ExpressionParseResult<ESLintExpression> {
    debug('[script] parse expression: "%s"', code);

    return parseExpressionBody(
        code,
        locationCalculator,
        parserOptions,
        allowEmpty,
    );
}
