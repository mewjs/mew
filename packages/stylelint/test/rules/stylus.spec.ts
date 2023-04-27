/* eslint-disable max-len, max-lines-per-function */
import stylelint from 'stylelint';

const TEST_FILE_NAME = `${ __dirname }/test.styl`;

describe('tests for stylelint-mew', () => {
    it('good case', done => {
        stylelint.lint({
            code: `
        $var = 10px;

        $foo = {
            bar: baz,
            baz: raz
        };

        bar = {
            bar: baz,
            baz: raz
        }`,
            formatter: 'string',
            codeFilename: TEST_FILE_NAME,
            customSyntax: require.resolve('./stylus'),
            config: {
                plugins: [require.resolve('../../src/index')],
                rules: {
                    'mew/white-space-between-values': true,
                    'mew/strict-values': true,
                    'mew/stylus-colon': true,
                    'mew/stylus-trailing-semicolon': true
                }
            }
        })
            .then(result => {
                const { errored } = result;
                expect(errored).toBe(false);
            })
            .catch(e => {
                // console.error(e);
            })
            .finally(() => {
                done();
            });
    });

    it('bad cases', done => {

        // 其他规则兼容
        stylelint.lint({
            code: `
        // for
        table {
            for $row in 1 2 3 4 5 {
                tr:nth-child({$row}) {
                    height: 10px * $row;
                }
            }
        }

        // if and function
        box($x, $y, $margin = false) {
            padding: $y $x;
            if $margin {
                margin: $y $x;
            }
        }

        .box1 {
            box(5px, 10px, true);
        }
        // unless
        unless $disable-padding-override is defined {
            body {
                box(5px, 10px, false);
                color: #ccc;
            }
        }

        `,
            formatter: 'string',
            codeFilename: TEST_FILE_NAME,
            customSyntax: require.resolve('./stylus'),
            config: {
                plugins: [require.resolve('../../src/index')],
                rules: {
                    'mew/white-space-between-values': true,
                    'mew/strict-values': true,
                    'mew/stylus-colon': true,
                    'mew/stylus-trailing-semicolon': true,
                    'at-rule-no-unknown': [true, { ignoreAtRules: ['unless', 'for', 'if', 'while'] }]
                }
            }
        })
            .then(result => {
                const { errored } = result;
                expect(errored).toBe(false);
            })
            .catch(e => {
                // console.error(e);
            })
            .finally(() => {
                done();
            });
    });

    it('fix: remove redundant spaces', done => {

        // combine fix
        stylelint.lint({
            code: `
        .box {
            color: rgb(1, 1,  1) // rgb color
            color rgb(1,  1,  1) /* rgb color */
            color #ccc /* hex color */
            background rgb(1,1,1)  1px   solid  /* rgb color */
            background: rgb(1,1,1)  1px   solid;
            background-image linear-gradient(-45deg,   hsla( 0, 0%, 39%, 0.5)   100px,   yellow   200px)
            background-image linear-gradient(-45deg,   hsla( 0, 0%, 39%, 0.5)   100px,   yellow   200px) /* background image */
            background-image linear-gradient(-45deg,   hsla( 0, 0%, 39%, 0.5)   100px,   yellow   200px) // background image
            --custom-color: hsla( 0, 0%, 39%, 0.5);
        }
        `,
            formatter: 'string',
            fix: true,
            codeFilename: TEST_FILE_NAME,
            customSyntax: require.resolve('./stylus'),
            config: {
                plugins: [require.resolve('../../src/index')],
                rules: {
                    'mew/white-space-between-values': true,
                    'mew/stylus-colon': true,
                    'mew/use-hex-color': true,
                    'mew/stylus-trailing-semicolon': true,
                }
            }
        })
            .then(result => {
                const { output, errored } = result;
                expect(errored).toBe(false);
                expect(output).toBe(`
        .box {
            color: #010101; // rgb color
            color: #010101; /* rgb color */
            color: #ccc; /* hex color */
            background: #010101 1px solid;  /* rgb color */
            background: #010101 1px solid;
            background-image: linear-gradient(-45deg, #63636380 100px, yellow 200px);
            background-image: linear-gradient(-45deg, #63636380 100px, yellow 200px); /* background image */
            background-image: linear-gradient(-45deg, #63636380 100px, yellow 200px); // background image
            --custom-color: #63636380;
        }
        `);
            })
            .catch(e => {
                // console.error(e);
            })
            .finally(() => {
                done();
            });
    });

});
