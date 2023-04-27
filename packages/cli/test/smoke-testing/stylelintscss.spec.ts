import assert from 'assert';
import { lint, fix } from './linter';

describe('scss', function () {
    jest.setTimeout(6000);
    it('lint', async function () {
        const result = await lint('stylelint/app.scss', 'scss');
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

        assert.ok(err4 == null, 'has no err3');

        console.log('scss file done');
    });

    it('fix', async function () {
        const content = await fix('stylelint/app.scss', 'scss');
        assert.ok(content!.includes('color: #b94141;'), 'has fix color');
    });
});

