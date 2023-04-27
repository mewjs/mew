import assert from 'assert';
import { lint, fix } from './linter';

describe('stylus', function () {
    jest.setTimeout(6000);
    it('lint', async function () {
        const result = await lint('stylelint/app.styl', 'stylus');
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
        assert.strictEqual(err3.rule, 'property-no-vendor-prefix', 'has rule');
        assert.strictEqual(err3.severity, 1, 'has severity');

        assert.ok(err4 == null, 'has no err3');

        console.log('stylus file done');
    });

    it('fix', async function () {
        const content = await fix('stylelint/app.styl', 'stylus');
        assert.ok(content!.includes('color: #b94141;'), 'has fix color');
    });
});
