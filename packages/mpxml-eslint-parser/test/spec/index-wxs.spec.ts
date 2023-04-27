import { parseForESLint } from '../../src';
import { Linter } from '../fixtures/eslint';

describe('parse', () => {
    it('parse wxs', () => {
        const result = parseForESLint(`/* wxs */
var abc = 'abc';
module.exports = abc + 'def';`, {
            filePath: 'page.wxs',
            ecmaVersion: 2018,
            sourceType: 'module'
        });
        expect(result.services?.defineTemplateBodyVisitor).toBeDefined();
        expect(result.services?.getDocumentFragment).toBeDefined();
        expect(result.services?.getTemplateBodyTokenStore).toBeDefined();
        expect(result.ast.body).toBeDefined();
        expect(result.ast.comments).toBeDefined();

        expect(result.ast.comments[0].value).toBe(' wxs ');
        expect(result.ast.body.length).toBe(2);
        expect(result.ast.tokens?.length).toBe(13);
    });

    it('parse js', () => {
        const result = parseForESLint(`/* js */
const abc = 'abc';
module.exports = abc + 'def';`, {
            filePath: 'page.js',
            ecmaVersion: 2018,
            sourceType: 'module'
        });

        expect(result.services.defineTemplateBodyVisitor).toBeDefined();
        expect(result.services.getDocumentFragment).toBeDefined();
        expect(result.services.getTemplateBodyTokenStore).toBeDefined();
        expect(result.ast.body).toBeDefined();
        expect(result.ast.comments).toBeDefined();

        expect(result.ast.comments[0].value).toBe(' js ');
        expect(result.ast.body.length).toBe(2);
        expect(result.ast.tokens.length).toBe(13);
    });
});

describe('lint', () => {
    const linter = new Linter();
    // @ts-expect-error
    linter.defineParser('mpxml-eslint-parser', { parseForESLint });
    linter.defineRule(
        'mpxml/no-var',
        require('../example/rules/no-var')
    );

    it('lint wxs', () => {
        const code = `var abc = 'abc';
module.exports = abc + 'def';`;

        const config = {
            parser: 'mpxml-eslint-parser',
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module'
            },
            rules: {
                'mpxml/no-var': 'error',
            },
        } as any;
        const messages = linter.verify(code, config, 'test.wxs');

        expect(messages.length).toBe(1);
        expect(messages[0].ruleId).toBe('mpxml/no-var');
    });

    it('lint js', () => {
        const code = `var abc = 'abc';
module.exports = abc + 'def';`;

        const config = {
            parser: 'mpxml-eslint-parser',
            parserOptions: {
                parser: 'babel-eslint',
                ecmaVersion: 2018,
                sourceType: 'module'
            },
            rules: {
                'mpxml/no-var': 'error',
            },
        } as any;
        const messages = linter.verify(code, config, 'test.js');

        expect(messages.length).toBe(1);
        expect(messages[0].ruleId).toBe('mpxml/no-var');
    });
});
