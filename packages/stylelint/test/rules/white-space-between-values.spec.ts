import rule from '../../src/rules/white-space-between-values';
import customSyntax from './stylus';

const { ruleName, messages } = rule;

testMewRule({
    ruleName,
    config: false,
    skipBasicChecks: true,
    codeFilename: './test.styl',
    customSyntax,

    accept: [
        {
            code: `
            .Foo
                $padding: 1px 1px 1px 1px
            `
        },
        {
            code: `
            .Foo
                @padding = 1px
            `
        }
    ],

    reject: []
});

testMewRule({
    ruleName,
    config: false,
    skipBasicChecks: true,

    accept: [
        {
            code: `/** @define Foo */
            .Foo {
                padding:   1px   1px;
            }`
        }
    ],

    reject: []
});

testMewRule({
    ruleName,
    config: true,
    skipBasicChecks: true,

    accept: [
        { code: '/** @define Foo */ .Foo {padding: 1px 1px 1px 1px;}' },
        { code: '/** @define Foo */ .Foo {padding: 1em 1em 1em;}' },
        { code: '/** @define Foo */ .Foo {padding: 1rem 1rem;}' },
        { code: '/** @define Foo */ .Foo-bar {padding: 1pt;}' },
        { code: '@font-face {src: url("OpenSans-Regular-web.ttf"),\n    url("OpenSans-Regular-web.eot");}' },
        {
            code: `
            @font-face {
                src: url(./iconfont.eot?t=1561821154036); /* IE9 */
                src: url("OpenSans-Regular-web.ttf") format("embedded-opentype"), /* comment */
                    url("OpenSans-Regular-web.eot");
            }`
        }
    ],

    reject: [
        {
            code: `/** @define Foo */
            .Foo {
                padding:   1px   1px;
            }`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                padding: 10%\n\n1px;
            }`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                background: url( "./url" )  1px 1px;
            }`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            @font-face {
                src: url("OpenSans-Regular-web.ttf"),

                url("OpenSans-Regular-web.eot");
            }
            `,
            message: messages.expected(),
            line: 3
        }
    ]
});

testMewRule({
    ruleName,
    config: true,
    skipBasicChecks: true,
    fix: true,

    accept: [
        {
            code: `
            a {
                padding: 1px  ;
            }`,
            description: 'spaces between value and semi should be ok'
        },
        {
            code: `
            a {
                margin: 1px
                        2px;
            }`,
            description: 'align value should be ok'
        }
    ],

    reject: [
        {
            code: `
            a {
                padding: 1px  1px 2px 3px;
            }`,
            fixed: `
            a {
                padding: 1px 1px 2px 3px;
            }`,
            line: 3,
            message: messages.expected()
        },
        {
            code: `
            a {
                padding: 1px 1px     2px 3px;
            }`,
            fixed: `
            a {
                padding: 1px 1px 2px 3px;
            }`,
            line: 3,
            message: messages.expected()
        },
        {
            code: `
            a {
                margin: 1px
3px;
            }`,
            fixed: `
            a {
                margin: 1px 3px;
            }`,
            line: 3,
            message: messages.expected()
        },
        {
            code: `
            a {
                color: hsla(1,  10%, 10%,1);
            }`,
            fixed: `
            a {
                color: hsla(1, 10%, 10%,1);
            }`,
            line: 3,
            message: messages.expected()
        },
    ]
});
