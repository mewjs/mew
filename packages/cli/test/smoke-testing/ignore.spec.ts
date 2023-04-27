import assert from 'assert';
import { spawn } from 'child_process';
import { resolve } from 'path';
import { lint, fix } from './linter';

const mewPath = resolve(__dirname, '../../bin/mew.js');
const testDir = resolve(__dirname, '../fixtures/files/ignore');

/**
 * 是否 CI 环境
 */
const isCIEnv = process.env.CI === 'true' || process.env.GITLAB_CI === 'true';

describe('ignore', function () {
    jest.setTimeout(11000);

    // CI 脚本中这个 case 会报错
    if (!isCIEnv) {
        it('lint with ignore file', function (done) {
            const proc = spawn(mewPath, [`${ testDir }/ignored`], {
                cwd: testDir,
                timeout: 11000
            });
            const chunks = [] as Buffer[];
            proc.stdout.on('data', value => {
                chunks.push(value);
            });
            proc.on('close', code => {
                const result = Buffer.concat(chunks).toString();
                if (code === 0) {
                    assert(true, `mew lint has no error:${ result }`);
                    done();
                }
                else {
                    assert(false, `mew lint has error:${ result }`);
                }
            });
        });
    }


    it('lintText with ignore file', async function () {
        const [err1, err2] = await lint('ignore/ignored/js/test.js', 'js');

        assert.ok(err1.line === 0, 'has line');
        assert.ok(err1.column === 0, 'has column');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'ignore', 'has rule');
        assert.strictEqual(err1.severity, 1, 'has severity');
        assert.ok(err2 == null, 'has no error');
    });

    it('fixText with ignore file', async function () {
        const content = await fix('ignore/ignored/js/test.js', 'js');
        assert(content == null, 'mew fixText ignored');
    });

    it('lintText with cwd', async function () {
        const [err1, err2] = await lint('ignore/ignored/js/test.js', 'js', {
            cwd: testDir
        });

        assert.ok(err1.line === 0, 'has line');
        assert.ok(err1.column === 0, 'has column');
        assert.ok(err1.message, 'has message');
        assert.strictEqual(err1.rule, 'ignore', 'has rule');
        assert.strictEqual(err1.severity, 1, 'has severity');
        assert.ok(err2 == null, 'has no error');
    });

    it('fixText with cwd', async function () {
        const content = await fix('ignore/ignored/js/test.js', 'js', {
            cwd: testDir
        });
        assert(content == null, 'mew fixText ignored');
    });

    it('lintText not ignored', async function () {
        const result = await lint('ignore/notIgnored/js/test.js', 'js', { cwd: testDir });
        assert(result.length > 0, 'mew lintText with errors');
    });

    it('fixText not ignored', async function () {
        const content = await fix('ignore/notIgnored/js/test.js', 'js', { cwd: testDir });
        assert(content!.includes('const ignored = 1;'), 'mew fixText with errors');
    });
});
