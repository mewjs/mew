/* eslint-disable max-lines-per-function */
import {
    hint,
    hintAsync,
    format,
    formatAsync,
    addRule
} from '../src/htmlint';
import type { DocumentRule } from '../src/typings/types';

describe('htmlint', () => {

    describe('hint', () => {

        it('should hint correctly', () => {
            const code = '<html></html>';
            const cfg = {
                'html-lang': true
            };

            const result = hint(code, cfg);
            expect(result.length).toBe(1);
            expect(result[0].code).toBe('010');
            expect(result[0].rule).toBe('html-lang');
            expect(result[0].line).toBe(1);
            expect(result[0].column).toBe(1);
        });

        it('should hint correctly with no config (null / undefined / {})', () => {
            const code = '<html></html>';
            expect(hint(code, null).length).toBe(0);
            expect(hint(code).length).toBe(0);
            expect(hint(code, {}).length).toBe(0);
        });

    });

    describe('hintAsync', () => {

        it('should hint correctly & async', done => {
            const code = '<html></html>';
            const cfg = {
                'html-lang': true
            };

            /* eslint-disable max-nested-callbacks */
            hintAsync(code, cfg).then(
                result => {
                    expect(result.length).toBe(1);
                    expect(result[0].code).toBe('010');
                    expect(result[0].rule).toBe('html-lang');
                    expect(result[0].line).toBe(1);
                    expect(result[0].column).toBe(1);
                    done();
                }
            );
            /* eslint-enable max-nested-callbacks */
        });

    });

    describe('format', () => {

        it('should format correctly', () => {
            const code = '<html></html>';
            const cfg = {
                'html-lang': true
            };

            expect(format(code, cfg)).toBe('<html lang="zh-CN"></html>');
        });

        it('should format correctly with no config (null / undefined / {})', () => {
            const code = '<html></html>';
            expect(format(code, null)).toBe(code);
            expect(format(code)).toBe(code);
            expect(format(code, {})).toBe(code);
        });

    });

    describe('formatAsync', () => {

        it('should format correctly & async', done => {
            const code = '<html></html>';
            const cfg = {
                'html-lang': true
            };

            /* eslint-disable max-nested-callbacks */
            formatAsync(code, cfg).then(
                result => {
                    expect(result).toBe('<html lang="zh-CN"></html>');
                    done();
                }
            );
            /* eslint-enable max-nested-callbacks */
        });

        it('should support script/style formatters which returns a promise', done => {
            const code = '<html><script>*</script><style>*</style></html>';
            const asyncScriptFormatter = async function () {
                return Promise.resolve('script');
            };
            const asyncStyleFormatter = async function () {
                return Promise.resolve('style');
            };
            const cfg = {
                'html-lang': true,
                'format': {
                    'no-format': true,
                    'formatter': {
                        script: asyncScriptFormatter,
                        style: asyncStyleFormatter
                    }
                }
            };

            formatAsync(code, cfg).then(
                result => {
                    expect(result).toBe('<html lang="zh-CN"><script>script</script><style>style</style></html>');
                    done();
                }
            );
        });

    });

    describe('add rule', () => {

        it('should add rule correctly', () => {
            const code = '<html></html>';
            const cfg = {
                'html-lang': true,
                'test-rule': true
            };
            const rule = {
                target: 'document',
                name: 'test-rule',
                desc: 'Just a test rule.',
                lint(getCfg, document, reporter) {
                    reporter.warn(
                        1,
                        '099',
                        'This is a test waring!'
                    );
                }
            } as DocumentRule;

            addRule(rule);
            const result = hint(code, cfg);

            expect(result.length).toBe(2);

            expect(result[0].code).toBe('010');
            expect(result[0].rule).toBe('html-lang');
            expect(result[0].line).toBe(1);
            expect(result[0].column).toBe(1);

            expect(result[1].code).toBe('099');
            expect(result[1].rule).toBe('test-rule');
            expect(result[1].line).toBe(1);
            expect(result[1].column).toBe(2);
        });

    });

});
