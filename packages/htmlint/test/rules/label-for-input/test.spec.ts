import path from 'path';
import * as htmlint from '../../../src';

const rule = path.basename(__dirname);

describe(`hint rule ${ rule }`, () => {

    it('should return the right result', () => {
        const result = htmlint.hintFile(path.join(__dirname, 'case.html'));
        expect(result.length).toBe(2);

        expect(result[0].type).toBe('WARN');
        expect(result[0].code).toBe('044');
        expect(result[0].line).toBe(8);
        expect(result[0].column).toBe(5);

        expect(result[1].type).toBe('WARN');
        expect(result[1].code).toBe('044');
        expect(result[1].line).toBe(10);
        expect(result[1].column).toBe(5);
    });
});
