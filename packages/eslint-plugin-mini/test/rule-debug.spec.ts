import { RuleTester } from 'eslint';
import rule from '../src/rules/component-attributes';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('mini/component-attributes', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view class="className"></view>'
        }
    ],

    invalid: []
});
