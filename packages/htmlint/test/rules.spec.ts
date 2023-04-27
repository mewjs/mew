/* eslint-disable no-empty-function */
import rules from '../src/rules';

describe('rules', () => {
    describe('init', () => {

        it('should init correctly', () => {
            rules.init();
        });

        it('should list rules', () => {
            const ruleList = rules.list();
            expect(Array.isArray(ruleList)).toBe(true);

            const parserRuleList = rules.list('parser');
            expect(Array.isArray(parserRuleList)).toBe(true);

            for (let i = parserRuleList.length - 1; i >= 0; i--) {
                expect(parserRuleList[i].target).toBe('parser');
            }

            const documentRuleList = rules.list('document');
            expect(Array.isArray(documentRuleList)).toBe(true);

            for (let j = documentRuleList.length - 1; j >= 0; j--) {
                expect(documentRuleList[j].target).toBe('document');
            }

            expect(parserRuleList.length + documentRuleList.length).toBe(ruleList.length);
        });

        it('should add rule correctly', () => {
            const ruleNum = rules.list().length;
            const parserRuleNum = rules.list('parser').length;
            const documentRuleNum = rules.list('document').length;

            rules.add({
                name: 'test',
                desc: 'rule for test',
                target: 'parser',
                lint() {}
            });
            expect(rules.list().length).toBe(ruleNum + 1);
            expect(rules.list('parser').length).toBe(parserRuleNum + 1);
            expect(rules.list('document').length).toBe(documentRuleNum);

            rules.add({
                name: 'test2',
                desc: 'another rule for test',
                target: 'document',
                lint() {}
            });
            expect(rules.list().length).toBe(ruleNum + 2);
            expect(rules.list('parser').length).toBe(parserRuleNum + 1);
            expect(rules.list('document').length).toBe(documentRuleNum + 1);
        });
    });
});
