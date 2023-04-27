import assert from 'assert';
import console from '../../src/console';
import type { SonarResult } from '../../src/reporter/sonar';
import { lintStream } from './linter';

describe('reporter', function () {
    jest.setTimeout(6000);
    const rawConsoleLog = console.log;

    beforeEach(() => {
        console.log = rawConsoleLog;
    });

    it('default', async function () {
        const result = await lintStream('app.js', { type: 'js', reporter: 'default', silent: true });
        const [err1, err2, err3, err4] = result!.errors;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.strictEqual(err1.linter, 'eslint', 'has linter');
        assert.ok(err1.message, 'has message');
        assert.ok(err1.rule.endsWith('no-unused-vars'), 'has rule');
        assert.strictEqual(err1.severity, 1, 'has severity');

        assert.ok(err2.line, 'has line');
        assert.ok(err2.column, 'has column');
        assert.strictEqual(err2.linter, 'eslint', 'has linter');
        assert.ok(err2.message, 'has message');
        assert.strictEqual(err2.rule, 'no-multi-spaces', 'has rule');
        assert.strictEqual(err2.severity, 2, 'has severity');

        assert.ok(err3.line, 'has line');
        assert.ok(err3.column, 'has column');
        assert.strictEqual(err3.linter, 'eslint', 'has linter');
        assert.ok(err3.message, 'has message');
        assert.strictEqual(err3.rule, 'class-methods-use-this', 'has rule');
        assert.strictEqual(err3.severity, 1, 'has severity');

        assert.ok(err4 == null, 'has no err4');

        console.log('js file done');
    });

    it('sonar', async function () {
        console.log = () => void 0;

        const result = await lintStream(
            'app.js',
            { type: 'js', reporter: 'sonar', silent: true }
        ) as unknown as SonarResult;

        console.log = rawConsoleLog;

        assert.ok(result.filePath, 'has filePath');
        assert.ok(result.messages != null, 'has messages');
        assert.ok(result.errorCount != null, 'has errorCount');
        assert.ok(result.warningCount != null, 'has warningCount');
        assert.ok(result.fixableErrorCount != null, 'has fixableErrorCount');
        assert.ok(result.fixableWarningCount != null, 'has fixableWarningCount');

        const [err1, err2, err3, err4] = result.messages;

        assert.ok(err1.line, 'has line');
        assert.ok(err1.column, 'has column');
        assert.ok(err1.message, 'has message');
        assert.ok(err1.ruleId.includes('no-unused-vars'), 'has ruleId');
        assert.strictEqual(err1.severity, 1, 'has severity');

        assert.ok(err2.line, 'has line');
        assert.ok(err2.column, 'has column');
        assert.ok(err2.message, 'has message');
        assert.strictEqual(err2.ruleId, 'mew:eslint(no-multi-spaces)', 'has ruleId');
        assert.strictEqual(err2.severity, 2, 'has severity');

        assert.ok(err3.line, 'has line');
        assert.ok(err3.column, 'has column');
        assert.ok(err3.message, 'has message');
        assert.strictEqual(err3.ruleId, 'mew:eslint(class-methods-use-this)', 'has rule');
        assert.strictEqual(err3.severity, 1, 'has severity');

        assert.ok(err4 == null, 'has no err4');

        console.log('js file done');
    });

    it('sonar output', async function () {
        const consoleOuts = [] as string[];
        console.log = (message: string) => {
            consoleOuts.push(message);
        };

        const result = await lintStream(
            'app.js',
            { type: 'js', reporter: 'sonar', silent: true }
        ) as unknown as SonarResult;
        console.log = rawConsoleLog;

        assert.ok(result.filePath, 'has filePath');
        assert.ok(result.messages.length > 0, 'has messages');
        assert.ok(result.errorCount != null, 'has errorCount');
        assert.ok(result.warningCount != null, 'has warningCount');
        assert.ok(result.fixableErrorCount != null, 'has fixableErrorCount');
        assert.ok(result.fixableWarningCount != null, 'has fixableWarningCount');

        const [lintResult] = JSON.parse(consoleOuts.join(''));
        assert.ok(lintResult.filePath, 'has filePath');
        assert.ok(lintResult.messages.length > 0, 'has messages');
        assert.ok(lintResult.errorCount != null, 'has errorCount');
        assert.ok(lintResult.warningCount != null, 'has warningCount');
        assert.ok(lintResult.fixableErrorCount != null, 'has fixableErrorCount');
        assert.ok(lintResult.fixableWarningCount != null, 'has fixableWarningCount');

        console.log('css file done');
    });
});
