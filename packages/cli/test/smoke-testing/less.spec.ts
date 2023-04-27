import assert from 'assert';
import { lint, fix } from './linter';

describe('less', function () {
    jest.setTimeout(6000);
    it('lint', async function () {
        const result = await lint('app.less', 'less');
        const [, err1, err2, err3] = result;

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

        assert.ok(err3 == null, 'has no err3');

        console.log('less file done');
    });

    it('fix', async function () {
        const content = await fix('app.less', 'less');
        assert.ok(content!.includes('color: #b94141;'), 'has fix color');
    });
});
