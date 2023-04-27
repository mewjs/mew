import path from 'path';
import { app, getHomePath } from '../src/fs-util';
import packageInfo from '../package.json';

describe('app', () => {

    describe('root', () => {
        it('should be a string', () => {
            expect(typeof app.root).toBe('string');
        });

        it('should be the dir path where package.json locates', () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            expect(require(path.join(app.root, 'package.json'))).toBe(packageInfo);
        });
    });
});

describe('getHomePath', () => {

    it('should return a path', () => {
        expect(typeof getHomePath()).toBe('string');
    });
});
