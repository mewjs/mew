import mock from 'mock-fs';
import Manis from '../src/manis';

describe('debug', () => {
    afterEach(() => {
        mock.restore();
    });

    it('normal usage', () => {
        mock({
            '/default/path/to/.mewrc': '{"foo": true}',
            '/path/to/.mewrc': '{"bar": true}'
        });

        const manis = new Manis('.mewrc');
        manis.setDefault('/default/path/to/.mewrc');

        const config = manis.from('/path/to/foo.js');

        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
    });
});
