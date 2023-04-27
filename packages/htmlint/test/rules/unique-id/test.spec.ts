import path from 'path';
import { hintFile } from '../../../src';

const rule = path.basename(__dirname);

describe(`rule ${ rule }`, () => {
    const result = hintFile(path.join(__dirname, 'case.html'));

    it('should return right result', () => {
        expect(result.length).toBe(4);

        expect(result[0].type).toBe('WARN');
        expect(result[0].code).toBe('026');
        expect(result[0].line).toBe(11);
        expect(result[0].column).toBe(5);

        expect(result[1].type).toBe('WARN');
        expect(result[1].code).toBe('026');
        expect(result[1].line).toBe(12);
        expect(result[1].column).toBe(5);

        expect(result[2].type).toBe('WARN');
        expect(result[2].code).toBe('026');
        expect(result[2].line).toBe(13);
        expect(result[2].column).toBe(5);

        expect(result[3].type).toBe('WARN');
        expect(result[3].code).toBe('026');
        expect(result[3].line).toBe(14);
        expect(result[3].column).toBe(5);
    });
});
