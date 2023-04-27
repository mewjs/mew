import {
    hslToRgb,
    colorToHex
} from '../../src/utils/color';

describe('color utils', () => {
    it('hslToRgb', () => {
        expect(hslToRgb(0, 0, .39)).toEqual([99.45, 99.45, 99.45]);
        expect(hslToRgb(0.8, 0, .4)).toEqual([102, 102, 102]);
        expect(hslToRgb(0.8, 0, 0.8)).toEqual([204, 204, 204]);

        expect(hslToRgb(1, 0.5, 0.5)).toEqual([191.25, 63.75, 63.75]);
        expect(hslToRgb(1, 0.2, 0.5)).toEqual([153, 102, 102]);
        expect(hslToRgb(1, 0.3, 0.1)).toEqual([33.15, 17.85, 17.85]);
    });

    it('colorToHex', () => {
        expect(colorToHex('rgb', ['0', '0', '0'])).toBe('#000');
        expect(colorToHex('rgb', ['0', '0'])).toBe(null);
        expect(colorToHex('rgba', ['0', '0', '0', '0%'])).toBe('#000');
        expect(colorToHex('rgba', ['255', '0', '0', '0%'])).toBe('#f00');
        expect(colorToHex('rgba', ['0', '0', '0', '50%'])).toBe('#00000080');
        expect(colorToHex('hsl', ['0', '0', '39%'])).toBe('#636363');

    });

});
