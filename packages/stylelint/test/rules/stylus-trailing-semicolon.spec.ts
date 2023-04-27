import rule from '../../src/rules/stylus-trailing-semicolon';
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
    config: true,
    skipBasicChecks: true,

    accept: [
        {
            code: `
            a {
                color: pink // test trailing
            }`
        },
        {
            code: `
            a {
                text-align: center
            }`
        }
    ],

    reject: [
    ]
});

testMewRule({
    ...commonSchema,
    config: false,
    accept: [
        {
            code: `
            a {
                color: pink; // test trailing
                padding: 1px;
                margin: 1px;
                text-align: center;
            }`
        },
        {
            code: `
            a {
                color: pink // test trailing
            }`
        },
        {
            code: `
            a {
                margin  1px /* no colon */
            }`
        },
        {
            code: `
            a {
                display() // function
            }`
        },
        {
            code: `
            a {
                text-align: center
            }`
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
            a {
                color: pink; // test trailing
                padding: 1px;
                margin: 1px;
                text-align: center;
            }`
        }
    ],

    reject: [
        {
            code: `
            a {
                color: pink // test trailing
            }`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            a {
                margin  1px /* no colon */
            }`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            a {
                display() // function
            }`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            a {
                text-align: center
            }`,
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
            a {
                color: pink // pink test trailing
            }`,
            fixed: `
            a {
                color: pink; // pink test trailing
            }`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            a {
                display: block
            }`,
            fixed: `
            a {
                display: block;
            }`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            a {
                background: url("a.png") no-repeat,
                    url("b.png") no-repeat
            }`,
            fixed: `
            a {
                background: url("a.png") no-repeat,
                    url("b.png") no-repeat;
            }`,
            message: messages.expected(),
            line: 4
        },
        {
            code: `
            a {
                margin  1px /* 1px no colon */
            }`,
            fixed: `
            a {
                margin  1px; /* 1px no colon */
            }`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            a {
                display(1) // function
            }`,
            fixed: `
            a {
                display(1); // function
            }`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            a {
                display: display(1) // function
            }`,
            fixed: `
            a {
                display: display(1); // function
            }`,
            message: messages.expected(),
            line: 3
        },
        {
            code: `
            a
                text-align: center`,
            fixed: `
            a
                text-align: center;`,
            message: messages.expected(),
            line: 3
        }
    ]
});
