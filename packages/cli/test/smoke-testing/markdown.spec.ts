import assert from 'assert';
import { lint, fix } from './linter';

describe('markdown', function () {
    jest.setTimeout(15000);

    it('lint', async function () {
        const result = await lint('app.md', 'markdown');

        expect(result.some(error => error.rule.includes('heading-style'))).toBeTruthy();
        expect(result.some(error => error.rule === '@babel/semi')).toBeTruthy();
        expect(result.some(error => error.rule === 'indentation')).toBeTruthy();
        expect(result.some(error => error.rule === 'declaration-block-trailing-semicolon')).toBeTruthy();
        expect(result.some(error => error.rule === '@mewjs/use-hex-color')).toBeTruthy();
        expect(result.some(error => error.rule === 'attr-value-double-quotes')).toBeTruthy();
    });

    it('fix', async function () {
        const content = (await fix('app.md', 'markdown'))!;
        assert.ok(!content.includes('### Loading `.yml` with `js-yaml`.'), 'has fix markdown');
        assert.ok(content.includes('import Manis from \'@mewjs/manis\';'), 'has fix typescript');
        assert.ok(content.includes('const yaml = require(\'js-yaml\');'), 'has fix javascript');
        assert.ok(content.includes('color: #f00;'), 'has fix css');
        assert.ok(content.includes('class="foo"'), 'has fix html');
    });
});
