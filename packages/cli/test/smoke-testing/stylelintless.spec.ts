import assert from 'assert';
import { lint, fix } from './linter';

describe('less', function () {
    jest.setTimeout(6000);
    it('lint', async function () {
        const result = await lint('stylelint/app.less', 'less');
        const [, err1, err2, err3, err4] = result;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'stylelint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'color-named', 'has rule');
        assert.strictEqual(err1.severity, 2, 'has severity');

        assert.ok(err2.line, 'has line');
        assert.ok(err2.column, 'has column');
        assert.strictEqual(err2.linter, 'stylelint', 'has linter');
        assert.ok(err2.message, 'has message');
        assert.strictEqual(err2.rule, '@mewjs/use-hex-color', 'has rule');
        assert.strictEqual(err2.severity, 2, 'has severity');

        assert.ok(err3.line, 'has line');
        assert.ok(err3.column, 'has column');
        assert.strictEqual(err3.linter, 'stylelint', 'has linter');
        assert.ok(err3.message, 'has message');
        assert.strictEqual(err3.rule, 'max-line-length', 'has rule');
        assert.strictEqual(err3.severity, 2, 'has severity');

        assert.ok(err4.line, 'has line');
        assert.ok(err4.column, 'has column');
        assert.strictEqual(err4.linter, 'stylelint', 'has linter');
        assert.ok(err4.message, 'has message');
        assert.strictEqual(err4.rule, 'shorthand-property-no-redundant-values', 'has rule');
        assert.strictEqual(err4.severity, 2, 'has severity');

        console.log('scss file done');
    });

    it('fix', async function () {
        const content = await fix('stylelint/app.less', 'less');
        assert.ok(content!.includes('color: #b94141;'), 'has fix color');
    });
});

