import path from 'path';
import { hintFile, formatFile } from '../../../src';
import parse from '../../../src/parse';

const rule = path.basename(__dirname);

describe(`rule ${ rule }`, () => {
    const result = hintFile(path.join(__dirname, 'case.html'));

    it('should return right result', () => {
        expect(result.length).toBe(2);

        expect(result[0].type).toBe('WARN');
        expect(result[0].code).toBe('022');
        expect(result[0].line).toBe(8);
        expect(result[0].column).toBe(5);

        expect(result[1].type).toBe('WARN');
        expect(result[1].code).toBe('022');
        expect(result[1].line).toBe(9);
        expect(result[1].column).toBe(5);

    });
});

describe(`format rule ${ rule }`, () => {
    const document = parse(formatFile(path.join(__dirname, 'case.html')));

    it('should format well', () => {
        document.querySelectorAll('link').forEach(element => {
            expect(!element.getAttribute('rel')).toBe(false);
        });
    });
});
