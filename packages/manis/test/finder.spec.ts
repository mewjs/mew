import path from 'path';
import mock from 'mock-fs';

import Finder from '../src/finder';
import type { Config } from '../src/types';


describe('finder', () => {

    it('should be a constructor', () => {

        expect(typeof Finder).toBe('function');
        expect(Finder.prototype.constructor).toBe(Finder);

    });

    it('has a static method', () => {

        expect(typeof Finder.create).toBe('function');

    });

    it('should be have from method', () => {

        expect(typeof Finder.prototype.from).toBe('function');

    });

    describe('Finder#from', () => {
        afterEach(() => {
            mock.restore();
        });

        it('basic function', () => {
            const finder = Finder.create('foo.json');

            mock({
                'path/to/foo.json': '{"foo": true}'
            });

            const config = finder.from('path/to/');

            expect(config).toBeDefined();
            expect(config.foo).toBe(true);
        });

        it('not merge up any more', () => {
            const finder = Finder.create('foo.json');

            mock({
                'path/foo.json': '{"foo": false, "bar": true}',
                'path/to/foo.json': '{"foo": true}'
            });

            const config = finder.from('path/to/');

            expect(config).toBeDefined();
            expect(config.foo).toBe(true);
            expect(config.bar).toBeUndefined();
        });


        it('should be cacheable', () => {
            const finder = new Finder({
                name: 'foo.json',
                cache: true
            });

            mock({
                'path/foo.json': '{"foo": false, "bar": true}',
                'path/to/foo.json': '{"foo": true}'
            });

            let config = finder.from('path/to/');

            expect(config.foo).toBe(true);
            finder.cached![path.resolve('path/to/')].foo = false;

            config = finder.from('path/to/');
            expect(config.foo).toBe(false);
        });

        it('custom getter - field name', () => {
            const finder = new Finder({
                name: 'foo.json',
                get: 'mew'
            });

            mock({
                'path/to/foo.json': '{"mew": {"foo": true}}'
            });

            const config = finder.from('path/to/');

            expect(config.foo).toBe(true);
        });

        it('custom getter - function', () => {
            const finder = new Finder({
                name: 'foo.json',
                get: (config: Config) => (config.mew as Config)
            });

            mock({
                'path/to/foo.json': '{"mew": {"foo": false, "bar": true}}'
            });

            const config = finder.from('path/to/');

            expect(config.foo).toBe(false);
            expect(config.bar).toBe(true);
        });

        it('custom loader', () => {
            const finder = Finder.create({
                name: 'foo.json',
                loader() {
                    return { foo: false };
                }
            });

            mock({
                'path/foo.json': '{"foo": false, "bar": true}',
                'path/to/foo.json': '{"foo": true}'
            });

            const config = finder.from('path/to/');

            expect(config).toBeDefined();
            expect(config.foo).toBe(false);
            expect(config.bar).toBeUndefined();
        });

        it('custom loader - multi params', () => {
            const finder = Finder.create(
                'foo.json',
                true,
                void 0
            );

            mock({
                'path/foo.json': '{"foo": false, "bar": true}',
                'path/to/foo.json': '{"foo": true}'
            });

            const config = finder.from('path/to/');

            expect(config.foo).toBe(true);
            expect(config.bar).toBeUndefined();
        });
    });
});
