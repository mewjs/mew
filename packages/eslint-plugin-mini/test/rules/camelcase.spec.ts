import { RuleTester } from 'eslint';
import rule from '../../src/rules/camelcase';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('camelcase', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                myPref
            }}
            </view>`
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                () => {
                    {my_pref} = x
                }
            }}
            </view>`,
            options: [{ ignoreDestructuring: true }]
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                my_pref
            }}
            </view>`,
            errors: [
                {
                    message: 'Identifier \'my_pref\' is not in camel case.',
                    line: 3
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                my_pref
            }}
            </view>`,
            errors: [
                {
                    message: 'Identifier \'my_pref\' is not in camel case.',
                    line: 3
                }
            ]
        }
    ]
});
