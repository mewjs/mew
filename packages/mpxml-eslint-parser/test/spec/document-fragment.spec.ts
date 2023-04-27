import fs from 'fs';
import path from 'path';
import { parseForESLint } from '../../src';

const ROOT = path.join(__dirname, '../fixtures/document-fragment');
const TARGETS = fs.readdirSync(ROOT);
const PARSER_OPTIONS = {
    comment: true,
    ecmaVersion: 2018,
    loc: true,
    range: true,
    tokens: true,
    sourceType: 'module',
};

/**
 * Remove `parent` properties from the given AST.
 * @param {string} key The key.
 * @param {any} value The value of the key.
 * @returns {any} The value of the key to output.
 */
function replacer(key, value) {
    if (key === 'parent') {
        return void 0;
    }
    if (key === 'errors' && Array.isArray(value)) {
        return value.map(e => ({
            message: e.message,
            index: e.index,
            lineNumber: e.lineNumber,
            column: e.column,
        }));
    }
    return value;
}


describe('services.getDocumentFragment', () => {
    for (const name of TARGETS) {
        const sourceFileName = fs
            .readdirSync(path.join(ROOT, name))
            .find(f => f.startsWith('source.'));

        const sourcePath = path.join(ROOT, `${ name }/${ sourceFileName }`);
        const source = fs.readFileSync(sourcePath, 'utf8');
        const result = parseForESLint(
            source,
            { filePath: sourcePath, ...PARSER_OPTIONS }
        );
        const actual = result.services?.getDocumentFragment();

        describe(`'test/fixtures/document-fragment/${ name }/${ sourceFileName }'`, () => {
            it('should be parsed to valid document fragment.', () => {
                const resultPath = path.join(
                    ROOT,
                    `${ name }/document-fragment.json`
                );
                const expected = fs.readFileSync(resultPath, 'utf8');

                expect(
                    JSON.stringify(actual, replacer, 4),
                ).toBe(expected);
            });
        });
    }
});
