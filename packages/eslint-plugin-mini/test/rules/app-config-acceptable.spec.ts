import { RuleTester } from 'eslint';
import rule from '../../src/rules/app-config-acceptable';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('app-config-acceptable', rule, {
    valid: [
        {
            filename: 'app.json',
            code: `
{
    "pages": ["pages/page"],
    "window": {}
}`
        },
        {
            filename: 'app.json',
            code: `
{
    "pages": [
        "pages/index/index"
    ],
    "subpackages": [
        {
            "root": "important",
            "pages": [
                "index"
            ]
        },
        {
            "root": "indep",
            "pages": [
                "index"
            ],
            "independent": true
        }
    ],
    "preloadRule": {
        "pages/index": {
            "network": "all",
            "packages": [
                "important"
            ]
        },
        "sub1/index": {
            "packages": [
                "hello",
                "sub3"
            ]
        }
    },
    "window": {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "black",
        "navigationBarTitleText": "微信接口功能演示",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    },
    "tabBar": {
        "list": [
            {
                "pagePath": "pages/index/index",
                "text": "首页"
            },
            {
                "pagePath": "pages/logs/logs",
                "text": "日志"
            }
        ]
    },
    "networkTimeout": {
        "request": 10000,
        "downloadFile": 10000
    },
    "debug": true,
    "useExtendedLib": {
        "kbone": true,
        "weui": true
    },
    "entranceDeclare": {
        "locationMessage": {
            "path": "pages/index/index",
            "query": "foo=bar"
        }
    },
    "permission": {
        "scope.userLocation": {
            "desc": "你的位置信息将用于小程序位置接口的效果展示"
        }
    }
}`
        },
    ],
    invalid: [
        {
            filename: 'app.json',
            code: `
{
    "pages": ["pages/page"]
}
            `,
            errors: [
                {
                    message: 'requires property "window"'
                }
            ]
        },
        {
            filename: 'app.json',
            code: `
{
    "pages": [123],
    "window": {
        "navigationBarBackgroundColor": "color"
    }
}
            `,
            errors: [
                {
                    message: 'is not of a type(s) string'
                },
                {
                    message: 'does not match pattern "^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$"'
                }
            ]
        },
        {
            filename: 'app.json',
            code: `
{
    "pages": ["abc"],
    "window": {},
    "tabBar": {
        "list": [
            {
                "text": "abc"
            }
        ]
    }
}
            `,
            errors: [
                {
                    message: 'does not meet minimum length of 2'
                },
                {
                    message: 'requires property "pagePath"'
                }
            ]
        }
    ]
});
