import assert from 'assert';
import { lint, fix } from './linter';

describe('vue', function () {
    jest.setTimeout(20000);
    it('lint', async function () {
        const result = await lint('vue/app.vue', 'js');
        assert.ok(result.length > 0, 'has errors');
        const [err1, err2, , err3, err4] = result;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'vue/html-indent', 'has no vue syntax plugin');
        assert.strictEqual(err1.severity, 2, 'has severity');

        assert.ok(err2.line, 'has line');
        assert.ok(err2.column, 'has column');
        assert.strictEqual(err2.linter, 'eslint', 'has linter');
        assert.ok(err2.message, 'has message');
        assert.strictEqual(err2.rule, 'vue/component-definition-name-casing', 'has rule');
        assert.strictEqual(err2.severity, 1, 'has severity');

        assert.ok(err3.line, 'has line');
        assert.ok(err3.column, 'has column');
        assert.strictEqual(err3.linter, 'stylelint', 'has linter');
        assert.ok(err3.message, 'has message');
        assert.strictEqual(err3.rule, 'color-named', 'has rule');
        assert.strictEqual(err3.severity, 2, 'has severity');

        assert.ok(err4.line, 'has line');
        assert.ok(err4.column, 'has column');
        assert.strictEqual(err4.linter, 'stylelint', 'has linter');
        assert.ok(err4.message, 'has message');
        assert.strictEqual(err4.rule, '@mewjs/use-hex-color', 'has rule');
        assert.strictEqual(err4.severity, 2, 'has severity');

        console.log('vue file done');
    });

    it('fix', async function () {
        const content = await fix('vue/app.vue', 'js');
        assert.ok(content!.includes('color: #b94141;'), 'has fix color');
    });
});

describe('vue + typescript', function () {
    jest.setTimeout(10000);

    it('lint', async function () {
        const result = await lint('vue-ts/app.vue', 'js');
        assert.ok(result.length > 0, 'has errors');
        const [err1, err2] = result;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, '@typescript-eslint/no-explicit-any', 'has error');
        assert.strictEqual(err1.severity, 1, 'has severity');

        assert.ok(err2 == null, 'has no error');
        console.log('vue file done');
    });
});

describe('vue3', function () {
    jest.setTimeout(6000);

    it('lint', async function () {
        const result = await lint('vue3/app.vue', 'js');
        assert.ok(result.length > 0, 'has errors');
        const [err1, err2, err3] = result;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'vue/no-multi-spaces', 'has no vue syntax plugin');
        assert.strictEqual(err1.severity, 1, 'has severity');

        assert.ok(err2.line, 'has line');
        assert.ok(err2.column, 'has column');
        assert.strictEqual(err2.linter, 'stylelint', 'has linter');
        assert.ok(err2.message, 'has message');
        assert.strictEqual(err2.rule, '@mewjs/use-hex-color', 'has rule');
        assert.strictEqual(err2.severity, 2, 'has severity');

        assert.ok(err3 == null, 'has no error');
        console.log('vue file done');
    });

    it('fix', async function () {
        const content = await fix('vue3/app.vue', 'js');
        assert.ok(content!.includes('color: #b94141;'), 'has fix color');
    });
});


describe('vue3 composition', function () {
    jest.setTimeout(6000);

    it('lint', async function () {
        const result = await lint('vue3/Composition.vue', 'js');
        assert.ok(result.length > 0, 'has errors');
        const [err1, err2] = result;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'no-multi-spaces', 'has error');
        assert.strictEqual(err1.severity, 2, 'has severity');
        assert.ok(err2 == null, 'has no error');
        console.log('vue file done');
    });
});

describe('vue3 + typescript', function () {
    jest.setTimeout(6000);

    it('lint', async function () {
        const result = await lint('vue3-ts/app.vue', 'js');
        assert.ok(result.length > 0, 'has errors');
        const [err1, err2] = result;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'no-multi-spaces', 'has error');
        assert.strictEqual(err1.severity, 2, 'has severity');

        assert.ok(err2 == null, 'has no error');
        console.log('vue file done');
    });
});
