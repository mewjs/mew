import path from 'path';
import { hintFile, formatFile } from '../../../src';
import parse from '../../../src/parse';

const rule = path.basename(__dirname);

describe(`hint rule ${ rule }`, () => {
    const result = hintFile(path.join(__dirname, 'case.html'));

    it('should return right result', () => {
        expect(result.length).toBe(3);

        expect(result[0].type).toBe('WARN');
        expect(result[0].code).toBe('001');
        expect(result[0].line).toBe(11);
        expect(result[0].column).toBe(5);

        expect(result[1].type).toBe('WARN');
        expect(result[1].code).toBe('001');
        expect(result[1].line).toBe(13);
        expect(result[1].column).toBe(5);

        expect(result[2].type).toBe('WARN');
        expect(result[2].code).toBe('002');
        expect(result[2].line).toBe(16);
        expect(result[2].column).toBe(5);
    });
});

describe(`format rule ${ rule }`, () => {
    const result = formatFile(path.join(__dirname, 'case.html'));

    const document = parse(result);

    const links = document.querySelectorAll('link');
    const styles = document.querySelectorAll('style');
    const scripts = document.querySelectorAll('script');

    it('should format well', () => {
        expect(links[0].hasAttribute('type')).toBe(false);
        expect(links[1].hasAttribute('type')).toBe(false);
        expect(styles[0].hasAttribute('type')).toBe(false);
        expect(styles[1].hasAttribute('type')).toBe(false);
        expect(scripts[0].hasAttribute('type')).toBe(false);
        expect(scripts[1].getAttribute('type')).toBe('text/plain');
        expect(scripts[2].hasAttribute('type')).toBe(false);
    });
});
