import path from 'path';
import { hintFile } from '../../../src';

const rule = path.basename(__dirname);

describe(`hint rule ${ rule }`, () => {
    const result1 = hintFile(path.join(__dirname, 'case1.html'));
    const result2 = hintFile(path.join(__dirname, 'case2.html'));

    it('should return right result (use ["ad"] as default)', () => {
        expect(result1.length).toBe(4);

        expect(result1[0].type).toBe('WARN');
        expect(result1[0].code).toBe('031');
        expect(result1[0].line).toBe(11);
        expect(result1[0].column).toBe(14);

        expect(result1[1].type).toBe('WARN');
        expect(result1[1].code).toBe('031');
        expect(result1[1].line).toBe(12);
        expect(result1[1].column).toBe(19);

        expect(result1[2].type).toBe('WARN');
        expect(result1[2].code).toBe('031');
        expect(result1[2].line).toBe(13);
        expect(result1[2].column).toBe(22);

        expect(result1[3].type).toBe('WARN');
        expect(result1[3].code).toBe('031');
        expect(result1[3].line).toBe(14);
        expect(result1[3].column).toBe(17);
    });

    it('should be configable', () => {
        expect(result2.length).toBe(4);

        expect(result2[0].type).toBe('WARN');
        expect(result2[0].code).toBe('031');
        expect(result2[0].line).toBe(12);
        expect(result2[0].column).toBe(14);

        expect(result2[1].type).toBe('WARN');
        expect(result2[1].code).toBe('031');
        expect(result2[1].line).toBe(13);
        expect(result2[1].column).toBe(19);

        expect(result2[2].type).toBe('WARN');
        expect(result2[2].code).toBe('031');
        expect(result2[2].line).toBe(14);
        expect(result2[2].column).toBe(22);

        expect(result2[3].type).toBe('WARN');
        expect(result2[3].code).toBe('031');
        expect(result2[3].line).toBe(15);
        expect(result2[3].column).toBe(17);
    });
});
