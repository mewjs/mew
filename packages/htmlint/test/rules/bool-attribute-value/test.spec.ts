import path from 'path';
import { hintFile, formatFile } from '../../../src';

const rule = path.basename(__dirname);

describe(`rule ${ rule }`, () => {
    const result = hintFile(path.join(__dirname, 'case.html'));

    it('should return right result', () => {
        expect(result.length).toBe(6);

        expect(result[0].type).toBe('WARN');
        expect(result[0].code).toBe('003');
        expect(result[0].line).toBe(11);
        expect(result[0].column).toBe(5);

        expect(result[1].type).toBe('WARN');
        expect(result[1].code).toBe('003');
        expect(result[1].line).toBe(13);
        expect(result[1].column).toBe(5);

        expect(result[2].type).toBe('WARN');
        expect(result[2].code).toBe('003');
        expect(result[2].line).toBe(15);
        expect(result[2].column).toBe(5);

        expect(result[3].type).toBe('WARN');
        expect(result[3].code).toBe('003');
        expect(result[3].line).toBe(17);
        expect(result[3].column).toBe(5);

        expect(result[4].type).toBe('WARN');
        expect(result[4].code).toBe('003');
        expect(result[4].line).toBe(19);
        expect(result[4].column).toBe(5);

        expect(result[5].type).toBe('WARN');
        expect(result[5].code).toBe('003');
        expect(result[5].line).toBe(21);
        expect(result[5].column).toBe(5);
    });
});

describe(`format rule ${ rule }`, () => {
    const result = formatFile(path.join(__dirname, 'case.html'));

    it('should format well', () => {
        expect(/\sasync=/.test(result)).toBe(false);
        expect(/\schecked=/.test(result)).toBe(false);
        expect(/\sdefer=/.test(result)).toBe(false);
        expect(/\sdisabled=/.test(result)).toBe(false);
        expect(/\sreadonly=/.test(result)).toBe(false);
        expect(/\srequired=/.test(result)).toBe(false);
    });
});
