import assert from 'assert';
import { lint, fix } from './linter';

describe('ts', function () {
    jest.setTimeout(6000);
    it('lint', async function () {
        const result = await lint('ts/app.ts', 'ts');
        const [err1, err2] = result;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'no-multi-spaces', 'has rule');
        assert.strictEqual(err1.severity, 2, 'has severity');

        assert.ok(err2 == null, 'has no error');

        console.log('ts file done');
    });

    it('fix', async function () {
        const content = await fix('ts/app.ts', 'ts');
        assert.ok(content!.includes('return this.name;'), 'has fix whitespace');
    });
});

describe('d.ts ts definitions file', function () {
    jest.setTimeout(6000);
    it('lint', async function () {
        const result = await lint('ts/typing.d.ts', 'ts');
        const [err1, err2] = result;
        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, '@typescript-eslint/triple-slash-reference', 'has rule');
        assert.strictEqual(err1.severity, 1, 'has severity');

        assert.ok(err2.line, 'has line');
        assert.ok(err2.column, 'has column');
        assert.strictEqual(err2.linter, 'eslint', 'has linter');
        assert.ok(err2.message, 'has message');
        assert.strictEqual(err2.rule, 'no-multi-spaces', 'has rule');
        assert.strictEqual(err2.severity, 2, 'has severity');


        console.log('ts file done');
    });

    it('fix', async function () {
        const content = await fix('ts/typing.d.ts', 'ts');
        assert.ok(content!.includes('declare module \'vinyl\';'), 'has fix whitespace');
    });
});

describe('d.ts ts definitions file with js eslintrc', function () {
    jest.setTimeout(6000);
    it('lint', async function () {
        const result = await lint('app/index.d.ts', 'ts');
        const [err1] = result;
        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'no-multi-spaces', 'has rule');
        assert.strictEqual(err1.severity, 2, 'has severity');
        console.log('ts file done');
    });
});

describe('d.ts ts definitions file parse error with js eslintrc', function () {
    jest.setTimeout(6000);
    it('lint', async function () {
        const result = await lint('app/typing.d.ts', 'ts');
        const [err1] = result;
        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'syntax', 'has rule');
        assert.strictEqual(err1.severity, 2, 'has severity');
        console.log('ts file done');
    });
});
