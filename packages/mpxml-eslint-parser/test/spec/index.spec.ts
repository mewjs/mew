import { parseForESLint } from '../../src';
import { Linter } from '../fixtures/eslint';

describe('parse', () => {
    it('parse wxml', () => {
        const result = parseForESLint('<!--wxml--><view wx:if="{{cond}}"></view>', {
            filePath: 'page.wxml',
            ecmaVersion: 2018,
            sourceType: 'module'
        });
        expect(result.services.defineTemplateBodyVisitor).toBeDefined();
        expect(result.services.getDocumentFragment).toBeDefined();
        expect(result.services.getTemplateBodyTokenStore).toBeDefined();
        expect(result.ast.body).toBeDefined();
        expect(result.ast.comments).toBeDefined();
        expect(result.ast.templateBody).toBeDefined();
        expect(result.ast.templateBody.children).toBeDefined();
        expect(result.ast.templateBody.comments).toBeDefined();
        expect(result.ast.templateBody.tokens).toBeDefined();

        expect(result.ast.templateBody.comments[0].value).toBe('wxml');
        expect(result.ast.templateBody.children.length).toBe(1);
        expect(result.ast.templateBody.tokens.length).toBe(11);
    });
});


describe('lint', () => {
    const linter = new Linter();
    // @ts-expect-error
    linter.defineParser('mpxml-eslint-parser', { parseForESLint });
    linter.defineRule(
        'mpxml/no-duplicate-attributes',
        require('../example/rules/no-duplicate-attributes')
    );

    it('lint wxml', () => {
        const code = '<view class="a" class="b">Hello</view>';
        const config = {
            parser: 'mpxml-eslint-parser',
            parserOptions: {
                parser: false,
            },
            rules: {
                'mpxml/no-duplicate-attributes': 'error',
            },
        } as any;
        const messages = linter.verify(code, config, 'test.wxml');

        expect(messages.length).toBe(1);
        expect(messages[0].ruleId).toBe('mpxml/no-duplicate-attributes');
    });
});
