import { RuleTester } from 'eslint';
import rule from '../../src/rules/eqeqeq';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('eqeqeq', rule, {
    valid: [
        {
            code: '<view wx:if="{{a === b}}"></view>',
            options: ['always'],
            filename: 'page.wxml'
        },
        {
            code: '<view wx:if="{{typeof a === \'number\'}}"></view>',
            options: ['smart'],
            filename: 'page.wxml'
        },
        {
            code: '<view wx:if="{{null === null}}"></view>',
            options: ['always'],
            filename: 'page.wxml'
        },
        {
            code: '<view wx:if="{{a == null}}"></view>',
            options: ['allow-null'],
            filename: 'page.wxml'
        },
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{a == b}}"></view>',
            errors: [
                {
                    message: 'Expected \'===\' and instead saw \'==\'.',
                    type: 'BinaryExpression',
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{a != b}}"></view>',
            errors: [
                {
                    message: 'Expected \'!==\' and instead saw \'!=\'.',
                    type: 'BinaryExpression'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{a == null}}"></view>',
            errors: [
                {
                    message: 'Expected \'===\' and instead saw \'==\'.',
                    type: 'BinaryExpression',
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{a != null}}"></view>',
            errors: [
                {
                    message: 'Expected \'!==\' and instead saw \'!=\'.',
                    type: 'BinaryExpression',
                    line: 1,
                    column: 18
                }
            ]
        },
    ]
});
