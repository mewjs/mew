import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-useless-concat';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('no-useless-concat', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view class="{{
                "'foobar'"
            }}"></view>`
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view class="{{
                'foo' + 'bar'
            }}"></view>`,
            errors: [
                {
                    message: 'Unexpected string concatenation of literals.',
                }
            ]
        }
    ]
});
