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
    const result6 = hintFile(path.join(__dirname, 'case6.html'));

    it('should return right result', () => {
        expect(result1.length).toBe(1);
        expect(result1[0].type).toBe('WARN');
        expect(result1[0].code).toBe('024');
        expect(result1[0].line).toBe(3);
        expect(result1[0].column).toBe(1);

        expect(result2.length).toBe(1);
        expect(result2[0].type).toBe('WARN');
        expect(result2[0].code).toBe('024');
        expect(result2[0].line).toBe(3);
        expect(result2[0].column).toBe(1);

        expect(result3.length).toBe(1);
        expect(result3[0].type).toBe('WARN');
        expect(result3[0].code).toBe('025');
        expect(result3[0].line).toBe(6);
        expect(result3[0].column).toBe(5);

        expect(result4.length).toBe(1);
        expect(result4[0].type).toBe('WARN');
        expect(result4[0].code).toBe('025');
        expect(result4[0].line).toBe(4);
        expect(result4[0].column).toBe(5);

        expect(result5.length).toBe(0);
        expect(result6.length).toBe(0);
    });
});

describe(`format rule ${ rule }`, () => {
    const head1 = parse(formatFile(path.join(__dirname, 'case1.html'))).querySelector('head');
    const head2 = parse(formatFile(path.join(__dirname, 'case2.html'))).querySelector('head');
    const head3 = parse(formatFile(path.join(__dirname, 'case3.html'))).querySelector('head');
    const head4 = parse(formatFile(path.join(__dirname, 'case4.html'))).querySelector('head');
    const head5 = parse(formatFile(path.join(__dirname, 'case5.html'))).querySelector('head');
    const head7 = parse(formatFile(path.join(__dirname, 'case7.html'))).querySelector('head');
    const head8 = parse(formatFile(path.join(__dirname, 'case8.html'))).querySelector('head');

    it('should format well', () => {
        let title;
        let charsetMeta;

        title = head1.querySelector('title');
        charsetMeta = head1.querySelector('meta[charset]');
        expect(title.previousElementSibling).toBe(charsetMeta);

        title = head2.querySelector('title');
        charsetMeta = head2.querySelector('meta[charset]');
        expect(title.previousElementSibling).toBe(charsetMeta);

        title = head3.querySelector('title');
        charsetMeta = head3.querySelector('meta[charset]');
        expect(title.previousElementSibling).toBe(charsetMeta);

        title = head4.querySelector('title');
        charsetMeta = head4.querySelector('meta[charset]');
        expect(title.previousElementSibling).toBe(charsetMeta);

        expect(!head5).toBe(true);

        title = head7.querySelector('title');
        expect(title).toBe(head7.firstElementChild);

        title = head8.querySelector('title');
        expect(title).toBe(head8.firstElementChild);
    });
});
