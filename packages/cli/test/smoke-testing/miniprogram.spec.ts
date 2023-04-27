import assert from 'assert';
import { lint, fix } from './linter';

/* eslint-disable-next-line max-lines-per-function */
describe('miniprogram', function () {

    describe('app.json', function () {
        jest.setTimeout(6000);

        it('lint', async function () {
            const result = await lint('miniprogram/app.json', 'json');
            const [err1, err2] = result;

            assert.ok(err1.line, 'has line');
            assert.ok(err1.column, 'has column');
            assert.strictEqual(err1.linter, 'eslint', 'has linter');
            assert.ok(err1.message, 'has message');
            assert.strictEqual(err1.rule, '@mewjs/mini/app-config-acceptable', 'has rule');
            assert.strictEqual(err1.severity, 2, 'has severity');

            assert.ok(err2 == null, 'has no new error');
            console.log('app json file done');
        });
    });

    describe('js', function () {
        jest.setTimeout(6000);

        it('lint', async function () {
            const result = await lint('miniprogram/app.js', 'js');
            const [err1, err2] = result;

            assert.ok(err1.line, 'has line');
            assert.ok(err1.column, 'has column');
            assert.strictEqual(err1.linter, 'eslint', 'has linter');
            assert.ok(err1.message, 'has message');
            assert.strictEqual(err1.rule, 'space-before-function-paren', 'has rule');
            assert.strictEqual(err1.severity, 2, 'has severity');

            assert.ok(err2 == null, 'has no new error');

            console.log('js file done');
        });
    });

    describe('wxs', function () {
        jest.setTimeout(6000);

        it('lint', async function () {
            const result = await lint('miniprogram/page/indent/index.wxs', 'wxs');
            const [err1, err2] = result;

            assert.ok(err1.line, 'has line');
            assert.ok(err1.column, 'has column');
            assert.strictEqual(err1.linter, 'eslint', 'has linter');
            assert.ok(err1.message, 'has message');
            assert.strictEqual(err1.rule, '@babel/semi', 'has rule');
            assert.strictEqual(err1.severity, 2, 'has severity');

            assert.ok(err2 == null, 'has no new error');

            console.log('wxs file done');
        });


        it('fix', async function () {
            const content = await fix('miniprogram/page/indent/index.wxs', 'wxs');
            assert.ok(content!.includes('const msg = \'hello world\';'), 'has fix semi');
        });
    });

    describe('wxml', function () {
        jest.setTimeout(6000);

        it('lint', async function () {
            const result = await lint('miniprogram/page/indent/index.wxml', 'wxml');
            const [err1, err2, err3] = result;

            assert.ok(err1.line, 'has line');
            assert.ok(err1.column, 'has column');
            assert.strictEqual(err1.linter, 'eslint', 'has linter');
            assert.ok(err1.message, 'has message');
            assert.strictEqual(err1.rule, '@babel/semi', 'has rule');
            assert.strictEqual(err1.severity, 2, 'has severity');


            assert.ok(err2.line, 'has line');
            assert.ok(err2.column, 'has column');
            assert.strictEqual(err2.linter, 'eslint', 'has linter');
            assert.ok(err2.message, 'has message');
            assert.strictEqual(err2.rule, '@mewjs/mini/no-duplicate-attributes', 'has rule');
            assert.strictEqual(err2.severity, 2, 'has severity');

            assert.ok(err3 == null, 'has no new error');

            console.log('wxs file done');
        });


        it('fix', async function () {
            const content = await fix('miniprogram/page/indent/index.wxml', 'wxml');
            assert.ok(content!.includes('var someMsg = \'hello world\';'), 'has fix semi');
        });
    });


    describe('axml', function () {
        jest.setTimeout(6000);

        it('lint', async function () {
            const result = await lint('miniprogram/page/indent/index.axml', 'axml');
            const [err1, err2, err3, err4] = result;

            assert.ok(err1.line, 'has line');
            assert.ok(err1.column, 'has column');
            assert.strictEqual(err1.linter, 'eslint', 'has linter');
            assert.ok(err1.message, 'has message');
            assert.strictEqual(err1.rule, '@mewjs/mini/no-useless-mustache', 'has rule');
            assert.strictEqual(err1.severity, 2, 'has severity');

            assert.ok(err2.line, 'has line');
            assert.ok(err2.column, 'has column');
            assert.strictEqual(err2.linter, 'eslint', 'has linter');
            assert.ok(err2.message, 'has message');
            assert.strictEqual(err2.rule, '@mewjs/mini/eqeqeq', 'has rule');
            assert.strictEqual(err2.severity, 2, 'has severity');

            assert.ok(err3.line, 'has line');
            assert.ok(err3.column, 'has column');
            assert.strictEqual(err3.linter, 'eslint', 'has linter');
            assert.ok(err3.message, 'has message');
            assert.strictEqual(err3.rule, '@mewjs/mini/mustache-interpolation-spacing', 'has rule');
            assert.strictEqual(err3.severity, 2, 'has severity');

            assert.ok(err4 == null, 'has no new error');

            console.log('axml file done');
        });

        it('fix', async function () {
            const content = await fix('miniprogram/page/indent/index.axml', 'axml');
            assert.ok(content!.includes('{{itemFixable}}'), 'has fix');
        });
    });


    describe('swan', function () {
        jest.setTimeout(6000);

        it('lint', async function () {
            const result = await lint('miniprogram/page/indent/index.swan', 'swan');
            const [err1, err2, err3, err4] = result;

            assert.ok(err1.line, 'has line');
            assert.ok(err1.column, 'has column');
            assert.strictEqual(err1.linter, 'eslint', 'has linter');
            assert.ok(err1.message, 'has message');
            assert.strictEqual(err1.rule, '@mewjs/mini/no-useless-mustache', 'has rule');
            assert.strictEqual(err1.severity, 2, 'has severity');

            assert.ok(err2.line, 'has line');
            assert.ok(err2.column, 'has column');
            assert.strictEqual(err2.linter, 'eslint', 'has linter');
            assert.ok(err2.message, 'has message');
            assert.strictEqual(err2.rule, '@mewjs/mini/eqeqeq', 'has rule');
            assert.strictEqual(err2.severity, 2, 'has severity');

            assert.ok(err3.line, 'has line');
            assert.ok(err3.column, 'has column');
            assert.strictEqual(err3.linter, 'eslint', 'has linter');
            assert.ok(err3.message, 'has message');
            assert.strictEqual(err3.rule, '@mewjs/mini/mustache-interpolation-spacing', 'has rule');
            assert.strictEqual(err3.severity, 2, 'has severity');

            assert.ok(err4 == null, 'has no new error');
            console.log('swan file done');
        });

        it('fix', async function () {
            const content = await fix('miniprogram/page/indent/index.swan', 'swan');
            assert.ok(content!.includes('{{itemFixable}}'), 'has fix eqeqeq');
        });
    });

    describe('wxss', function () {
        jest.setTimeout(6000);

        it('lint', async function () {
            const result = await lint('miniprogram/page/indent/index.wxss', 'wxml');
            const [err1, err2] = result;

            assert.ok(err1.line, 'has line');
            assert.ok(err1.column, 'has column');
            assert.strictEqual(err1.linter, 'stylelint', 'has linter');
            assert.ok(err1.message, 'has message');
            assert.strictEqual(err1.rule, 'color-hex-length', 'has rule');
            assert.strictEqual(err1.severity, 2, 'has severity');


            assert.ok(err2 == null, 'has no new error');

            console.log('wxss file done');
        });
    });

});
