import rule from '../../src/rules/strict-values';
import customSyntax from './stylus';

const { ruleName, messages } = rule;

testMewRule({
    ruleName,
    config: false,
    skipBasicChecks: true,

    accept: [
        {
            code: `
            .Foo-Bar {
                transform: rotate(1);
            }`
        },

    ],

    reject: [
    ]
});

testMewRule({
    ruleName,
    config: { preset: 'suit' },
    skipBasicChecks: true,

    accept: [
        { code: '/** @define Foo */ .Foo {padding: 1px 1px 1px 1px;}' },
        { code: '/** @define Foo */ .Foo {padding: 1em 1em 1em;}' },
        { code: '/** @define Foo */ .Foo {padding: 1rem 1rem;}' },
        { code: '/** @define Foo */ .Foo {padding: 1pt;}' },
        { code: '/** @define Foo */ .Foo {color: #ccc;}' },
        { code: '/** @define Foo */ .Foo {--color: #ccc;color: var(--color);}' },
        { code: '/** @define Foo */ .Foo {color: var(--color);}' },
        { code: '/** @define Foo */ .Foo {font-display: auto;}' },
        { code: '/** @define Foo */ .Foo {font-display:   optional}' },
        { code: '/** @define Foo */ .Foo {margin: 1vmax 1vmin;}' },

        /* less */
        // { code: '/** @define Foo */ .Foo {\n.color(@color);\n}' },
        { code: '/** @define Foo */ .Foo {color: @color;}' },
        { code: '/** @define Foo */ .Foo {color: range (#000, #fff);}' },
        { code: '/** @define Foo */ @itemMargin: 3px; .Foo {margin: 0 -@itemMargin -@itemMargin 0;}' },
        { code: '/** @define Foo */ @primary: #ccc; .Foo {@color: primary; &-element {color: @@color;}}' },
        { code: '/** @define Foo */ .Foo {color: #ccc; &-element {color: $color;}}' },
        { code: '/** @define Foo */ .mixin(dark; @color) {.Foo {color: darken(@color, 10%);}}' },
        { code: '/** @define Foo */ @primary: #ccc; .Foo {background-image: linear-gradient(@primary, #eee);}' },
        { code: '/** @define Foo */ @deg: 90deg; .Foo {background-image: linear-gradient(-@deg, #ccc, #eee);}' },

        /* sass */
        { code: '/** @define Foo */ .Foo {$color: #ccc;}' },
        { code: '/** @define Foo */ .Foo {color: $color;}' },


        /* stylus */
        { code: '/** @define Foo */ .Foo {padding: arguments 1px;}' },
        { code: '/** @define Foo */ $itemMargin: 14px; .Foo {margin: 0 -$itemMargin $itemMargin 0;}' },
        { code: '/** @define Foo */ $primary: #ccc; .Foo {background-image: linear-gradient($primary, #eee);}' },
        { code: '/** @define Foo */ $deg: 90deg; .Foo {background-image: linear-gradient(-$deg, #ccc, #eee);}' },

        /* css function */
        { code: '/** @define Foo */ .Foo {margin-top: calc(10% - 1vw);}' },
        { code: '/** @define Foo */ .Foo {margin-top: max(10%, 7px);}' },
        { code: '/** @define Foo */ .Foo {margin-top: min(1em, 7px);}' },
        { code: '/** @define Foo */ .Foo {list-style-type: toggle(disk, circle, square, box);}' },
        { code: '/** @define Foo */ .Foo {content: attr(title);}' },
        { code: '/** @define Foo */ .Foo {color-scheme: light;}' },
        { code: '/** @define Foo */ .Foo {color-scheme: light dark;}' },
    ],

    reject: [
        {
            code: `/** @define Foo-Bar */
            .Foo-Bar {
                transform: rotate(1);
            }`,
            message: messages.expected('transform'),
            line: 3
        },
        {
            code: `/** @define Foo-Bar */
            .Foo-Bar {
                color: 1px;
            }`,
            message: messages.expected('color'),
            line: 3
        },
        {
            code: `/** @define Foo-Bar */
            .Foo-Bar {
                padding: 1px #ccc;
            }`,
            message: messages.expected('padding'),
            line: 3
        },
        {
            code: `/** @define Foo-Bar */
            .Foo-Bar {
                font-display: aaa;
            }`,
            message: messages.expected('font-display'),
            line: 3
        },
        {
            code: `/** @define Foo-Bar */
            .Foo-Bar {
                color-scheme: foo-bar;
            }`,
            message: messages.expected('color-scheme'),
            line: 3
        },
        {
            code: `/** @define Foo-Bar */
            .Foo-Bar {
                color-scheme: revert unset;
            }`,
            message: messages.expected('color-scheme'),
            line: 3
        }
    ]
});


testMewRule({
    ruleName,
    config: [
        true,
        { ignoreUnits: ['rpx', 'upx'] }
    ],
    skipBasicChecks: true,
    codeFilename: './test.styl',
    customSyntax,
    accept: [
        {
            code: `
            body
                width: 10rpx;
            `
        },
        {
            code: `
            body {
                height: -.10upx;
            }`
        },
        {
            code: `
            body {
                $padding: 0.2vpx -10px;
            }`
        },
        {
            code: `
            body {
                padding = 0.2vpx -10px;
            }`
        },
        {
            code: `
            body {
                background-image: image-set("test.png" 1x, "test-2x.png" 2x, "test-print.png" 600dpi);
            }`
        }
    ],

    reject: [
        {
            code: `
            body {
                padding: 0.2vpx -10px;
            }`,
            message: messages.expected('padding'),
            line: 3
        },
        {
            code: `
            body {
                margin: 10epx;
            }`,
            message: messages.expected('margin'),
            line: 3
        }
    ]
});

// testMewRule({
//     ruleName,
//     config: {
//         preset: 'suit',
//         rules: {
//             [ruleName]: [
//                 true,
//                 {ignoreUnits: ['rpx', 'upx']}
//             ]
//         }
//     },
//     skipBasicChecks: true,
//     codeFilename: './test.styl',
//     customSyntax,
//     accept:[
//         {
//             code: `
//             body {
//                 background-image: image-set("test.png" 1x, "test-2x.png" 2x, "test-print.png" 600dpi);
//             }`
//         }
//     ],

//     reject:[
//         {
//             code: `
//             body
//                 width: 10rpx;
//             `,
//             message: messages.expected('width'),
//             line: 3
//         },
//         {
//             code: `
//             body {
//                 height: -.10upx;
//             }`,
//             message: messages.expected('height'),
//             line: 3
//         },
//         {
//             code: `
//             body {
//                 padding: 0.2rpx -10px;
//             }`,
//             message: messages.expected('padding'),
//             line: 3
//         },
//         {
//             code: `
//             body {
//                 margin: 10epx;
//             }`,
//             message: messages.expected('margin'),
//             line: 3
//         }
//     ]
// });
