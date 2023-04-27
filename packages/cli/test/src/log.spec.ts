/* eslint-disable @typescript-eslint/no-var-requires */
import chalk from 'chalk';

describe('log', () => {
    afterEach(() => {
        jest.resetModules();
    });

    it('log', () => {
        const consoleLog = jest.fn();

        jest.doMock('../../src/console', () => ({ log: consoleLog }));

        const { getLog } = require('../../src/log');

        const logger = getLog(false);
        logger.trace();
        logger.debug();
        logger.info();
        logger.warn();
        logger.error();
        logger.fatal();

        logger.trace('test');
        expect(consoleLog).toHaveBeenLastCalledWith('mew [TRACE] test');

        logger.debug('test');
        expect(consoleLog).toHaveBeenLastCalledWith('mew [DEBUG] test');

        logger.info('test');
        expect(consoleLog).toHaveBeenLastCalledWith('mew [INFO] test');

        logger.warn('test');
        expect(consoleLog).toHaveBeenLastCalledWith('mew [WARN] test');

        logger.error('test');
        expect(consoleLog).toHaveBeenLastCalledWith('mew [ERROR] test');

        logger.fatal('test');
        expect(consoleLog).toHaveBeenLastCalledWith('mew [FATAL] test');
    });

    it('log with color', () => {
        const consoleLog = jest.fn();

        jest.doMock('../../src/console', () => ({ log: consoleLog }));

        const { getLog } = require('../../src/log');

        const logger = getLog(true);
        logger.trace();
        logger.debug();
        logger.info();
        logger.warn();
        logger.error();
        logger.fatal();

        logger.trace('test');
        expect(consoleLog).toHaveBeenLastCalledWith(`mew ${ chalk.grey('TRACE') } test`);

        logger.debug('test');
        expect(consoleLog).toHaveBeenLastCalledWith(`mew ${ chalk.grey('DEBUG') } test`);

        logger.info('test');
        expect(consoleLog).toHaveBeenLastCalledWith(`mew ${ chalk.green('INFO') } test`);

        logger.warn('test');
        expect(consoleLog).toHaveBeenLastCalledWith(`mew ${ chalk.yellow('WARN') } test`);

        logger.error('test');
        expect(consoleLog).toHaveBeenLastCalledWith(`mew ${ chalk.red('ERROR') } test`);

        logger.fatal('test');
        expect(consoleLog).toHaveBeenLastCalledWith(`mew ${ chalk.red('FATAL') } test`);
    });
});
