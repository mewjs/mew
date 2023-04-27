import rule from '../../src/rules/stylus-colon';
import customSyntax from './stylus';

const { ruleName, messages } = rule;

const commonSchema = {
    ruleName,
    codeFilename: './test.styl',
    customSyntax,
    config: true,
    skipBasicChecks: true
};

testMewRule({
    ruleName,
    config: false,
    skipBasicChecks: true,

    accept: [
        {
            code: 'a {color: pink;}'
        },
        {
            code: 'a {color : red;}'
        }
    ],

    reject: [
    ]
});

testMewRule({
    ruleName,
    config: true,
    skipBasicChecks: true,

    accept: [
        {
            code: 'a {color: pink;}'
        },
        {
            code: 'a {color : red;}'
        }
    ],

    reject: [
    ]
});

testMewRule({
    ...commonSchema,

    accept: [
        {
            code: `
            a
                color: pink;`
        },
        {
            code: `
            a
                my-prop: pink;`
        },
        {
            code: `
            a
                foo()`
        },
        {
            code: 'a {color: pink;}'
        },
        {
            code: 'a {color : red;}'
        }
    ],

    reject: [
        {
            code: `
            a
                color pink;`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            a
                color pink;`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            a
                color pink;`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            a
                my-prop pink;`,
            message: messages.expected(),
            line: 3
        }
    ]
});

testMewRule({
    ...commonSchema,
    fix: true,

    accept: [
    ],

    reject: [
        {
            code: `
            a
                color rgba(0, 0, 9);
            `,
            fixed: `
            a
                color: rgba(0, 0, 9);
            `,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            a
                my-prop pink;
            `,
            fixed: `
            a
                my-prop: pink;
            `,
            message: messages.expected(),
            line: 3
        }
    ]
});
