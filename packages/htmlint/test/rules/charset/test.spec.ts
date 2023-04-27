import path from 'path';
import { hintFile, formatFile } from '../../../src';
import parse from '../../../src/parse';

const rule = path.basename(__dirname);

describe(`rule ${ rule }`, () => {
    const result1 = hintFile(path.join(__dirname, 'case1.html'));
    const result2 = hintFile(path.join(__dirname, 'case2.html'));
    const result3 = hintFile(path.join(__dirname, 'case3.html'));
    const result4 = hintFile(path.join(__dirname, 'case4.html'));
    const result5 = hintFile(path.join(__dirname, 'case5.html'));

    it('should return right result', () => {
        expect(result1.length).toBe(1);
        expect(result1[0].type).toBe('WARN');
        expect(result1[0].code).toBe('006');
        expect(result1[0].line).toBe(3);
        expect(result1[0].column).toBe(1);

        expect(result2.length).toBe(1);
        expect(result2[0].type).toBe('WARN');
        expect(result2[0].code).toBe('007');
        expect(result2[0].line).toBe(5);
        expect(result2[0].column).toBe(5);

        expect(result3.length).toBe(1);
        expect(result3[0].type).toBe('WARN');
        expect(result3[0].code).toBe('006');
        expect(result3[0].line).toBe(3);
        expect(result3[0].column).toBe(1);

        expect(result4.length).toBe(0);
        expect(result5.length).toBe(0);
    });
});

describe(`format rule ${ rule }`, () => {
    const result1 = formatFile(path.join(__dirname, 'case1.html'));
    const head1 = parse(result1).querySelector('head');
    const charset1 = head1.querySelector('meta[charset]');

    const result2 = formatFile(path.join(__dirname, 'case2.html'));
    const head2 = parse(result2).querySelector('head');
    const charset2 = head2.querySelector('meta[charset]');

    const result3 = formatFile(path.join(__dirname, 'case3.html'));
    const head3 = parse(result3).querySelector('head');
    const charset3 = head3.querySelector('meta[charset]');

    const result5 = formatFile(path.join(__dirname, 'case5.html'));
    const head5 = parse(result5).querySelector('head');
    const charset5 = head5.querySelector('meta[charset]');

    const result6 = formatFile(path.join(__dirname, 'case6.html'));
    const head6 = parse(result6).querySelector('head');
    const charset6 = head6.querySelector('meta[charset]');

    it('should format well', () => {
        expect(!!charset1).toBe(true);
        expect(charset1 === head1.firstElementChild).toBe(true);

        expect(!!charset2).toBe(true);
        expect(charset2 === head2.firstElementChild).toBe(true);

        expect(!!charset3).toBe(true);
        expect(charset3 === head3.firstElementChild).toBe(true);

        expect(!!charset5).toBe(true);
        expect(charset5 === head5.firstElementChild).toBe(true);

        expect(!!charset6).toBe(true);
        expect(charset6 === head6.firstElementChild).toBe(true);
    });
});
