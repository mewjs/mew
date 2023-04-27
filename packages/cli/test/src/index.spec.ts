import assert from 'assert';
import { resolve } from 'path';
import mew from '../../src';
import { FileFilter } from '../../src/ignored';
import { version } from '../../package.json';

const testDir = resolve(__dirname, '../fixtures/files/ignore');

describe('index', () => {
    it('getOptions', () => {
        const options = mew.getOptions();
        assert.strictEqual(options.lookup, true, 'has lookup');
        assert.strictEqual(options.stream, false, 'has stream');
        assert.strictEqual(options.color, true, 'has color');
        assert.ok(options.type, 'has type');
    });

    it('leadName', () => {
        assert.strictEqual(mew.leadName, 'mew', 'has leadName');
    });

    it('version', () => {
        assert.strictEqual(mew.version, version, 'has version');
    });

    it('lint', () => {
        assert.strictEqual(typeof mew.lint, 'function', 'has lint function');
    });

    it('fix', () => {
        assert.strictEqual(typeof mew.fix, 'function', 'has fix function');
    });

    it('lintText', () => {
        assert.strictEqual(typeof mew.lintText, 'function', 'has lintText function');
    });

    it('fixText', () => {
        assert.strictEqual(typeof mew.fixText, 'function', 'has fixText function');
    });


    it('FileFilter with .mewignore', function () {
        const fileFilter = new FileFilter(testDir);
        assert(fileFilter.isIgnored('ignored/app.js'), 'ignore file');
        assert(fileFilter.isIgnored('ignored/app.css'), 'ignore file');
        assert(fileFilter.isIgnored('glob.js'), 'ignore file');
        assert(fileFilter.isIgnored('glob.css'), 'ignore file');
        assert(!fileFilter.isIgnored('notIgnored/app.js'), 'not ignore file');

    });

    it('FileFilter with patterns', function () {
        const fileFilter = new FileFilter(testDir, {
            patterns: [
                'ignored/',
                'lintText/',
                'glob.*'
            ]
        });
        assert(fileFilter.isIgnored('ignored/app.js'), 'ignore file');
        assert(fileFilter.isIgnored('ignored/app.css'), 'ignore file');
        assert(fileFilter.isIgnored('glob.js'), 'ignore file');
        assert(fileFilter.isIgnored('glob.css'), 'ignore file');
        assert(!fileFilter.isIgnored('notIgnored/app.js'), 'not ignore file');
    });
});
