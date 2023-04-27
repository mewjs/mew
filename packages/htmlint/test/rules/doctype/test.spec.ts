import path from 'path';
import type HTMLNode from '@mewjs/dom';
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
        expect(result1[0].code).toBe('009');
        expect(result1[0].line).toBe(1);
        expect(result1[0].column).toBe(1);

        expect(result2.length).toBe(0);

        expect(result3[0].type).toBe('WARN');
        expect(result3[0].code).toBe('041');
        expect(result3[0].line).toBe(1);
        expect(result3[0].column).toBe(1);

        expect(result4[0].type).toBe('WARN');
        expect(result4[0].code).toBe('041');
        expect(result4[0].line).toBe(1);
        expect(result4[0].column).toBe(1);
    });
});

describe(`format rule ${ rule }`, () => {
    const doc1 = parse(formatFile(path.join(__dirname, 'case1.html')));
    const doctype1 = doc1.doctype as HTMLNode;

    const doc3 = parse(formatFile(path.join(__dirname, 'case3.html')));
    const doctype3 = doc3.doctype as HTMLNode;

    it('should format well', () => {
        expect(!!doctype1).toBe(true);
        expect(doctype1.name).toBe('html');

        expect(!!doctype3).toBe(true);
        expect(doctype3.name).toBe('html');
    });
});
