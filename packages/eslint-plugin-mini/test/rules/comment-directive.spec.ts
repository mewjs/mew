/* eslint-disable @typescript-eslint/no-magic-numbers */
import eslint from 'eslint';
import * as plugin from '../../src';

const linter = new eslint.ESLint({
    cwd: '/tmp',
    baseConfig: {
        plugins: ['@mewjs/mini'],
        parser: require.resolve('@mewjs/mpxml-eslint-parser'),
        parserOptions: {
            ecmaVersion: 2018,
            sourceType: 'module'
        },
        rules: {
            'no-unused-vars': 'error',
            '@mewjs/mini/comment-directive': 'error',
            '@mewjs/mini/no-parsing-error': 'error',
            '@mewjs/mini/no-duplicate-attributes': 'error'
        },
    },
    resolvePluginsRelativeTo: __dirname,
    plugins: {
        '@mewjs/mini': plugin
    },
    useEslintrc: false
});

describe('comment-directive', () => {
    describe('eslint-disable/eslint-enable', () => {
        it('disable all rules if <!-- eslint-disable -->', async () => {
            const code = `
<template>
<!-- eslint-disable -->
<div id id="a">Hello</div>
</template>
`;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(0);
        });

        it('disable specific rules if <!-- eslint-disable @mewjs/mini/no-duplicate-attributes -->', async () => {
            const code = `
<template>
<!-- eslint-disable @mewjs/mini/no-duplicate-attributes -->
<div id id="a">Hello</div>
</template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(1);
            expect(messages[0].ruleId).toBe('@mewjs/mini/no-parsing-error');
        });

        it('enable all rules if <!-- eslint-enable -->', async () => {
            const code = `
                <template>
                <!-- eslint-disable -->
                <div id id="a">Hello</div>
                <!-- eslint-enable -->
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(2);
            expect(messages[0].ruleId).toBe('@mewjs/mini/no-parsing-error');
            expect(messages[0].line).toBe(6);
            expect(messages[1].ruleId).toBe('@mewjs/mini/no-duplicate-attributes');
            expect(messages[1].line).toBe(6);
        });

        it('enable specific rules if <!-- eslint-enable @mewjs/mini/no-duplicate-attributes -->', async () => {
            const code = `
                <template>
                <!-- eslint-disable @mewjs/mini/no-parsing-error, @mewjs/mini/no-duplicate-attributes -->
                <div id id="a">Hello</div>
                <!-- eslint-enable @mewjs/mini/no-duplicate-attributes -->
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(1);
            expect(messages[0].ruleId).toBe('@mewjs/mini/no-duplicate-attributes');
            expect(messages[0].line).toBe(6);
        });


        it('disable specific rules if <!-- eslint-disable '
            + '@mewjs/mini/no-duplicate-attributes ,, , @mewjs/mini/no-parsing-error -->', async () => {
            const code = `
                <template>
                <!-- eslint-disable @mewjs/mini/no-duplicate-attributes ,, , @mewjs/mini/no-parsing-error -->
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(0);
        });
    });

    describe('eslint-disable-line', () => {
        it('disable all rules if <!-- eslint-disable-line -->', async () => {
            const code = `
                <template>
                <div id id="a">Hello</div> <!-- eslint-disable-line -->
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(0);
        });

        it('disable specific rules if <!-- eslint-disable-line @mewjs/mini/no-duplicate-attributes -->', async () => {
            const code = `
                <template>
                <div id id="a">Hello</div> <!-- eslint-disable-line @mewjs/mini/no-duplicate-attributes -->
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(1);
            expect(messages[0].ruleId).toBe('@mewjs/mini/no-parsing-error');
        });

        it('don\'t disable rules if <!-- eslint-disable-line --> is on another line', async () => {
            const code = `
                <template>
                <!-- eslint-disable-line -->
                <div id id="a">Hello</div>
                <!-- eslint-disable-line -->
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(2);
            expect(messages[0].ruleId).toBe('@mewjs/mini/no-parsing-error');
            expect(messages[1].ruleId).toBe('@mewjs/mini/no-duplicate-attributes');
        });
    });

    describe('eslint-disable-next-line', () => {
        it('disable all rules if <!-- eslint-disable-next-line -->', async () => {
            const code = `
                <template>
                <!-- eslint-disable-next-line -->
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(0);
        });

        /* eslint-disable-next-line max-len */
        it('disable specific rules if <!-- eslint-disable-next-line @mewjs/mini/no-duplicate-attributes -->', async () => {
            const code = `
                <template>
                <!-- eslint-disable-next-line @mewjs/mini/no-duplicate-attributes -->
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(1);
            expect(messages[0].ruleId).toBe('@mewjs/mini/no-parsing-error');
        });

        it('don\'t disable rules if <!-- eslint-disable-next-line --> is on another line', async () => {
            const code = `
                <template>
                <!-- eslint-disable-next-line -->

                <div id id="a">Hello</div> <!-- eslint-disable-next-line -->
                <!-- eslint-disable-next-line -->
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(2);
            expect(messages[0].ruleId).toBe('@mewjs/mini/no-parsing-error');
            expect(messages[1].ruleId).toBe('@mewjs/mini/no-duplicate-attributes');
        });

        it('should affect only the next line', async () => {
            const code = `
                <template>
                <!-- eslint-disable-next-line @mewjs/mini/no-parsing-error, @mewjs/mini/no-duplicate-attributes -->
                <div id id="a">Hello</div>
                <div id id="b">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(2);
            expect(messages[0].ruleId).toBe('@mewjs/mini/no-parsing-error');
            expect(messages[0].line).toBe(5);
            expect(messages[1].ruleId).toBe('@mewjs/mini/no-duplicate-attributes');
            expect(messages[1].line).toBe(5);
        });
    });

    describe('allow description', () => {
        it('disable all rules if <!-- eslint-disable -- description -->', async () => {
            const code = `
                <template>
                <!-- eslint-disable -- description -->
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(0);
        });

        it('enable all rules if <!-- eslint-enable -- description -->', async () => {
            const code = `
                <template>
                <!-- eslint-disable -- description -->
                <div id id="a">Hello</div>
                <!-- eslint-enable -- description -->
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(2);
            expect(messages[0].ruleId).toBe('@mewjs/mini/no-parsing-error');
            expect(messages[0].line).toBe(6);
            expect(messages[1].ruleId).toBe('@mewjs/mini/no-duplicate-attributes');
            expect(messages[1].line).toBe(6);
        });

        it(
            'enable specific rules if <!-- eslint-enable @mewjs/mini/no-duplicate-attributes -- description -->',
            async () => {
                const code = `
                    <template>
                    <!-- eslint-disable @mewjs/mini/no-parsing-error, @mewjs/mini/no-duplicate-attributes -- description -->
                    <div id id="a">Hello</div>
                    <!-- eslint-enable @mewjs/mini/no-duplicate-attributes -- description -->
                    <div id id="a">Hello</div>
                    </template>
                `;
                const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

                expect(messages.length).toBe(1);
                expect(messages[0].ruleId).toBe('@mewjs/mini/no-duplicate-attributes');
                expect(messages[0].line).toBe(6);
            }
        );

        it('disable all rules if <!-- eslint-disable-line -- description -->', async () => {
            const code = `
                <template>
                <div id id="a">Hello</div> <!-- eslint-disable-line -- description -->
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(0);
        });

        it('disable specific rules if '
            + '<!-- eslint-disable-line @mewjs/mini/no-duplicate-attributes -- description -->', async () => {
            const code = `
                <template>
                <div id id="a">Hello</div> <!-- eslint-disable-line @mewjs/mini/no-duplicate-attributes -- description -->
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(1);
            expect(messages[0].ruleId).toBe('@mewjs/mini/no-parsing-error');
        });

        it('disable all rules if <!-- eslint-disable-next-line -- description -->', async () => {
            const code = `
                <template>
                <!-- eslint-disable-next-line -- description -->
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(0);
        });

        /* eslint-disable-next-line max-len */
        it('disable specific rules if <!-- eslint-disable-next-line @mewjs/mini/no-duplicate-attributes -->', async () => {
            const code = `
                <template>
                <!-- eslint-disable-next-line @mewjs/mini/no-duplicate-attributes -- description -->
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(1);
            expect(messages[0].ruleId).toBe('@mewjs/mini/no-parsing-error');
        });
    });

    describe('block level directive', () => {
        it('disable all rules if <!-- eslint-disable -->', async () => {
            const code = `
                <!-- eslint-disable -->
                <template>
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(0);
        });

        it('don\'t disable rules if <!-- eslint-disable --> is on after block', async () => {
            const code = `
                <!-- eslint-disable -->
                <i18n>
                </i18n>
                <template>
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(2);
            expect(messages[0].ruleId).toBe('@mewjs/mini/no-parsing-error');
            expect(messages[1].ruleId).toBe('@mewjs/mini/no-duplicate-attributes');
        });
    });

    describe('reportUnusedDisableDirectives', () => {
        const linter = new eslint.ESLint({
            cwd: '/tmp',
            baseConfig: {
                plugins: ['@mewjs/mini'],
                parser: require.resolve('@mewjs/mpxml-eslint-parser'),
                parserOptions: {
                    ecmaVersion: 2018,
                    sourceType: 'module'
                },
                rules: {
                    'no-unused-vars': 'error',
                    '@mewjs/mini/comment-directive': 'error',
                    '@mewjs/mini/no-parsing-error': 'error',
                    '@mewjs/mini/no-duplicate-attributes': 'error'
                },
            },
            resolvePluginsRelativeTo: __dirname,
            plugins: {
                '@mewjs/mini': plugin
            },
            useEslintrc: false
        });


        // it('report unused <!-- eslint-disable -->', async () => {
        //     const code = `
        //         <template>
        //         <!-- eslint-disable -->
        //         <div id="a">Hello</div>
        //         </template>
        //     `;
        //     const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

        //     expect(messages.length).toBe(1);
        //     expect(messages[0].ruleId).toBe('@mewjs/mini/comment-directive');
        //     expect(messages[0].message).toBe('Unused eslint-disable directive (no problems were reported).');
        //     expect(messages[0].line).toBe(3);
        //     expect(messages[0].column).toBe(11);
        // });

        it('dont report unused <!-- eslint-disable -->', async () => {
            const code = `
                <template>
                <!-- eslint-disable -->
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(0);
        });

        /* eslint-disable-next-line max-len */
        xit('report unused <!-- eslint-disable @mewjs/mini/no-duplicate-attributes, @mewjs/mini/no-parsing-error -->', async () => {
            const code = `
                <template>
                <!-- eslint-disable @mewjs/mini/no-duplicate-attributes, @mewjs/mini/no-parsing-error -->
                <div id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(2);

            expect(messages[0].ruleId).toBe('@mewjs/mini/comment-directive');
            expect(
                messages[0].message
            ).toBe(
                /* eslint-disable-next-line max-len */
                'Unused eslint-disable directive (no problems were reported from \'@mewjs/mini/no-duplicate-attributes\').'
            );
            expect(messages[0].line).toBe(3);
            expect(messages[0].column).toBe(31);

            expect(messages[1].ruleId).toBe('@mewjs/mini/comment-directive');
            expect(
                messages[1].message
            ).toBe(
                'Unused eslint-disable directive (no problems were reported from \'@mewjs/mini/no-parsing-error\').'
            );
            expect(messages[1].line).toBe(3);
            expect(messages[1].column).toBe(60);
        });

        xit('report unused <!-- eslint-disable-next-line @mewjs/mini/no-duplicate-attributes, '
            + '@mewjs/mini/no-parsing-error -->', async () => {
            const code = `
<template>
    <!-- eslint-disable-next-line @mewjs/mini/no-duplicate-attributes, @mewjs/mini/no-parsing-error -->
    <div id="a">Hello</div>
    <div id id="b">Hello</div>
</template>`;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(4);

            expect(messages[0].ruleId).toBe('@mewjs/mini/comment-directive');
            expect(
                messages[0].message
            ).toBe(
                'Unused eslint-disable-next-line directive '
                + '(no problems were reported from \'@mewjs/mini/no-duplicate-attributes\').'
            );
            expect(messages[0].line).toBe(3);
            expect(messages[0].column).toBe(41);

            expect(messages[1].ruleId).toBe('@mewjs/mini/comment-directive');
            expect(
                messages[1].message
            ).toBe(
                /* eslint-disable-next-line max-len */
                'Unused eslint-disable-next-line directive (no problems were reported from \'@mewjs/mini/no-parsing-error\').'
            );
            expect(messages[1].line).toBe(3);
            expect(messages[1].column).toBe(70);

            expect(messages[2].ruleId).toBe('@mewjs/mini/no-parsing-error');
            expect(messages[2].line).toBe(5);
            expect(messages[3].ruleId).toBe('@mewjs/mini/no-duplicate-attributes');
            expect(messages[3].line).toBe(5);
        });

        it('dont report used <!-- eslint-disable-next-line '
            + '@mewjs/mini/no-duplicate-attributes, @mewjs/mini/no-parsing-error -->', async () => {
            const code = `
                <template>
                <!-- eslint-disable-next-line @mewjs/mini/no-duplicate-attributes, @mewjs/mini/no-parsing-error -->
                <div id id="a">Hello</div>
                </template>
            `;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(0);
        });

        it('dont report used, with duplicate eslint-disable', async () => {
            const code = `
<template>
<!-- eslint-disable -->
<!-- eslint-disable-next-line @mewjs/mini/no-duplicate-attributes, @mewjs/mini/no-parsing-error -->
<div id id="a">Hello</div><!-- eslint-disable-line @mewjs/mini/no-duplicate-attributes, @mewjs/mini/no-parsing-error -->
</template>`;
            const [{ messages }] = await linter.lintText(code, { filePath: 'test.wxml' });

            expect(messages.length).toBe(0);
        });
    });
});
