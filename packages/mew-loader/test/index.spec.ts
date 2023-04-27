/* eslint-disable @typescript-eslint/no-dynamic-delete, @typescript-eslint/no-var-requires, prefer-arrow-callback, func-names */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

import webpack from './fixtures/node_modules/webpack';
// import webpack from 'webpack';

const baseDir = path.resolve(__dirname, './fixtures');
const configPath = require.resolve('./fixtures/webpack.config');
const loaderPath = require.resolve('../src');

beforeEach(() => {
    process.chdir(baseDir);
    if (!fs.existsSync(`${ baseDir }/package-lock.json`)) {
        throw new Error('should use `npm install` in `test/fixtures` before run test!');
    }
});

describe('webpack compile with worker', function () {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
    jest.setTimeout(10000);

    beforeEach(() => {
        delete require.cache[configPath];
    });

    it('should pass with no errors', done => {
        const config = require(configPath);
        const compiler = webpack(config);
        compiler.run((e, stats) => {
            assert.strictEqual(e, null, 'has no errors');
            assert.strictEqual(stats.compilation.errors.length, 0, 'has no errors');
            done();
        });
    });

    it('should fail with errors', done => {
        const config = require(configPath);
        config.entry = `${ baseDir }/src/index-error.js`;
        const compiler = webpack(config);
        compiler.run((e, stats) => {
            assert.strictEqual(e, null, 'has no errors');
            assert.strictEqual(stats.compilation.errors.length, 1, 'has errors');
            done();
        });
    });

    it('should error with no excludes', done => {
        const config = require(configPath);
        config.entry = `${ baseDir }/src/index-exclude.js`;
        const compiler = webpack(config);
        compiler.run((e, stats) => {
            assert.strictEqual(e, null, 'has no errors');
            assert.ok(stats.compilation.errors.length > 0, 'has errors');
            done();
        });
    });

    it('should pass with excludes', done => {
        const config = require(configPath);
        config.entry = `${ baseDir }/src/index-exclude.js`;
        const rule = config.module.rules[config.module.rules.length - 1];

        rule.use[0].options.exclude = 'src/exclude.*';
        const compiler = webpack(config);
        compiler.run((e, stats) => {
            assert.strictEqual(e, null, 'has no errors');
            assert.strictEqual(stats.compilation.errors.length, 0, 'has no errors');
            done();
        });
    });

    it('should pass with mewignore', done => {
        const config = require(configPath);
        config.entry = `${ baseDir }/src/index-mewignore.js`;
        const compiler = webpack(config);
        compiler.run((e, stats) => {
            assert.strictEqual(e, null, 'has no errors');
            assert.strictEqual(stats.compilation.errors.length, 0, 'has no errors');
            done();
        });
    });
});

describe('webpack compile with noworker', function () {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
    jest.setTimeout(20000);

    beforeEach(() => {
        process.env.MEW_ENV = 'noworker';
        delete require.cache[loaderPath];
    });

    beforeEach(() => {
        delete require.cache[configPath];
    });

    it('should pass with no errors', done => {
        const config = require(configPath);
        const compiler = webpack(config);
        compiler.run((e, stats) => {
            assert.strictEqual(e, null, 'has no errors');
            assert.strictEqual(stats.compilation.errors.length, 0, 'has no errors');
            done();
        });
    });

    it('should fail with errors', done => {
        const config = require(configPath);
        config.entry = `${ baseDir }/src/index-error.js`;
        const compiler = webpack(config);
        compiler.run((e, stats) => {
            assert.strictEqual(e, null, 'has no errors');
            assert.strictEqual(stats.compilation.errors.length, 1, 'has errors');
            done();
        });
    });

    it('should error with no excludes', done => {
        const config = require(configPath);
        config.entry = `${ baseDir }/src/index-exclude.js`;
        const compiler = webpack(config);
        compiler.run((e, stats) => {
            assert.strictEqual(e, null, 'has no errors');
            assert.ok(stats.compilation.errors.length > 0, 'has errors');
            done();
        });
    });

    it('should pass with excludes', done => {
        const config = require(configPath);
        config.entry = `${ baseDir }/src/index-exclude.js`;
        const rule = config.module.rules[config.module.rules.length - 1];

        rule.use[0].options.exclude = 'src/exclude.*';
        const compiler = webpack(config);
        compiler.run((e, stats) => {
            assert.strictEqual(e, null, 'has no errors');
            assert.strictEqual(stats.compilation.errors.length, 0, 'has no errors');
            done();
        });
    });

    it('should pass with mewignore', done => {
        const config = require(configPath);
        config.entry = `${ baseDir }/src/index-mewignore.js`;
        const compiler = webpack(config);
        compiler.run((e, stats) => {
            assert.strictEqual(e, null, 'has no errors');
            assert.strictEqual(stats.compilation.errors.length, 0, 'has no errors');
            done();
        });
    });
});
