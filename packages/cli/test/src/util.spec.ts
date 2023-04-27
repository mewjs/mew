import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { execSync } from 'child_process';

import { writeConfigFile, setProperty, getCLIName } from '../../src/util';

const stringifyIndent = 4;

const DIR = path.join(__dirname, '..');

describe('util', () => {

    describe('writeConfigFile', () => {
        afterEach(() => {
            execSync(`rm -f ${ DIR }/fixtures/tmp-test-config.*`);
        });

        it('writeConfigFile .js', () => {
            const configFilePath = `${ DIR }/fixtures/tmp-test-config.js`;
            const config = {
                test: 1
            };
            writeConfigFile(config, configFilePath);
            const content = fs.readFileSync(configFilePath, 'utf-8');
            assert.strictEqual(content, `module.exports = {
    test: 1
};`);
            fs.unlinkSync(configFilePath);
        });

        it('writeConfigFile .json', () => {
            const configFilePath = `${ DIR }/fixtures/tmp-test-config.json`;
            const config = {
                test: 1
            };
            writeConfigFile(config, configFilePath);
            const content = fs.readFileSync(configFilePath, 'utf-8');
            expect(content).toBe(JSON.stringify(config, null, stringifyIndent));
            fs.unlinkSync(configFilePath);
        });

        it('writeConfigFile .yaml', () => {
            const configFilePath = `${ DIR }/fixtures/tmp-test-config.yaml`;
            const config = {
                test: 1
            };
            writeConfigFile(config, configFilePath);
            const content = fs.readFileSync(configFilePath, 'utf-8');
            expect(content).toBe('test: 1\n');
            fs.unlinkSync(configFilePath);
        });

        it('writeConfigFile .yml', () => {
            const configFilePath = `${ DIR }/fixtures/tmp-test-config.yml`;
            const config = {
                test: 1
            };
            writeConfigFile(config, configFilePath);
            const content = fs.readFileSync(configFilePath, 'utf-8');
            expect(content).toBe('test: 1\n');
            fs.unlinkSync(configFilePath);
        });
    });

    describe('setProperty', () => {
        it('setProperty by value', () => {
            const object = {
                b: {}
            } as Partial<{ a: number; b: { c: string }; d: { e: { f: boolean } } }>;
            setProperty(object, ['a'], 1);
            setProperty(object, ['b', 'c'], 'b.c');
            setProperty(object, ['d', 'e', 'f'], false);

            expect(object.a).toBe(1);
            expect(object.b!.c).toBe('b.c');
            expect(object.d!.e.f).toBe(false);

        });
    });

    describe('getCLIName', () => {
        it('package name with scope', () => {
            const name = getCLIName('@foo/bar');

            expect(name).toBe('foo');

        });

        it('package name without scope', () => {
            const name = getCLIName('foo');

            expect(name).toBe('foo');

        });
    });
});
