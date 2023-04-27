import { parseForESLint } from '@mewjs/mpxml-eslint-parser';

describe('mpxml-eslint-parser', () => {
    it('parseForESLint', () => {
        const result = parseForESLint(`<view>
            {{text}}
        </view>`, {
            filePath: 'page.wxml'
        });

        expect(result).toBeDefined();
        expect(result.ast.type).toBe('Program');
        expect(result.ast.sourceType).toBe('script');
        expect(result.ast.templateBody!.type).toBe('XDocumentFragment');
        expect(result.ast.templateBody!.children.length).toBe(1);
        expect(result.ast.templateBody!.children[0].type).toBe('XElement');

        expect(typeof result.services!.defineTemplateBodyVisitor).toBe('function');
        expect(typeof result.services!.getTemplateBodyTokenStore).toBe('function');
        expect(typeof result.services!.getDocumentFragment).toBe('function');

        // console.log(result);
        // console.log(result.ast.templateBody);


    });
});
