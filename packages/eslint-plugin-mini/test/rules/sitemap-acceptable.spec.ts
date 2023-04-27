import { RuleTester } from 'eslint';
import rule from '../../src/rules/sitemap-acceptable';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('sitemap-acceptable', rule, {
    valid: [
        {
            filename: 'sitemap.json',
            code: `
{
}`
        },
        {
            filename: 'sitemap.json',
            code: `
{
    "desc": "关于本文件的更多信息，请参考文档 https://developers.weixin.qq.com/miniprogram/dev/framework/sitemap.html",
    "rules": [
        {
            "action": "allow",
            "page": "*",
            "params: ["abc"]
        }
    ]
}`
        },
    ],
    invalid: [
        {
            filename: 'sitemap.json',
            code: `
{
    "desc": 123
}
            `,
            errors: [
                {
                    message: 'is not of a type(s) string'
                }
            ]
        },
        {
            filename: 'sitemap.json',
            code: `
{
    "desc": "desc",
    "rules": [123]
}
            `,
            errors: [
                {
                    message: 'is not of a type(s) object'
                }
            ]
        },
        {
            filename: 'sitemap.json',
            code: `
{
    "rules": [
        {
            "action": "allow"
        }
    ]
}`,
            errors: [
                {
                    message: 'requires property "page"'
                }
            ]
        },
        {
            filename: 'sitemap.json',
            code: `
{
    "rules": [
        {
            "page": "page"
        }
    ]
}`,
            errors: [
                {
                    message: 'requires property "action"'
                }
            ]
        }
    ]
});
