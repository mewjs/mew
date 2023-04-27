import fs from 'fs';
import path from 'path';
import sh from 'shelljs';
import { getHomePath } from '../src/fs-util';
import {
    fileName,
    load,
    parse
} from '../src/config';

describe('parse', () => {
    describe('JSON content', () => {
        it('should return right result', () => {
            const content = [
                '{',
                '    // The is a file for test',
                '    "charset": true    // value "charset" should be true',
                '}'
            ].join('\n');

            expect(parse(content).charset).toBe(true);
        });
    });

    describe('YAML content', () => {
        it('should return right result', () => {
            const content = [
                '---            # The is a file for test',
                'charset: true     # value "charset" should be true',
                'format: yaml   # value "format" should be "yaml"'
            ].join('\n');

            expect(parse(content).charset).toBe(true);
            expect(parse(content).format).toBe('yaml');
        });
    });

    describe('Invalid content', () => {
        it('should throw error', () => {
            const content = ':';
            let error: Error | null = null;

            try {
                parse(content);
            }
            catch (e) {
                error = e;
            }
            expect(error instanceof Error).toBe(true);

        });
    });
});

describe('load', () => {
    let configFilePath: string | null;

    const createConfigFile = function (targetDirPath: string, cnt?: string) {
        const filePath = path.join(targetDirPath, fileName);
        fs.writeFileSync(filePath, cnt || [
            '{',
            '    // The is a file for test',
            '    "test": true    // value "test" should be true',
            '}'
        ].join('\n'));
        configFilePath = filePath;
    };

    const removeConfigFile = function () {
        sh.rm(configFilePath);
        configFilePath = null;
    };

    describe('config file in same directory', () => {
        it('should return right config', () => {
            createConfigFile(__dirname);

            expect(load(__filename, true).test).toBe(true);

            removeConfigFile();
        });
    });

    describe('config file in parent directory', () => {
        it('should return right config', () => {
            createConfigFile(path.resolve(__dirname, '../'));

            expect(load(__filename, true).test).toBe(true);

            removeConfigFile();
        });
    });

    describe('config file in another parent directory', () => {
        it('should return right config', () => {
            createConfigFile(path.resolve(__dirname, '../../'));

            expect(load(__filename, true).test).toBe(true);

            removeConfigFile();
        });
    });

    describe('config file in home path', () => {
        it('should return right config', () => {
            createConfigFile(getHomePath());

            expect(load(__filename, true).test).toBe(true);

            removeConfigFile();
        });
    });

    describe('config file in YAML format', () => {
        it('should return right config', () => {
            createConfigFile(__dirname, [
                '---            # The is a file for test',
                'test: true     # value "test" should be true',
                'format: yaml   # value "format" should be "yaml"'
            ].join('\n'));

            expect(load(__filename, true).test).toBe(true);
            expect(load(__filename, true).format).toBe('yaml');

            removeConfigFile();
        });
    });

    describe('no config file', () => {
        it('should use default config', () => {
            const cfg = load(__filename, true);
            expect(cfg.default).toBe(true);
        });
    });

    describe('wrong config file', () => {
        it('should throw error', () => {
            createConfigFile(__dirname, ':');

            let error: Error | null = null;
            try {
                load(__filename, true);
            }
            catch (e) {
                error = e;
            }

            expect(error instanceof Error).toBe(true);

            removeConfigFile();
        });
    });
});
