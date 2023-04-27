import { RuleTester } from 'eslint';
import rule from '../../src/rules/html-comment-content-spacing';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('html-comment-content.spacing', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `
                <!-- comment -->
            `
        },
        {
            filename: 'page.wxml',
            code: `
                <!--
                    comment
                -->
            `,
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: `
                <!--\tcomment\t-->
            `,
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: `
                <!--\ncomment\n-->
            `,
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: `
                <!--comment-->
            `,
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: `
                <!--++++++++++++++++ comment ++++++++++++++++-->
            `,
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: `
                <!--
                    comment
                -->
            `,
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: `
                <!---->
            `,
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: `
                <!---->
            `,
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: `
                <!--

                -->
            `,
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: `
                <!--

                -->
            `,
            options: ['never']
        },

        // exceptions
        {
            filename: 'page.wxml',
            code: `
                <!--++++++++++++++++
                    comment
                ++++++++++++++++-->
            `,
            options: ['always', { exceptions: ['+'] }]
        },
        {
            filename: 'page.wxml',
            code: `
                <!--+-++-++-++-++-++-+
                    comment
                +-++-++-++-++-++-+-->
            `,
            options: ['always', { exceptions: ['+-+'] }]
        },
        {
            filename: 'page.wxml',
            code: `
                <!--++++++++++++++++-->
            `,
            options: ['always', { exceptions: ['+'] }]
        },
        {
            filename: 'page.wxml',
            code: `
                <!--++++
                    comment
                ++++-->
                <!--****
                    comment
                ****-->
                <!--++xx
                    comment
                ++xx-->
            `,
            options: ['always', { exceptions: ['+', '*', '++xx'] }]
        },
        {
            filename: 'page.wxml',
            code: `
                <!--++++++++++++++++ comment ++++++++++++++++-->
            `,
            options: ['never', { exceptions: ['+'] }]
        },

        // invalid html
        {
            filename: 'page.wxml',
            code: `
                <!--
                    comment
            `,
            options: ['always']
        },
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: `
                <!--comment-->
            `,
            options: ['always'],
            output: `
                <!-- comment -->
            `,
            errors: [
                {
                    message: 'Expected space after \'<!--\'.',
                    line: 2,
                    column: 21,
                    endColumn: 21
                },
                {
                    message: 'Expected space before \'-->\'.',
                    line: 2,
                    column: 28,
                    endColumn: 28
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
                <!-- comment -->
            `,
            options: ['never'],
            output: `
                <!--comment-->
            `,
            errors: [
                {
                    message: 'Unexpected space after \'<!--\'.',
                    line: 2,
                    column: 21,
                    endColumn: 22
                },
                {
                    message: 'Unexpected space before \'-->\'.',
                    line: 2,
                    column: 29,
                    endColumn: 30
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
                <!-- \t \t  \t\tcomment \t \t  \t\t-->
            `,
            options: ['never'],
            output: `
                <!--comment-->
            `,
            errors: [
                {
                    message: 'Unexpected space after \'<!--\'.',
                    line: 2,
                    column: 21,
                    endColumn: 29
                },
                {
                    message: 'Unexpected space before \'-->\'.',
                    line: 2,
                    column: 36,
                    endColumn: 44
                }
            ]
        },
        // exceptions
        {
            filename: 'page.wxml',
            code: `
                <!--++++++++++++++++comment++++++++++++++++-->
            `,
            options: ['always', { exceptions: ['+'] }],
            output: null,
            errors: [
                'Expected space after exception block.',
                'Expected space before exception block.'
            ]
        },
        {
            filename: 'page.wxml',
            code: `
                <!--*****comment**-->
            `,
            options: ['always', { exceptions: ['*'] }],
            output: null,
            errors: [
                'Expected space after exception block.',
                'Expected space before exception block.'
            ]
        },
        {
            filename: 'page.wxml',
            code: `
                <!--#+#-#+#-#+#-comment #+#-->
            `,
            options: ['always', { exceptions: ['#+#-'] }],
            output: `
                <!--#+#-#+#-#+#-comment #+# -->
            `,
            errors: [
                'Expected space after exception block.',
                'Expected space before \'-->\'.'
            ]
        },
        {
            filename: 'page.wxml',
            code: `
                <!--*****comment++++-->
            `,
            options: ['always', { exceptions: ['*', '++'] }],
            output: null,
            errors: [
                'Expected space after exception block.',
                {
                    message: 'Expected space before exception block.',
                    line: 2,
                    column: 33
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
                <!--*****comment+++++-->
            `,
            options: ['always', { exceptions: ['*', '++'] }],
            output: null,
            errors: [
                'Expected space after exception block.',
                {
                    message: 'Expected space before exception block.',
                    line: 2,
                    column: 34
                }
            ]
        }
    ]
});

