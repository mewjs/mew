import type { ResultType } from '../src/reporter';
import Reporter from '../src/reporter';

describe('result', () => {

    describe('initial status', () => {
        it('should return empty list', () => {
            const reporter = new Reporter();
            const total = reporter.total();
            const result = reporter.result();

            expect(total).toBe(0);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });
    });

    describe('after adding a report', () => {
        it('should return list with this report', () => {
            const reporter = new Reporter();
            const report = {
                pos: 1,
                type: 'INFO' as ResultType,
                code: '001',
                message: 'test report'
            };
            reporter.report(report);
            const total = reporter.total();
            const result = reporter.result();

            expect(total).toBe(1);
            expect(result.length).toBe(1);
            expect(result[0].pos).toBe(report.pos);
            expect(result[0].type).toBe(report.type);
            expect(result[0].code).toBe(report.code);
            expect(result[0].message).toBe(report.message);
        });
    });

    describe('after adding more reports', () => {
        it('should return list with all reports sorted by pos', () => {
            const reporter = new Reporter();

            const report1 = {
                pos: 1,
                type: 'INFO' as ResultType,
                code: '001',
                message: 'test report1'
            };
            const report2 = {
                pos: 2,
                type: 'WARN' as ResultType,
                code: '002',
                message: 'test report2'
            };
            const report3 = {
                pos: 3,
                type: 'ERROR' as ResultType,
                code: '003',
                message: 'test report3'
            };
            const report4 = {
                pos: 4,
                type: 'ERROR' as ResultType,
                code: '004',
                message: 'test report4'
            };

            reporter.report(report2);
            reporter.report(report4);
            reporter.report(report1);
            reporter.report(report3);

            const total = reporter.total();
            const result = reporter.result();

            expect(total).toBe(4);
            expect(result.length).toBe(4);

            expect(result[0].pos).toBe(report1.pos);
            expect(result[0].type).toBe(report1.type);
            expect(result[0].code).toBe(report1.code);
            expect(result[0].message).toBe(report1.message);

            expect(result[1].pos).toBe(report2.pos);
            expect(result[1].type).toBe(report2.type);
            expect(result[1].code).toBe(report2.code);
            expect(result[1].message).toBe(report2.message);

            expect(result[2].pos).toBe(report3.pos);
            expect(result[2].type).toBe(report3.type);
            expect(result[2].code).toBe(report3.code);
            expect(result[2].message).toBe(report3.message);

            expect(result[3].pos).toBe(report4.pos);
            expect(result[3].type).toBe(report4.type);
            expect(result[3].code).toBe(report4.code);
            expect(result[3].message).toBe(report4.message);
        });
    });
});

describe('report', () => {
    describe('with pos', () => {
        it('should record the right item', () => {
            const reporter = new Reporter();
            const report = {
                pos: 1,
                type: 'INFO' as ResultType,
                code: '001',
                message: 'test report'
            };
            reporter.report(report);
            const total = reporter.total();
            const result = reporter.result();

            expect(total).toBe(1);
            expect(result.length).toBe(1);
            expect(result[0].pos).toBe(report.pos);
            expect(result[0].type).toBe(report.type);
            expect(result[0].code).toBe(report.code);
            expect(result[0].message).toBe(report.message);
        });
    });

    describe('without pos', () => {
        it('should record the right item (pos: 0)', () => {
            const reporter = new Reporter();
            const report = {
                type: 'INFO' as ResultType,
                code: '001',
                message: 'test report'
            };
            reporter.report(report);
            const total = reporter.total();
            const result = reporter.result();

            expect(total).toBe(1);
            expect(result.length).toBe(1);
            expect(result[0].pos).toBe(0);
            expect(result[0].type).toBe(report.type);
            expect(result[0].code).toBe(report.code);
            expect(result[0].message).toBe(report.message);
        });
    });
});

describe('info', () => {
    it('should record the right item (type "INFO")', () => {
        const reporter = new Reporter();
        const startIndex = 1;
        const code = '001';
        const message = 'test info';
        reporter.info(startIndex, code, message);
        const total = reporter.total();
        const result = reporter.result();

        expect(total).toBe(1);
        expect(result.length).toBe(1);
        expect(result[0].type).toBe('INFO');
        expect(result[0].code).toBe(code);
        expect(result[0].pos).toBe(startIndex);
        expect(result[0].message).toBe(message);
    });
});

describe('warn', () => {
    it('should record the right item (type "WARN")', () => {
        const reporter = new Reporter();
        const startIndex = 1;
        const code = '001';
        const message = 'test warn';
        reporter.warn(startIndex, code, message);
        const total = reporter.total();
        const result = reporter.result();

        expect(total).toBe(1);
        expect(result.length).toBe(1);
        expect(result[0].type).toBe('WARN');
        expect(result[0].code).toBe(code);
        expect(result[0].pos).toBe(startIndex);
        expect(result[0].message).toBe(message);
    });
});

describe('error', () => {
    it('should record the right item (type "ERROR")', () => {
        const reporter = new Reporter();
        const startIndex = 1;
        const code = '001';
        const message = 'test error';
        reporter.error(startIndex, code, message);
        const total = reporter.total();
        const result = reporter.result();

        expect(total).toBe(1);
        expect(result.length).toBe(1);
        expect(result[0].type).toBe('ERROR');
        expect(result[0].code).toBe(code);
        expect(result[0].pos).toBe(startIndex);
        expect(result[0].message).toBe(message);
    });
});

describe('bindRule', () => {
    const reporter = new Reporter();

    reporter.report({
        message: 'test1'
    });

    const reporterForRuleA = reporter.bindRule('A');

    reporterForRuleA.report({
        message: 'test2'
    });

    reporterForRuleA.warn(0, '001', 'test3', 'B');

    it('should keep list while binding', () => {
        expect(reporterForRuleA.total()).toBe(reporter.total());
        expect(reporterForRuleA.result()[0].message).toBe('test1');
        expect(reporterForRuleA.result()[1].message).toBe('test2');
        expect(reporterForRuleA.result()[2].message).toBe('test3');
        expect(reporter.result()[1].message).toBe('test2');
        expect(reporter.result()[2].message).toBe('test3');
    });

    it('should use bound rule as default', () => {
        expect(reporterForRuleA.result()[1].rule).toBe('A');
    });

    it('should prefer given rule than bound rule', () => {
        expect(reporterForRuleA.result()[2].rule).toBe('B');
    });
});
