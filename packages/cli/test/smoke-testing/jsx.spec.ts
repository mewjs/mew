import assert from 'assert';
import type { LintError } from '../../src/types';
import { lint, fix } from './linter';

const jsxHandler = (result: LintError[]) => {
    const [err1, err2, err3] = result;

    assert.ok(err1.line, 'has line');
    assert.ok(err1.column, 'has column');
    assert.strictEqual(err1.linter, 'eslint', 'has linter');
    assert.ok(err1.message, 'has message');
    assert.strictEqual(err1.rule, 'react/prefer-stateless-function', 'has rule');
    assert.strictEqual(err1.severity, 2, 'has severity');


    assert.ok(err2.line, 'has line');
    assert.ok(err2.column, 'has column');
    assert.strictEqual(err2.linter, 'eslint', 'has linter');
    assert.ok(err2.message, 'has message');
    assert.strictEqual(err2.rule, 'react/jsx-tag-spacing', 'has rule');
    assert.strictEqual(err2.severity, 2, 'has severity');

    assert.ok(err3.line, 'has line');
    assert.ok(err3.column, 'has column');
    assert.strictEqual(err3.linter, 'eslint', 'has linter');
    assert.ok(err3.message, 'has message');
    assert.strictEqual(err3.rule, 'space-in-parens', 'has rule');
    assert.strictEqual(err3.severity, 2, 'has severity');

    console.log('jsx file done');
};

describe('jsx lint fix', function () {
    jest.setTimeout(9000);
    it('lint js', async function () {
        const result = await lint('react/app.jsx', 'js');
        jsxHandler(result);
    });

    it('lint jsx', async function () {
        const result = await lint('react/app.jsx', 'jsx');
        jsxHandler(result);
    });

    it('jsx component', async function () {
        const result = await lint('react/component.jsx', 'jsx');
        assert.strictEqual(result.find(e => e.severity === 2), void 0, 'has no error');
    });

    it('jsx hooks', async function () {
        const result = await lint('react/hooks.jsx', 'jsx');
        assert.strictEqual(result.find(e => e.severity === 2), void 0, 'has no error');
    });

    it('fix', async function () {
        const content = await fix('react/app.jsx', 'jsx');
        assert.ok(
            content!.includes('document.body.appendChild(document.createElement(\'div\'))'),
            'has fix whitespace'
        );
    });
});


describe('jsx hooks', function () {
    jest.setTimeout(9000);
    it('lint useEffect', async function () {
        const result = await lint('react/effect.jsx', 'jsx');

        const [err1, err2, err3] = result;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, '@babel/no-invalid-this', 'has rule');
        assert.strictEqual(err1.severity, 1, 'has severity');

        assert.ok(err2.line, 'has line');
        assert.ok(err2.column, 'has column');
        assert.strictEqual(err2.linter, 'eslint', 'has linter');
        assert.ok(err2.message, 'has message');
        assert.strictEqual(err2.rule, 'react-hooks/exhaustive-deps', 'has rule');
        assert.strictEqual(err2.severity, 1, 'has severity');

        assert.strictEqual(err3, void 0, 'has no err');

    });

    // not support
    // it('fix useEffect', async function () {
    //     const content = await fix('react/effect.jsx', 'jsx');
    //     assert.ok(
    //         content.indexOf('}, [\'visible\'])') >= 0,
    //         'has fix useEffect'
    //     );
    // });
});
