/* eslint-disable max-nested-callbacks, max-lines-per-function */
import { parse, getOptions } from '../../src/cli';

const CLI_ARGV = process.argv.slice(0, 1).concat(['mew']);
const FIX_RESOLVED_PATH = require.resolve('../../src/cli/fix');
const LINT_RESOLVED_PATH = require.resolve('../../src/cli/lint');
const INIT_RESOLVED_PATH = require.resolve('../../src/cli/init');

describe('cli', () => {

    describe('parse', () => {
        afterEach(() => {
            jest.resetModules();
        });


        it('parse: init', () => {
            process.argv = [
                ...CLI_ARGV,
                'init',
                '--moduleType=commonjs',
                '--framework=vue',
                '--typescript',
                '--env=browser,node',
                '--css=less,stylus',
                '--format=json',
                '--githooks'
            ];
            const command = jest.fn();
            jest.doMock(INIT_RESOLVED_PATH, () => ({ run: command }));

            parse();

            expect(command).toHaveBeenCalled();

            const options = command.mock.calls[0][0];
            expect(options.moduleType).toBe('commonjs');
            expect(options.framework).toBe('vue');
            expect(options.typescript).toBe(true);
            expect(options.env).toBe('browser,node');
            expect(options.css).toBe('less,stylus');
            expect(options.format).toBe('json');
            expect(options.githooks).toBe(true);
        });

        it('parse: lint', () => {
            process.argv = [
                ...CLI_ARGV,
                'lint',
                './src',
                './test',
                '--lookup=false',
                '--color=false',
                '--time=false',
                '--type=js',
                '--rule=true',
                '--no-ignore',
                '--ignore-pattern=lib/'
            ];

            const command = jest.fn();
            jest.doMock(LINT_RESOLVED_PATH, () => ({ run: command }));

            parse();

            expect(command).toHaveBeenCalled();

            const options = command.mock.calls[0][0];

            expect(options.lookup).toBe(false);
            expect(options.color).toBe(false);
            expect(options.time).toBe(false);
            expect(options.rule).toBe(true);
            expect(options.type).toBe('js');
            expect(options.ignore).toBe(false);
            expect(options.ignorePattern).toBe('lib/');

        });

        it('parse: fix', () => {
            process.argv = [
                ...CLI_ARGV,
                'fix',
                './src',
                './test',
                '--lookup=false',
                '--color=false',
                '--time=false',
                '--type=js',
                '--project=mew',
                '--output=formatted',
                '--replace=true',
                '--no-ignore',
                '--ignore-pattern=lib/'
            ];
            const command = jest.fn();
            jest.doMock(FIX_RESOLVED_PATH, () => ({ run: command }));

            parse();

            expect(command).toHaveBeenCalled();

            const options = command.mock.calls[0][0];

            expect(options.lookup).toBe(false);
            expect(options.color).toBe(false);
            expect(options.time).toBe(false);
            expect(options.type).toBe('js');
            expect(options.project).toBe('mew');
            expect(options.output).toBe('formatted');
            expect(options.replace).toBe(true);
            expect(options.ignore).toBe(false);
            expect(options.ignorePattern).toBe('lib/');
        });

        it('parse: no command', () => {
            process.argv = [...CLI_ARGV, 'test/fixtures/files'];

            const command = jest.fn();
            jest.doMock(LINT_RESOLVED_PATH, () => ({ run: command }));

            parse();

            expect(command).toHaveBeenCalled();

            const options = command.mock.calls[0][0];
            expect(options.lookup).toBe(true);
            expect(options.stream).toBe(false);
            expect(options.color).toBe(true);
            expect(options.type).toBe('js,jsx,ts,tsx,css,html,wxml,vue,md');
        });
    });

    describe('getOptions', () => {
        it('getOptions: no command', () => {
            process.argv = [...CLI_ARGV];

            const options = getOptions();

            expect(options.lookup).toBe(true);
            expect(options.stream).toBe(false);
            expect(options.color).toBe(true);
            expect(!!options.rule).toBe(false);
            expect(options.type).toBe('js,jsx,ts,tsx,css,html,wxml,vue,md');
        });

        it('getOptions: lint', () => {
            process.argv = [
                ...CLI_ARGV,
                'lint',
                './src',
                './test',
                '--lookup=false',
                '--color=false',
                '--time=false',
                '--type=js',
                '--rule=true'
            ];
            const options = getOptions();

            expect(options._[0]).toBe('lint');
            expect(options.lookup).toBe(false);
            expect(options.color).toBe(false);
            expect(options.time).toBe(false);
            expect(options.rule).toBe(true);
            expect(options.type).toBe('js');
        });

        it('getOptions: fix', () => {
            process.argv = [
                ...CLI_ARGV,
                'fix',
                './src',
                './test',
                '--lookup=false',
                '--color=false',
                '--time=false',
                '--type=js',
                '--project=mew',
                '--output=formatted',
                '--replace=true'
            ];
            const options = getOptions();

            expect(options._[0]).toBe('fix');
            expect(options.lookup).toBe(false);
            expect(options.color).toBe(false);
            expect(options.time).toBe(false);
            expect(options.type).toBe('js');
            expect(options.project).toBe('mew');
            expect(options.output).toBe('formatted');
            expect(options.replace).toBe(true);
        });

        // it('getOptions: help', () => {
        //     process.argv = [...CLI_ARGV, 'help'];
        //     const options = getOptions();
        //     expect(options._[0]).toBe('help');
        // });
    });

});
