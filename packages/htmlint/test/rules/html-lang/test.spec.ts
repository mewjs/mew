import path from 'path';
import { hintFile, formatFile } from '../../../src';
import parse from '../../../src/parse';

const rule = path.basename(__dirname);

describe(`rule ${ rule }`, () => {
    const result1 = hintFile(path.join(__dirname, 'case1.html'));
    const result2 = hintFile(path.join(__dirname, 'case2.html'));
    const result3 = hintFile(path.join(__dirname, 'case3.html'));

    it('should return right result', () => {
        expect(result1.length).toBe(1);

        expect(result1[0].type).toBe('WARN');
        expect(result1[0].code).toBe('010');
        expect(result1[0].line).toBe(2);
        expect(result1[0].column).toBe(1);

        expect(result2.length).toBe(0);
        expect(result3.length).toBe(0);
    });
});

describe(`format rule ${ rule }`, () => {
    const html1 = parse(formatFile(path.join(__dirname, 'case1.html'))).querySelector('html');
    const html2 = parse(formatFile(path.join(__dirname, 'case2.html'))).querySelector('html');

    it('should format well', () => {
        expect(html1.getAttribute('lang')).toBe('zh-CN');
        expect(!html2).toBe(true);
    });
});
