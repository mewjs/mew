import path from 'path';
import { hintFile, formatFile } from '../../../src';
import parse from '../../../src/parse';

const rule = path.basename(__dirname);

describe(`rule ${ rule }`, () => {
    const result = hintFile(path.join(__dirname, 'case.html'));

    it('should return right result', () => {
        expect(result.length).toBe(2);

        expect(result[0].type).toBe('WARN');
        expect(result[0].code).toBe('008');
        expect(result[0].line).toBe(16);
        expect(result[0].column).toBe(5);

        expect(result[1].type).toBe('WARN');
        expect(result[1].code).toBe('008');
        expect(result[1].line).toBe(21);
        expect(result[1].column).toBe(5);
    });
});

describe(`format rule ${ rule }`, () => {
    const result = formatFile(path.join(__dirname, 'case.html'));

    const document = parse(result);

    const head = document.querySelector('head');
    const styles = document.querySelectorAll('link[rel="stylesheet"], style');

    it('should format well', () => {
        for (let i = 0, l = styles.length; i < l; i++) {
            expect(head.contains(styles[i])).toBe(true);
        }
    });
});
