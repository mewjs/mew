import assert from 'assert';
import { lint, fix } from './linter';

describe('tsx lint fix', function () {
    jest.setTimeout(6000);
    it('lint', async function () {
        const result = await lint('tsx/app.tsx', 'tsx');
        const [err1, err2, err3, err4] = result;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'no-multi-spaces', 'has rule');
        assert.strictEqual(err1.severity, 2, 'has severity');

        assert.ok(err2.line, 'has line');
        assert.ok(err2.column, 'has column');
        assert.strictEqual(err2.linter, 'eslint', 'has linter');
        assert.ok(err2.message, 'has message');
        assert.strictEqual(err2.rule, '@typescript-eslint/type-annotation-spacing', 'has rule');
        assert.strictEqual(err2.severity, 2, 'has severity');

        assert.ok(err3.line === 26, 'has line');
        assert.ok(err3.column, 'has column');
        assert.strictEqual(err3.linter, 'eslint', 'has linter');
        assert.ok(err3.message, 'has message');
        assert.strictEqual(err3.rule, '@typescript-eslint/prefer-return-this-type', 'has rule');
        assert.strictEqual(err3.severity, 2, 'has severity');

        assert.ok(err4 == null, 'has no error');
        console.log('tsx file done');
    });

    it('lint component', async function () {
        const result = await lint('tsx/component.tsx', 'tsx');
        const [err1] = result;
        assert.ok(err1 == null, 'has no error');
        console.log('tsx file done');
    });


    it('fix', async function () {
        const content = await fix('ts/app.ts', 'ts');
        assert.ok(content!.includes('return this.name;'), 'has fix whitespace');
    });
});
