import path from 'path';
import { hintFile } from '../../../src';

const rule = path.basename(__dirname);

describe(`hint rule ${ rule }`, () => {
    const result = hintFile(path.join(__dirname, 'case.html'));

    it('should return right result', () => {
        expect(result.length).toBe(1);

        expect(result[0].type).toBe('WARN');
        expect(result[0].code).toBe('050');
        expect(result[0].line).toBe(4);
        expect(result[0].column).toBe(26);

    });
});
