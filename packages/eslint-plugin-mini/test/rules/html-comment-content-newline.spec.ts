import { RuleTester } from 'eslint';
import rule from '../../src/rules/html-comment-content-newline';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('html-comment-content.newline', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: '<!-- comment -->'
        },
        {
            filename: 'page.wxml',
            code: `<!--
                    multiline
                    comment
                    -->`
        },
        {
            filename: 'page.wxml',
            code: `<!--

                multiline
                comment

                -->`
        },
        {
            filename: 'page.wxml',
            code: `<!--
                    comment
                -->
                <!--
                    multiline
                    comment
                -->
                <!--

                multiline
                comment

                -->`,
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: `<!-- comment -->
                    <!-- multiline
                        comment -->`,
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: `<!---->
                    <!--
                    -->
                    <!--

                    -->`,
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: `<!---->
                    <!--
                    -->
                    <!--

                    -->`,
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: `<!--
                    comment
                    -->
                    <!-- multiline
                        comment -->`,
            options: [{ singleline: 'always', multiline: 'never' }]
        },
        {
            filename: 'page.wxml',
            code: `<!--comment-->
            <!-- comment -->
            <!--\tcomment\t-->
            <!--    comment    -->`,
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: `<!-- comment -->
            <!--
                comment
            -->
            <!-- multiline
                comment -->
            <!--
                multiline
                comment
            -->`,
            options: [{ singleline: 'ignore', multiline: 'ignore' }]
        },
        {
            filename: 'page.wxml',
            code: `<!--+-++-++-++-++-++-+
                comment
            +-++-++-++-++-++-+-->`,
            options: ['always', { exceptions: ['+-+'] }]
        },
        {
            filename: 'page.wxml',
            code: `<!--++++++++++++++++
                comment
            ++++++++++++++++-->`,
            options: ['always', { exceptions: ['+'] }]
        },
        {
            filename: 'page.wxml',
            code: '<!--+++++++++++++++++++++-->',
            options: ['always', { exceptions: ['+'] }]
        },
        {
            filename: 'page.wxml',
            code: `<!--++++
                    comment
                ++++-->
                <!--****
                    comment
                ****-->
                <!--++xx
                    comment
                ++xx-->`,
            options: ['always', { exceptions: ['+', '*', '++xx'] }]
        },
        {
            filename: 'page.wxml',
            code: '<!--++++++++++++++++ comment ++++++++++++++++-->',
            options: ['never', { exceptions: ['+'] }]
        },
        {
            filename: 'page.wxml',
            code: `<!-- eslint-disable -->
            <!-- eslint-enable -->
            <!-- eslint-disable-line-->
            <!-- eslint-disable-next-line -->
            <!-- eslint-disable xxx -->
            <!-- eslint-enable  xxx -->
            <!-- eslint-disable-line xxx-->
            <!-- eslint-disable-next-line xxx -->`,
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: `<!--
            eslint-disable
            -->`,
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: `<view
            <!-- comment
            </view>`,
            options: ['always']
        },
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `
                <!--
                    comment
                -->
                <!-- multiline
                    comment -->`,
            output: `
                <!-- comment -->
                <!--\n multiline
                    comment \n-->`,
            errors: [
                {
                    message: 'Unexpected line breaks after \'<!--\'.',
                    line: 2,
                    column: 21,
                    endLine: 3,
                    endColumn: 21
                },
                {
                    message: 'Unexpected line breaks before \'-->\'.',
                    line: 3,
                    column: 28,
                    endLine: 4,
                    endColumn: 17
                },
                {
                    message: 'Expected line break after \'<!--\'.',
                    line: 5,
                    column: 21,
                    endColumn: 22
                },
                {
                    message: 'Expected line break before \'-->\'.',
                    line: 6,
                    column: 28,
                    endColumn: 29
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
                <!--comment-->
                <!--  comment  -->
                `,
            options: ['always'],
            output: `
                <!--\ncomment\n-->
                <!--\n  comment  \n-->
                `,
            errors: [
                {
                    message: 'Expected line break after \'<!--\'.',
                    line: 2,
                    column: 21,
                    endColumn: 21
                },
                {
                    message: 'Expected line break before \'-->\'.',
                    line: 2,
                    column: 28,
                    endColumn: 28
                },
                {
                    message: 'Expected line break after \'<!--\'.',
                    line: 3,
                    column: 21,
                    endColumn: 23
                },
                {
                    message: 'Expected line break before \'-->\'.',
                    line: 3,
                    column: 30,
                    endColumn: 32
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
                <!--
 comment
 -->
            `,
            options: ['never'],
            output: `
                <!-- comment -->
            `,
            errors: [
                {
                    message: 'Unexpected line breaks after \'<!--\'.',
                    line: 2,
                    column: 21,
                    endLine: 3,
                    endColumn: 2
                },
                {
                    message: 'Unexpected line breaks before \'-->\'.',
                    line: 3,
                    column: 9,
                    endLine: 4,
                    endColumn: 2
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
                <!-- \t \t  \t\tcomment \t \t  \t\t-->
            `,
            options: ['always'],
            output: `
                <!--\n \t \t  \t\tcomment \t \t  \t\t\n-->
            `,
            errors: [
                {
                    message: 'Expected line break after \'<!--\'.',
                    line: 2,
                    column: 21,
                    endColumn: 29
                },
                {
                    message: 'Expected line break before \'-->\'.',
                    line: 2,
                    column: 36,
                    endColumn: 44
                }
            ]
        },
        // exceptions
        {
            filename: 'page.wxml',
            code: '<!--++++++++++++++++comment++++++++++++++++-->',
            options: ['always', { exceptions: ['+'] }],
            errors: [
                'Expected line break after exception block.',
                'Expected line break before exception block.'
            ]
        },
        {
            filename: 'page.wxml',
            code: '<!--*****comment**-->',
            options: ['always', { exceptions: ['*'] }],
            errors: [
                'Expected line break after exception block.',
                'Expected line break before exception block.'
            ]
        },
        {
            filename: 'page.wxml',
            code: '<!--#+#-#+#-#+#-comment #+#-->',
            options: ['always', { exceptions: ['#+#-'] }],
            output: '<!--#+#-#+#-#+#-comment #+#\n-->',
            errors: [
                'Expected line break after exception block.',
                'Expected line break before \'-->\'.'
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
                'Expected line break after exception block.',
                {
                    message: 'Expected line break before exception block.',
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
                'Expected line break after exception block.',
                {
                    message: 'Expected line break before exception block.',
                    line: 2,
                    column: 34
                }
            ]
        }
    ]
});
