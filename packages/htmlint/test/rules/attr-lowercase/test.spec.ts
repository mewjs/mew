import path from 'path';
import { hintFile } from '../../../src';

const rule = path.basename(__dirname);

describe(`hint rule ${ rule }`, () => {
    const result = hintFile(path.join(__dirname, 'case.html'));

    it('should return right result', () => {
        expect(result.length).toBe(2);

        expect(result[0].type).toBe('WARN');
        expect(result[0].code).toBe('029');
        expect(result[0].line).toBe(11);
        expect(result[0].column).toBe(10);

        expect(result[1].type).toBe('WARN');
        expect(result[1].code).toBe('029');
        expect(result[1].line).toBe(12);
        expect(result[1].column).toBe(10);
    });
});
