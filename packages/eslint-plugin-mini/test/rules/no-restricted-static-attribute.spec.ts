
// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-restricted-static-attribute';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

tester.run('mini/no-restricted-static-attribute', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: ''
        },
        {
            filename: 'page.wxml',
            code: '<block><view foo="foo"></view></block>'
        },
        {
            filename: 'page.wxml',
            code: '<block><view wx:foo="{{foo}}"></view></block>'
        },
        {
            filename: 'page.wxml',
            code: '<view><input bindinput="foo"></input></view>',
            options: ['foo']
        },
        {
            filename: 'page.wxml',
            code: '<block><view bar="foo"></view></block>',
            options: ['foo']
        },
        {
            filename: 'page.wxml',
            code: '<block><view wx:foo="{{foo}}"></view></block>',
            options: ['foo']
        },
        {
            filename: 'page.wxml',
            code: '<block><view foo="foo"></view></block>',
            options: [{ key: 'foo', value: 'bar' }]
        },
        {
            filename: 'page.wxml',
            code: '<block><view foo="foo"></view><input bar></block>',
            options: [{ key: 'foo', element: 'input' }]
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '<block><view foo="foo"></view></block>',
            options: ['foo'],
            errors: [
                {
                    message: 'Using `foo` is not allowed.',
                    line: 1,
                    column: 14
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<block><view foo="bar" bar="foo"></view></block>',
            options: ['foo'],
            errors: ['Using `foo` is not allowed.']
        },
        {
            filename: 'page.wxml',
            code: '<block><view foo="foo" bar="bar"></view></block>',
            options: ['/^f/'],
            errors: ['Using `foo` is not allowed.']
        },
        {
            filename: 'page.wxml',
            code: '<block><view foo="bar" bar="foo"></view></block>',
            options: ['foo', 'bar'],
            errors: ['Using `foo` is not allowed.', 'Using `bar` is not allowed.']
        },
        {
            filename: 'page.wxml',
            code: '<block><view foo="bar" bar></view></block>',
            options: [{ key: '/^(foo|bar)$/' }],
            errors: ['Using `foo` is not allowed.', 'Using `bar` is not allowed.']
        },
        {
            filename: 'page.wxml',
            code: '<block><view foo="foo" /><view foo="bar" /></block>',
            options: [{ key: 'foo', value: 'bar' }],
            errors: ['Using `foo="bar"` is not allowed.']
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view foo v bar /><view foo="foo" vv="foo" bar="vfoo" /><view vvv="foo" bar="vv" /></block>',
            options: [
                '/^vv/',
                { key: 'foo', value: true },
                { key: 'bar', value: '/^vv/' }
            ],
            errors: [
                'Using `foo` set to `true` is not allowed.',
                'Using `foo="foo"` is not allowed.',
                'Using `vv` is not allowed.',
                'Using `vvv` is not allowed.',
                'Using `bar="vv"` is not allowed.'
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view foo />
        <MyButton foo bar />
      </block>`,
            options: [{ key: 'foo', element: '/^My/' }],
            errors: ['Using `foo` on `<MyButton>` is not allowed.']
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view foo="x" />
      </block>`,
            options: ['/^f/', { key: 'foo' }],
            errors: ['Using `foo` is not allowed.']
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view foo="x" />
      </block>`,
            options: [{ key: 'foo', message: 'foo' }],
            errors: ['foo']
        }
    ]
});
