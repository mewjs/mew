import fs from 'fs';
import path from 'path';
import { load } from '../../../src/config';
import { hint } from '../../../src';

describe('config max-error', () => {
    const filePath = path.join(__dirname, 'case.html');
    const code = fs.readFileSync(filePath, 'utf-8');
    const cfg = load(filePath);

    const result = hint(code, cfg);

    cfg['max-error'] = 0;
    const result0 = hint(code, cfg);

    cfg['max-error'] = 5;
    const result5 = hint(code, cfg);

    cfg['max-error'] = 10;
    const result10 = hint(code, cfg);

    it('should return right result with given num', () => {
        expect(result5.length).toBe(5);
        expect(result10.length).toBe(10);
    });

    it('should take 0 as no limit', () => {
        expect(result0.length).toBe(result.length);
    });
});
