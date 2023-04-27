import path from 'path';
import { hintFile, formatFile } from '../../../src';
import parse from '../../../src/parse';

const rule = path.basename(__dirname);

describe(`rule ${ rule }`, () => {
    const result1 = hintFile(path.join(__dirname, 'case1.html'));
    const result2 = hintFile(path.join(__dirname, 'case2.html'));
    const result3 = hintFile(path.join(__dirname, 'case3.html'));
    const result4 = hintFile(path.join(__dirname, 'case4.html'));

    it('should return right result', () => {
        expect(result1.length).toBe(1);
        expect(result1[0].type).toBe('WARN');
        expect(result1[0].code).toBe('027');
        expect(result1[0].line).toBe(3);
        expect(result1[0].column).toBe(1);

        expect(result2.length).toBe(1);
        expect(result2[0].type).toBe('WARN');
        expect(result2[0].code).toBe('027');
        expect(result2[0].line).toBe(3);
        expect(result2[0].column).toBe(1);

        expect(result3.length).toBe(0);
        expect(result4.length).toBe(0);
    });
});

describe(`format rule ${ rule }`, () => {
    const head1 = parse(formatFile(path.join(__dirname, 'case1.html'))).querySelector('head');
    const head2 = parse(formatFile(path.join(__dirname, 'case2.html'))).querySelector('head');
    const head3 = parse(formatFile(path.join(__dirname, 'case3.html'))).querySelector('head');
    const head4 = parse(formatFile(path.join(__dirname, 'case4.html'))).querySelector('head');

    it('should format well', () => {
        expect(!!head1.querySelector('meta[name="viewport"]')).toBe(true);
        expect(!!head2.querySelector('meta[name="viewport"]')).toBe(true);
        expect(!head3).toBe(true);
        expect(
            head4.querySelector('meta[name="viewport"]').getAttribute('content')
        ).toBe('width=device-width, initial-scale=2, maximum-scale=1');
    });
});
