import assert from 'assert';
import { lint, fix } from './linter';

describe('js', function () {
    jest.setTimeout(6000);
    it('lint', async function () {
        const result = await lint('app.js', 'js', { silent: true });
        const [err1, err2, err3, err4] = result;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.ok(err1.rule.includes('no-unused-vars'), 'has rule');
        assert.strictEqual(err1.severity, 1, 'has severity');

        assert.ok(err2.line, 'has line');
        assert.ok(err2.column, 'has column');
        assert.strictEqual(err2.linter, 'eslint', 'has linter');
        assert.ok(err2.message, 'has message');
        assert.strictEqual(err2.rule, 'no-multi-spaces', 'has rule');
        assert.strictEqual(err2.severity, 2, 'has severity');

        assert.ok(err3.line, 'has line');
        assert.ok(err3.column, 'has column');
        assert.strictEqual(err3.linter, 'eslint', 'has linter');
        assert.ok(err3.message, 'has message');
        assert.strictEqual(err3.rule, 'class-methods-use-this', 'has rule');
        assert.strictEqual(err3.severity, 1, 'has severity');

        assert.ok(err4 == null, 'has no err4');

        console.log('js file done');
    });

    it('fix', async function () {
        const content = await fix('app.js', 'js', { silent: true });
        assert.ok(content!.includes('import fs from \'fs\';'), 'has fix whitespace');
    });
});

describe('var-whitespace', function () {
    jest.setTimeout(6000);
    it('lint', async function () {
        const result = await lint('var-whitespace.js', 'js', { silent: true });
        const [err1, err2, err3] = result;

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
        assert.strictEqual(err2.rule, 'no-multi-spaces', 'has rule');
        assert.strictEqual(err2.severity, 2, 'has severity');

        assert.ok(err3 == null, 'has no err4');

        console.log('js file done');
    });

    it('fix', async function () {
        const content = await fix('var-whitespace.js', 'js', { silent: true });
        assert.ok(content!.includes('const myVar = 1;'), 'has fix whitespace');
    });
});
