import fs from 'fs';
import path from 'path';
import last from 'lodash/last';
import { parseForESLint, type AST } from '../../src';
import { Linter } from '../fixtures/eslint';


const PARSER = path.resolve(__dirname, '../../src/index.ts');
const ROOT = path.join(__dirname, '../fixtures/ast');
const TARGETS = fs.readdirSync(ROOT);
const PARSER_OPTIONS = {
    comment: true,
    ecmaVersion: 2018,
    loc: true,
    range: true,
    tokens: true,
};

interface Error {
    message: string;
    index: number;
    lineNumber: number;
    column: number;
}

/**
 * Remove `parent` properties from the given AST.
 * @param {string} key The key.
 * @param {any} value The value of the key.
 * @returns {any} The value of the key to output.
 */
function replacer<T extends Error>(key: string, value: T[]): T[] | undefined {
    if (key === 'parent') {
        return;
    }

    if (key === 'errors' && Array.isArray(value)) {
        return value.map(e => ({
            message: e.message,
            index: e.index,
            lineNumber: e.lineNumber,
            column: e.column,
        } as T));
    }

    return value;
}

/**
 * Get all tokens of the given AST.
 * @param {ASTNode} ast The root node of AST.
 * @returns {Token[]} Tokens.
 */
function getAllTokens(ast: AST.ESLintProgram): AST.Token[] {
    const tokenArrays = [ast.tokens, ast.comments];
    if (ast.templateBody != null) {
        tokenArrays.push(ast.templateBody.tokens, ast.templateBody.comments);
    }
    return Array.prototype.concat.apply([], tokenArrays);
}

// type MyElement = AST.XElement | AST.XText | AST.XExpressionContainer | AST.XModuleContainer;
/* eslint-disable-next-line @typescript-eslint/no-type-alias */
type MyElement = AST.XElement;

/**
 * Create simple tree.
 * @param {string} source The source code.
 * @returns {object} Simple tree.
 */
function getTree(source: string) {
    const linter = new Linter();
    const stack: MyElement[] = [];
    const root: MyElement = { children: [] as MyElement[] } as MyElement;
    let current = root;

    linter.defineParser(PARSER, require(PARSER));
    // @ts-expect-error
    linter.defineRule('make-tree', ruleContext =>
        ruleContext.parserServices.defineTemplateBodyVisitor({
            '*': function (node: AST.XElement) {
                stack.push(current);
                current.children.push(
                    (current = {
                        type: node.type,
                        text: source.slice(node.range[0], node.range[1]),
                        children: [] as MyElement[],
                    } as unknown as MyElement)
                );
            },
            '*:exit': function () {
                current = stack.pop()! as MyElement;
            }
        }));
    linter.verify(
        source,
        {
            parser: PARSER,
            parserOptions: { ecmaVersion: 2018 },
            rules: { 'make-tree': 'error' },
        },
        'source.wxml'
    );

    return root.children;
}

/**
 * Validate the parent property of every node.
 * @param {string} source The source code.
 */
function validateParent(source: string) {
    const linter = new Linter();
    const stack = [] as MyElement[];

    linter.defineParser(PARSER, require(PARSER));
    // @ts-expect-error
    linter.defineRule('validate-parent', ruleContext =>
        ruleContext.parserServices.defineTemplateBodyVisitor({
            '*': function (node: MyElement) {
                if (stack.length >= 1) {
                    const parent = last(stack);
                    expect(node.parent).toStrictEqual(parent);
                }
                stack.push(node);
            },
            '*:exit': function () {
                stack.pop();
            }
        }));

    linter.verify(
        source,
        {
            parser: PARSER,
            parserOptions: { ecmaVersion: 2017 },
            rules: { 'validate-parent': 'error' },
        }
    );
}

describe('Template AST', () => {
    for (const name of TARGETS) {
        const sourcePath = path.join(ROOT, `${ name }/source.wxml`);
        const source = fs.readFileSync(sourcePath, 'utf8');
        const actual = parseForESLint(
            source,
            { filePath: sourcePath, ...PARSER_OPTIONS }
        );

        describe(`'test/fixtures/ast/${ name }/source.wxml'`, () => {
            it('should be parsed to valid AST.', () => {
                const resultPath = path.join(ROOT, `${ name }/ast.json`);
                const expected = fs.readFileSync(resultPath, 'utf8');

                expect(JSON.stringify(actual.ast, replacer, 4)).toStrictEqual(
                    expected
                );
            });

            it('should have correct range.', () => {
                const resultPath = path.join(ROOT, `${ name }/token-ranges.json`);
                const expectedText = fs.readFileSync(resultPath, 'utf8');
                const tokens = getAllTokens(actual.ast)
                    .map(t => source.slice(t.range[0], t.range[1]));
                const actualText = JSON.stringify(tokens, null, 4);

                expect(actualText).toStrictEqual(expectedText);
            });

            it('should have correct range on windows(CRLF).', () => {
                const sourceForWin = source.replace(/\r?\n/gu, '\r\n');
                const actualForWin = parseForESLint(
                    sourceForWin,
                    { filePath: sourcePath, ...PARSER_OPTIONS }
                );

                const resultPath = path.join(ROOT, `${ name }/token-ranges.json`);
                const expectedText = fs.readFileSync(resultPath, 'utf8');
                const tokens = getAllTokens(actualForWin.ast).map(t =>
                    sourceForWin
                        .slice(t.range[0], t.range[1])
                        .replace(/\r?\n/gu, '\n'));
                const actualText = JSON.stringify(tokens, null, 4);

                expect(actualText).toStrictEqual(expectedText);
            });

            it('should have correct location.', () => {
                const lines = source.match(/[^\r\n]*(?:\r?\n|$)/gu) || [];
                lines.push(String.fromCodePoint(0));
                for (const token of getAllTokens(actual.ast)) {
                    const line0 = token.loc.start.line - 1;
                    const line1 = token.loc.end.line - 1;
                    const column0 = token.loc.start.column;
                    const column1 = token.loc.end.column;
                    const expected = source.slice(
                        token.range[0],
                        token.range[1]
                    );

                    let text = '';
                    if (line0 === line1) {
                        text = lines[line0].slice(column0, column1);
                    }
                    else {
                        text = lines[line0].slice(column0);
                        for (let i = line0 + 1; i < line1; ++i) {
                            text += lines[i];
                        }
                        text += lines[line1].slice(0, column1);
                    }

                    expect(text).toStrictEqual(expected);
                }
            });

            it('should traverse AST in the correct order.', () => {
                const resultPath = path.join(ROOT, `${ name }/tree.json`);
                const expectedText = fs.readFileSync(resultPath, 'utf8');
                const tokens = getTree(source);
                const actualText = JSON.stringify(tokens, null, 4);

                expect(actualText).toStrictEqual(expectedText);
            });

            it('should have correct parent properties.', () => {
                validateParent(source);
            });

            if (/\berror\b/.test(name)) {
                it('should have error.', () => {
                    actual.ast.templateBody && expect(actual.ast.templateBody.errors.length > 0).toBeTruthy();
                });
            }
            else {
                it('should have no error.', () => {
                    actual.ast.templateBody && expect(actual.ast.templateBody.errors.length === 0).toBeTruthy();
                });
            }
        });
    }
});
