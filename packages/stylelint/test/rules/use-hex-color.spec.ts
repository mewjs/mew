import rule from '../../src/rules/use-hex-color';

const { ruleName, messages } = rule;

testMewRule({
    ruleName,
    config: false,
    skipBasicChecks: true,

    accept: [
        {
            code: `
            .Foo {
                color: rgb(100, 100, 100);
            }`
        },
        {
            code: `
            .Foo {
                color: rgb(100, 100,);
            }`
        },
    ],

    reject: []
});

testMewRule({
    ruleName,
    config: true,
    skipBasicChecks: true,

    accept: [
        { code: '/** @define Foo */ .Foo {color: #fff}' },
        { code: '/** @define Foo */ .Foo {color: rgb($color, 255, 255)}' },
        { code: '/** @define Foo */ .Foo {color: hsla(199,30%,20%,$percent)}' },
    ],

    reject: [
        {
            code: `/** @define Foo */
            .Foo {
                color: rgb(100, 100, 100);
            }`,
            message: messages.expected('rgb(100, 100, 100)', '#646464'),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                color: rgb(39.22%, 39.22%, 39.22%);
            }`,
            message: messages.expected('rgb(39.22%, 39.22%, 39.22%)', '#646464'),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                color: rgba( 100  ,  100, 100, 0.5  );
            }`,
            message: messages.expected('rgba( 100  ,  100, 100, 0.5  )', '#64646480'),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                color: hsl( 0, 0%, 39%);
            }`,
            message: messages.expected('hsl( 0, 0%, 39%)', '#636363'),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                color: hsla( 0, 0%, 39%, 0.5);
            }`,
            message: messages.expected('hsla( 0, 0%, 39%, 0.5)', '#63636380'),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                background-image:linear-gradient(-45deg, hsla( 0, 0%, 39%, 0.5) 100px, yellow 200px);
            }`,
            message: messages.expected('hsla( 0, 0%, 39%, 0.5)', '#63636380'),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                color: rgb(80%, 80%, 80%);
            }`,
            message: messages.expected('rgb(80%, 80%, 80%)', '#ccc'),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                color: rgba(80%, 80%, 80%, 80%);
            }`,
            message: messages.expected('rgba(80%, 80%, 80%, 80%)', '#cccc'),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                color: hsl(0, 0%, 80%);
            }`,
            message: messages.expected('hsl(0, 0%, 80%)', '#ccc'),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                color: hsla(0, 0%, 80%, .8);
            }`,
            message: messages.expected('hsla(0, 0%, 80%, .8)', '#cccc'),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                color: hsla(0, 0%, 80%, 0.5);
            }`,
            message: messages.expected('hsla(0, 0%, 80%, 0.5)', '#cccccc80'),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                color: rgba(204, 204, 204, 0.5);
            }`,
            message: messages.expected('rgba(204, 204, 204, 0.5)', '#cccccc80'),
            line: 3
        },
        {
            code: `/** @define Foo */
            .Foo {
                color: rgba(0, 0, 0, .9);
            }`,
            message: messages.expected('rgba(0, 0, 0, .9)', '#000000e6'),
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
        { code: '.Foo {color: #fff}' },
        { code: '.Foo {color: rgb($color, 255, 255)}' },
        { code: '.Foo {color: hsla(199,30%,20%,$percent)}' },
    ],

    reject: [
        {
            code: `
            .color {
                color: bisque;
            }`,
            fixed: `
            .color {
                color: #ffe4c4;
            }`,
            message: messages.expected('bisque', '#ffe4c4'),
            line: 3
        },
        {
            code: `
            .color {
                --error-color: rgba(100,100,100,1);
            }`,
            fixed: `
            .color {
                --error-color: #646464;
            }`,
            message: messages.expected('rgba(100,100,100,1)', '#646464'),
            line: 3
        },
        {
            code: `
            .color {
                border: 1px solid rgba(0,0,0,1);
            }`,
            fixed: `
            .color {
                border: 1px solid #000;
            }`,
            message: messages.expected('rgba(0,0,0,1)', '#000'),
            line: 3
        },
        {
            code: `
            .color {
                border-color: hsla(0,0%,0%,1);
            }`,
            fixed: `
            .color {
                border-color: #000;
            }`,
            message: messages.expected('hsla(0,0%,0%,1)', '#000'),
            line: 3
        },
        {
            code: `
            .color {
                color:  rgba(80%, 80%, 80%, 80%)   ;
            }`,
            fixed: `
            .color {
                color:  #cccc   ;
            }`,
            message: messages.expected('rgba(80%, 80%, 80%, 80%)', '#cccc'),
            line: 3
        },
        {
            code: `
            .color {
                background: 1px solid  hsla(0, 0%, 80%, 0.5); /* comment */
            }`,
            fixed: `
            .color {
                background: 1px solid  #cccccc80; /* comment */
            }`,
            message: messages.expected('hsla(0, 0%, 80%, 0.5)', '#cccccc80'),
            line: 3
        },
        {
            code: `
            .color {
                background-image:linear-gradient(-45deg, hsl(0 ,  0% , 80% , .5) 100px, #ccc 200px);
            }`,
            fixed: `
            .color {
                background-image:linear-gradient(-45deg, #cccccc80 100px, #ccc 200px);
            }`,
            message: messages.expected('hsl(0 ,  0% , 80% , .5)', '#cccccc80'),
            line: 3
        },
        {
            code: `
            .color {
                background-image:linear-gradient(-45deg, #cccccc80 100px, rgb(204 , 204 , 204) 200px);
            }`,
            fixed: `
            .color {
                background-image:linear-gradient(-45deg, #cccccc80 100px, #ccc 200px);
            }`,
            message: messages.expected('rgb(204 , 204 , 204)', '#ccc'),
            line: 3
        },
        {
            code: `
            .color {
                border-top-color: rgba(0, 0, 0, .9);
            }`,
            fixed: `
            .color {
                border-top-color: #000000e6;
            }`,
            message: messages.expected('rgba(0, 0, 0, .9)', '#000000e6'),
            line: 3
        }
    ]
});
