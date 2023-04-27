import { parseForESLint } from '../../src';
import { Linter } from '../fixtures/eslint';

describe('parse', () => {
    it('parse json', () => {
        const result = parseForESLint(`
{
    "pages": [],
    "window": {},
    "style": {}
}`, {
            filePath: 'app.json',
            ecmaVersion: 2018,
            sourceType: 'module'
        });
        expect(result.services?.defineTemplateBodyVisitor).toBeDefined();
        expect(result.services?.getDocumentFragment).toBeDefined();
        expect(result.services?.getTemplateBodyTokenStore).toBeDefined();
        expect(result.ast.body).toBeDefined();
        expect(result.ast.comments).toBeDefined();
        expect(result.ast.templateBody).toBeDefined();

        expect(result.ast.templateBody?.children.length).toBe(1);
        expect(result.ast.templateBody?.tokens.length).toBe(16);
    });
});

describe('lint', () => {
    const linter = new Linter();
    // @ts-expect-error
    linter.defineParser('mpxml-eslint-parser', { parseForESLint });
    linter.defineRule(
        'mpxml/app-config-acceptable',
        require('../example/rules/app-config-acceptable')
    );

    it('lint app.json', () => {
        const code = `
{
    "pages": []
}`;

        const config = {
            parser: 'mpxml-eslint-parser',
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module'
            },
            rules: {
                'mpxml/app-config-acceptable': 'error',
            },
        } as any;

        const messages = linter.verify(code, config, 'app.json');

        expect(messages.length).toBe(1);
        expect(messages[0].ruleId).toBe('mpxml/app-config-acceptable');
        expect(messages[0].message).toBe('require field \'window\' in app config');
    });
});
