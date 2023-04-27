import assert from 'assert';
import { lint, fix } from './linter';

describe('html', function () {
    jest.setTimeout(6000);

    it('lint', async function () {
        const result = await lint('app.html', 'html');
        const [err1, err2, err3] = result;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'htmlint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'title-required', 'has rule');
        assert.strictEqual(err1.severity, 1, 'has severity');

        assert.ok(err2.line, 'has line');
        assert.ok(err2.column, 'has column');
        assert.strictEqual(err2.linter, 'htmlint', 'has linter');
        assert.ok(err2.message, 'has message');
        assert.strictEqual(err2.rule, 'charset', 'has rule');
        assert.strictEqual(err2.severity, 1, 'has severity');

        assert.ok(err3.line, 'has line');
        assert.ok(err3.column, 'has column');
        assert.strictEqual(err3.linter, 'htmlint', 'has linter');
        assert.ok(err3.message, 'has message');
        assert.strictEqual(err3.rule, 'max-len', 'has rule');
        assert.strictEqual(err3.severity, 1, 'has severity');
    });

    it('lint script', async function () {
        const result = await lint('app.html', 'html');
        const [,,, err1, err2, err3, err4, err5] = result;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'quotes', 'has rule');
        assert.strictEqual(err1.severity, 2, 'has severity');

        assert.ok(err2.line, 'has line');
        assert.ok(err2.column, 'has column');
        assert.strictEqual(err2.linter, 'eslint', 'has linter');
        assert.ok(err2.message, 'has message');
        assert.strictEqual(err2.rule, '@babel/semi', 'has rule');
        assert.strictEqual(err2.severity, 2, 'has severity');

        // TODO: 同一 html 多个 script 相互引用的问题，目前直接禁掉
        // assert.ok(err3.line, 'has line');
        // assert.ok(err3.column, 'has column');
        // assert.strictEqual(err3.linter, 'eslint', 'has linter');
        // assert.ok(err3.message, 'has message');
        // assert.strictEqual(err3.rule, 'no-unused-vars', 'has rule');
        // assert.strictEqual(err3.severity, 1, 'has severity');

        assert.ok(err3.line, 'has line');
        assert.ok(err3.column, 'has column');
        assert.strictEqual(err3.linter, 'eslint', 'has linter');
        assert.ok(err3.message, 'has message');
        assert.strictEqual(err3.rule, 'max-len', 'has rule');
        assert.strictEqual(err3.severity, 2, 'has severity');

        assert.ok(err4.line, 'has line');
        assert.ok(err4.column, 'has column');
        assert.strictEqual(err4.linter, 'eslint', 'has linter');
        assert.ok(err4.message, 'has message');
        assert.strictEqual(err4.rule, 'id-denylist', 'has rule');
        assert.strictEqual(err4.severity, 1, 'has severity');

        assert.ok(err5 == null, 'has no err7');

        console.log('html file done');
    });

    it('fix', async function () {
        const content = (await fix('app.html', 'html'))!;
        assert.ok(content.includes('<meta charset="utf-8">\n    <title>测试 </title>'), 'has fix title');

        assert.ok(content.includes('document.write(\'<h1>Hello World!</h1>\');'), 'has fix quotes and semi');
        assert.ok(content.includes('\n        function hello(name) {'), 'has fix indent');
        // eslint-disable-next-line no-template-curly-in-string
        assert.ok(content.includes('\n            return `welcome ${name}!`;'), 'has fix indent');
    });
});
