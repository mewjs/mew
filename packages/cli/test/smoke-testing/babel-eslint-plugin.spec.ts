import { lint } from './linter';

describe('babel-eslint-plugin', function () {
    jest.setTimeout(6000);

    it('lint', async () => {
        const result = await lint('eslint-plugin-babel-deprecated/case.js', 'js', { silent: true });
        const [err1, err2, err3, err4, err5, err6, err7] = result;

        expect(err1.line).toBeDefined();
        expect(err1.column).toBeDefined();
        expect(err1.linter).toBe('eslint');
        expect(err1.message)
            .toBe('rule \'babel/new-cap\' has been deprecated, use \'@babel/new-cap\' instead.');
        expect(err1.rule).toBe('babel/new-cap');
        expect(err1.severity).toBe(1);

        expect(err2.line).toBeDefined();
        expect(err2.column).toBeDefined();
        expect(err2.linter).toBe('eslint');
        expect(err2.rule).toBe('@babel/new-cap');
        expect(err2.severity).toBe(2);

        expect(err3.line).toBeDefined();
        expect(err3.column).toBeDefined();
        expect(err3.linter).toBe('eslint');
        expect(err3.message)
            .toBe('rule \'babel/camelcase\' has been deprecated, use \'camelcase\' instead.');
        expect(err3.rule).toBe('babel/camelcase');
        expect(err3.severity).toBe(1);

        expect(err4.line).toBeDefined();
        expect(err4.column).toBeDefined();
        expect(err4.linter).toBe('eslint');
        expect(err4.rule).toBe('camelcase');
        expect(err4.severity).toBe(2);

        expect(err5.line).toBeDefined();
        expect(err5.column).toBeDefined();
        expect(err5.linter).toBe('eslint');
        expect(err5.message).toBe('rule \'babel/quotes\' has been deprecated, use \'quotes\' instead.');
        expect(err5.rule).toBe('babel/quotes');
        expect(err5.severity).toBe(1);

        expect(err6.line).toBeDefined();
        expect(err6.column).toBeDefined();
        expect(err6.linter).toBe('eslint');
        expect(err6.rule).toBe('quotes');
        expect(err6.severity).toBe(2);

        expect(err7 == null).toBeDefined();

        console.log('babel-eslint-plugin file done');
    });
});
