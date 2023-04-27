import path from 'path';
import { hintFile } from '../../../src';

const rule = path.basename(__dirname);

describe(`rule ${ rule }`, () => {

    it('no bom should be all right', () => {
        const result = hintFile(path.join(__dirname, 'case-no-bom.html'));
        expect(result.length).toBe(0);
    });

    it('with bom should be warning', () => {
        const result = hintFile(path.join(__dirname, 'case-with-bom.html'));
        expect(result.length).toBe(1);

        expect(result[0].type).toBe('WARN');
        expect(result[0].code).toBe('046');
        expect(result[0].line).toBe(1);
        expect(result[0].column).toBe(1);
    });
});
