import path from 'path';
import { hintFile } from '../../src';

/* eslint-disable-next-line max-lines-per-function */
describe('do config in comment', () => {
    const result1 = hintFile(path.join(__dirname, 'case1.html'));
    const result2 = hintFile(path.join(__dirname, 'case2.html'));
    const result3 = hintFile(path.join(__dirname, 'case3.html'));
    const result4 = hintFile(path.join(__dirname, 'case4.html'));
    const result5 = hintFile(path.join(__dirname, 'case5.html'));
    const result6 = hintFile(path.join(__dirname, 'case6.html'));
    const result7 = hintFile(path.join(__dirname, 'case7.html'));
    const result8 = hintFile(path.join(__dirname, 'case8.html'));
    const result9 = hintFile(path.join(__dirname, 'case9.html'));
    const result10 = hintFile(path.join(__dirname, 'case10.html'));
    const result11 = hintFile(path.join(__dirname, 'case11.html'));

    it('should return right result while do disable', () => {
        expect(result1.length).toBe(0);

        expect(result2.length).toBe(2);
        expect(result2[0].type).toBe('WARN');
        expect(result2[0].code).toBe('013');
        expect(result2[0].line).toBe(2);
        expect(result2[0].column).toBe(1);
        expect(result2[1].type).toBe('WARN');
        expect(result2[1].code).toBe('028');
        expect(result2[1].line).toBe(5);
        expect(result2[1].column).toBe(25);

        expect(result3.length).toBe(1);
        expect(result3[0].type).toBe('WARN');
        expect(result3[0].code).toBe('013');
        expect(result3[0].line).toBe(2);
        expect(result3[0].column).toBe(1);
    });

    it('should return right result while do enable', () => {
        expect(result4.length).toBe(4);
        expect(result4[0].type).toBe('WARN');
        expect(result4[0].code).toBe('012');
        expect(result4[0].line).toBe(3);
        expect(result4[0].column).toBe(1);
        expect(result4[1].type).toBe('WARN');
        expect(result4[1].code).toBe('013');
        expect(result4[1].line).toBe(3);
        expect(result4[1].column).toBe(1);
        expect(result4[2].type).toBe('WARN');
        expect(result4[2].code).toBe('012');
        expect(result4[2].line).toBe(4);
        expect(result4[2].column).toBe(1);
        expect(result4[3].type).toBe('WARN');
        expect(result4[3].code).toBe('028');
        expect(result4[3].line).toBe(6);
        expect(result4[3].column).toBe(25);

        expect(result5.length).toBe(2);
        expect(result5[0].type).toBe('WARN');
        expect(result5[0].code).toBe('012');
        expect(result5[0].line).toBe(3);
        expect(result5[0].column).toBe(1);
        expect(result5[1].type).toBe('WARN');
        expect(result5[1].code).toBe('012');
        expect(result5[1].line).toBe(4);
        expect(result5[1].column).toBe(1);

        expect(result6.length).toBe(3);
        expect(result6[0].type).toBe('WARN');
        expect(result6[0].code).toBe('012');
        expect(result6[0].line).toBe(3);
        expect(result6[0].column).toBe(1);
        expect(result6[1].type).toBe('WARN');
        expect(result6[1].code).toBe('012');
        expect(result6[1].line).toBe(4);
        expect(result6[1].column).toBe(1);
        expect(result6[2].type).toBe('WARN');
        expect(result6[2].code).toBe('028');
        expect(result6[2].line).toBe(6);
        expect(result6[2].column).toBe(25);
    });

    it('should return right result while do config', () => {
        expect(result7.length).toBe(2);
        expect(result7[0].type).toBe('WARN');
        expect(result7[0].code).toBe('013');
        expect(result7[0].line).toBe(2);
        expect(result7[0].column).toBe(1);
        expect(result7[1].type).toBe('WARN');
        expect(result7[1].code).toBe('028');
        expect(result7[1].line).toBe(5);
        expect(result7[1].column).toBe(25);

        expect(result8.length).toBe(1);
        expect(result8[0].type).toBe('WARN');
        expect(result8[0].code).toBe('013');
        expect(result8[0].line).toBe(3);
        expect(result8[0].column).toBe(1);

        expect(result9.length).toBe(4);
        expect(result9[0].type).toBe('WARN');
        expect(result9[0].code).toBe('012');
        expect(result9[0].line).toBe(3);
        expect(result9[0].column).toBe(1);
        expect(result9[1].type).toBe('WARN');
        expect(result9[1].code).toBe('013');
        expect(result9[1].line).toBe(3);
        expect(result9[1].column).toBe(1);
        expect(result9[2].type).toBe('WARN');
        expect(result9[2].code).toBe('012');
        expect(result9[2].line).toBe(4);
        expect(result9[2].column).toBe(1);
        expect(result9[3].type).toBe('WARN');
        expect(result9[3].code).toBe('028');
        expect(result9[3].line).toBe(6);
        expect(result9[3].column).toBe(25);

        expect(result10.length).toBe(4);
        expect(result10[0].type).toBe('WARN');
        expect(result10[0].code).toBe('015');
        expect(result10[0].line).toBe(3);
        expect(result10[0].column).toBe(1);
        expect(result10[1].type).toBe('WARN');
        expect(result10[1].code).toBe('015');
        expect(result10[1].line).toBe(4);
        expect(result10[1].column).toBe(1);
        expect(result10[2].type).toBe('WARN');
        expect(result10[2].code).toBe('015');
        expect(result10[2].line).toBe(5);
        expect(result10[2].column).toBe(1);
        expect(result10[3].type).toBe('WARN');
        expect(result10[3].code).toBe('015');
        expect(result10[3].line).toBe(6);
        expect(result10[3].column).toBe(1);
    });

    it('should be configurable by line', () => {
        expect(result11.length).toBe(7);

        expect(result11[0].type).toBe('WARN');
        expect(result11[0].code).toBe('012');
        expect(result11[0].line).toBe(1);
        expect(result11[0].column).toBe(1);
        expect(result11[1].type).toBe('WARN');
        expect(result11[1].code).toBe('015');
        expect(result11[1].line).toBe(5);
        expect(result11[1].column).toBe(1);
        expect(result11[2].type).toBe('WARN');
        expect(result11[2].code).toBe('012');
        expect(result11[2].line).toBe(7);
        expect(result11[2].column).toBe(1);
        expect(result11[3].type).toBe('WARN');
        expect(result11[3].code).toBe('015');
        expect(result11[3].line).toBe(7);
        expect(result11[3].column).toBe(1);
        expect(result11[4].type).toBe('WARN');
        expect(result11[4].code).toBe('012');
        expect(result11[4].line).toBe(9);
        expect(result11[4].column).toBe(1);
        expect(result11[5].type).toBe('WARN');
        expect(result11[5].code).toBe('029');
        expect(result11[5].line).toBe(11);
        expect(result11[5].column).toBe(4);
        expect(result11[6].type).toBe('WARN');
        expect(result11[6].code).toBe('029');
        expect(result11[6].line).toBe(15);
        expect(result11[6].column).toBe(4);
    });
});
