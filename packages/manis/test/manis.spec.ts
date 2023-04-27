import path from 'path';
import mock from 'mock-fs';

import Manis from '../src/manis';
import type { Config } from '../src/types';


describe('manis@static', () => {

    it('should be a constructor', () => {

        expect(typeof Manis).toBe('function');
        expect(Manis.prototype.constructor).toBe(Manis);

    });


    it('should be having `from` method', () => {

        expect(typeof Manis.prototype.from).toBe('function');

    });

});


describe('Mains#setDefault', () => {
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

    it('invalid arguments', () => {

        const manis = new Manis('.mewrc');

        const sendInvalidPath = () => {
            manis.setDefault('/default/path/to/');
        };

        expect(sendInvalidPath).toThrow();
    });

    it('config new finder', () => {
        mock({
            '/default/path/to/.mewrc': '{"mew": {"foo": true}}',
            '/path/to/.mewrc': '{"bar": true}'
        });

        const manis = new Manis('.mewrc');
        manis.setDefault('/default/path/to/.mewrc', { get: 'mew' });

        const config = manis.from('/path/to/foo.js');

        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
    });

    it('no default config file', () => {
        mock({
            '/default/path/to/.mewrc': '{"mew": {"foo": true}}',
            '/path/to/.mewrc': '{"bar": true}'
        });

        const manis = new Manis('.mewrc');
        manis.setDefault('/default/path/.mewrc', { get: 'mew' });

        expect(manis.defaultConfig).toEqual(Object.create(null));

        const config = manis.from('/path/to/foo.js');

        expect(config.foo).toBeUndefined();
        expect(config.bar).toBe(true);
    });

    it('get from existing finder but another name', () => {
        mock({
            '/default/path/to/mew.json': '{"foo": true}',
            '/path/to/.mewrc': '{"bar": true}'
        });

        const manis = new Manis('.mewrc');
        manis.setDefault('/default/path/to/mew.json');

        const config = manis.from('/path/to/foo.js');

        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
    });

    it('set defaultConfig directly', () => {
        mock({
            '/path/to/.mewrc': '{"bar": true}'
        });

        const manis = new Manis('.mewrc');
        manis.setDefault({ foo: true });

        const config = manis.from('/path/to/foo.js');

        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
    });

});

describe('Mains#setUserConfig', () => {
    afterEach(() => {
        mock.restore();
    });

    it('normal usage', () => {
        const home = process.env.HOME;
        const mockConfig = {
            '/default/path/to/.mewrc': '{"foo": true, "id": 1}',
            '/path/to/.mewrc': '{"bar": true, "id": 3}'
        };

        mockConfig[`${ home }/.mewrc`] = '{"baz": true, "id": 2}';
        mock(mockConfig);

        const manis = new Manis('.mewrc');
        manis.setDefault('/default/path/to/.mewrc');
        manis.setUserConfig(`${ home }/.mewrc`);

        const config = manis.from('/path/to/foo.js');

        expect(config.id).toBe(3);
        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
        expect(config.baz).toBe(true);
    });

    it('use `~` should be equal as expect', () => {
        const home = process.env.HOME;
        const mockConfig = {
            '/default/path/to/.mewrc': '{"foo": true, "id": 1}',
            '/path/to/.mewrc': '{"bar": true, "id": 3}'
        };

        mockConfig[`${ home }/.mewrc`] = '{"baz": true, "id": 2}';
        mock(mockConfig);

        const manis = new Manis('.mewrc');
        manis.setDefault('/default/path/to/.mewrc');
        manis.setUserConfig('~/.mewrc');

        const config = manis.from('/path/to/foo.js');

        expect(config.id).toBe(3);
        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
        expect(config.baz).toBe(true);
    });

    it('no user config file', () => {
        mock({
            '/path/to/.mewrc': '{"bar": true}'
        });

        const manis = new Manis('.mewrc');
        manis.setUserConfig('.mewrc', { get: 'mew' });

        expect(manis.userConfig).toEqual(Object.create(null));

        const config = manis.from('/path/to/foo.js');

        expect(config.foo).toBeUndefined();
        expect(config.bar).toBe(true);
    });

    it('get from existing finder but another name', () => {
        const home = process.env.HOME;
        const mockConfig = {
            '/path/to/.mewrc': '{"bar": true}'
        };

        mockConfig[`${ home }/mew.json`] = '{"foo": true}';
        mock(mockConfig);

        const manis = new Manis('.mewrc');
        manis.setUserConfig('mew.json');

        const config = manis.from('/path/to/foo.js');

        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
    });

    it('call userConfig without param', () => {
        const home = process.env.HOME;
        const userConfig = {
            '/path/to/.mewrc': '{"bar": true}'
        };

        userConfig[`${ home }/.mewrc`] = '{"foo": true}';
        mock(userConfig);

        const manis = new Manis('.mewrc');
        manis.setUserConfig();

        const config = manis.from('/path/to/foo.js');

        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
    });

    it('set userConfig directly', () => {
        mock({
            '/path/to/.mewrc': '{"bar": true}'
        });

        const manis = new Manis('.mewrc');
        manis.setUserConfig({ foo: true });

        const config = manis.from('/path/to/foo.js');

        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
    });

});

describe('Manis#from', () => {
    afterEach(() => {
        mock.restore();
    });

    it('basic function', () => {
        const manis = new Manis('foo.json');

        mock({
            'path/to/foo.json': '{"foo": true}'
        });

        const config = manis.from('path/to/hello-world.js');

        expect(config).toBeDefined();
        expect(config.foo).toBe(true);
    });

    it('merge up', () => {
        const manis = new Manis('foo.json');

        mock({
            'path/foo.json': '{"foo": false, "bar": true}',
            'path/to/foo.json': '{"foo": true}'
        });

        const config = manis.from('path/to/hello-world.js');

        expect(config).toEqual({ foo: true, bar: true });
        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
    });

    it('should be cacheable', () => {
        const manis = new Manis([{
            name: 'foo.json',
            cache: true
        }]);

        mock({
            'path/foo.json': '{"foo": false, "bar": true}',
            'path/to/foo.json': '{"foo": true}'
        });

        let config = manis.from('path/to/hello-world.js');

        expect(config.foo).toBe(true);
        manis.cached![path.resolve('path/to/')]!.foo = false;

        config = manis.from('path/to/hello-world.js');
        expect(config.foo).toBe(false);
    });

    it('no cache', () => {
        const manis = new Manis('foo.json', { cache: false });

        mock({
            'path/foo.json': '{"foo": false, "bar": true}',
            'path/to/foo.json': '{"foo": true}'
        });

        const config = manis.from('path/to/hello-world.js');

        expect(config.foo).toBe(true);

        const setCache = () => {
            manis.cached![path.resolve('path/to/')]!.foo = false;
        };

        expect(setCache).toThrow();
        expect(config.foo).toBe(true);
    });

    it('find foo.json and bar.json', () => {
        const manis = new Manis(['foo.json', 'bar.json'], { merge: true });

        mock({
            'path/foo.json': '{"foo": 0, "bar": true}',
            'path/bar.json': '{"foo": 1, "baz": true}',
            'path/to/foo.json': '{"foo": 2}',
            'path/to/bar.json': '{"foo": 3}'
        });

        let config = manis.from('path/to/hello.js');

        expect(config.foo).toBe(2);
        expect(config.bar).toBe(true);
        expect(config.baz).toBe(true);

        config = manis.from('path/world.js');
        expect(config.foo).toBe(0);
    });

    it('find foo.json and bar.json - without merge', () => {
        const manis = new Manis(['bar.json', 'foo.json'], { merge: false });

        mock({
            'path/foo.json': '{"foo": 0, "bar": true}',
            'path/bar.json': '{"foo": 1, "baz": true}',
            'path/to/foo.json': '{"foo": 2}',
            'path/to/bar.json': '{"foo": 3}'
        });

        let config = manis.from('path/to/hello.js');

        expect(config.foo).toBe(3);
        expect(config.bar).toBeUndefined();
        expect(config.baz).toBe(true);

        config = manis.from('path/world.js');
        expect(config.foo).toBe(1);
    });


    it('orphan', () => {
        const manis = new Manis(['bar.json', 'foo.json'], { orphan: true });

        mock({
            'path/foo.json': '{"foo": 0, "bar": true}',
            'path/bar.json': '{"foo": 1, "baz": true}',
            'path/to/foo.json': '{"foo": 2, "bar": 0}',
            'path/to/bar.json': '{"foo": 3}'
        });

        let config = manis.from('path/to/hello.js');

        expect(config.foo).toBe(3);
        expect(config.bar).toBeUndefined();
        expect(config.baz).toBeUndefined();

        config = manis.from('path/world.js');
        expect(config.foo).toBe(1);
    });

    it('orphan but config file not found', () => {
        const manis = new Manis('bar.json', { orphan: true });

        mock({
            'path/foobar.json': '{"foo": 0, "bar": true}'
        });

        manis.setDefault({
            foo: 3
        });
        const config = manis.from('path/to/hello.js');

        expect(config.foo).toBe(3);
        expect(config.bar).toBeUndefined();
        expect(config.baz).toBeUndefined();
    });


    it('enableRoot with `root`', () => {
        const manis = new Manis(['foo.json'], { enableRoot: true });

        mock({
            'path/foo.json': '{"foo": 1, "baz": true}',
            'path/to/foo.json': '{"root": true, "foo": 3}'
        });

        manis.setDefault({ foo: 2, bar: 0 });
        const config = manis.from('path/to/hello.js');

        expect(config.foo).toBe(3);
        expect(config.bar).toBe(0);
        expect(config.baz).toBeUndefined();
    });


    it('enableRoot with `root` and multiple names', () => {
        const manis = new Manis(['foo.json', 'fo.json'], { enableRoot: true });

        mock({
            'path/foo.json': '{"foo": 0, "baz": true}',
            'path/to/foo.json': '{"foo": 1}',
            'path/to/a/foo.json': '{"foo": 2}',
            'path/to/a/b/foo.json': '{"foo": 3}',
            'path/to/a/b/c/foo.json': '{"root": true, "foo": 4, "path": "c"}',
            'path/to/a/b/c/d/foo.json': '{"foo": 5}',
            'path/to/fo.json': '{"foo": 6}',
            'path/to/a/fo.json': '{"foo": 7, "file": "a"}',
            'path/to/a/b/fo.json': '{"root": true, "foo": 8, "file": "b"}',
            'path/to/a/b/c/fo.json': '{"foo": 9}',
            'path/to/a/b/c/d/fo.json': '{"foo": 10}',
        });

        manis.setDefault({ foo: -1, bar: 0 });
        const config = manis.from('path/to/a/b/c/d/hello.js');

        /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
        expect(config.foo).toBe(5);
        expect(config.bar).toBe(0);
        expect(config.path).toBe('c');
        expect(config.file).toBeUndefined();
        expect(config.baz).toBeUndefined();
    });

    it('enableRoot with `bar`', () => {
        const manis = new Manis('foo.json', {
            rootName: 'bar',
            enableRoot: true
        });

        mock({
            'path/foo.json': '{"foo": 1, "baz": true}',
            'path/to/foo.json': '{"foo": 3}'
        });

        manis.setDefault({ foo: 2, bar: 0 });
        const config = manis.from('path/to/hello.js');

        expect(config.foo).toBe(3);
        expect(config.bar).toBe(0);
        expect(config.baz).toBe(true);
    });


    it('no lookup', () => {
        const manis = new Manis('foo.json', { lookup: false });

        mock({
            'path/foo.json': '{"foo": 1, "baz": true}',
            'path/to/foo.json': '{"foo": 3}'
        });

        manis.setDefault({ foo: 2, bar: 0 });
        const config = manis.from('path/to/hello.js');

        expect(config.foo).toBe(2);
        expect(config.bar).toBe(0);
    });

    it('custom getter - field name', () => {
        const manis = new Manis([{
            name: 'foo.json',
            get: 'mew'
        }]);

        mock({
            'path/foo.json': '{"mew": {"foo": false, "bar": true}}',
            'path/to/foo.json': '{"mew": {"foo": true}}'
        });

        const config = manis.from('path/to/hello-world.js');

        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
    });

    it('custom getter - function', () => {
        const manis = new Manis({
            name: 'foo.json',
            get(config: Config) {
                return config.mew as Config;
            }
        });

        mock({
            'path/foo.json': '{"mew": {"foo": false, "bar": true}}',
            'path/to/foo.json': '{"mew": {"foo": true}}'
        });

        const config = manis.from('path/to/hello-world.js');

        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
    });

    it('custom loader', () => {
        const manis = new Manis({
            name: 'foo.json',
            loader() {
                return { foo: false };
            }
        });

        mock({
            'path/foo.json': '{"foo": false, "bar": true}',
            'path/to/foo.json': '{"foo": true}'
        });

        const config = manis.from('path/to/hello-world.js');

        expect(config).toBeDefined();
        expect(config.foo).toBe(false);
        expect(config.bar).toBeUndefined();
    });

    it('custom stopper', () => {
        const manis = new Manis([{
            name: 'foo.json'
        }],
        {
            stopper(start: string, root: string, times: number) {
                return start === root || times > 2;
            }
        });

        mock({
            'path/foo.json': '{"foo": false, "bar": false, "baz": true}',
            'path/to/foo.json': '{"foo": false, "bar": true}',
            'path/to/the/foo.json': '{"foo": true}'
        });

        const config = manis.from('path/to/the/hello-world.js');

        expect(config.foo).toBe(true);
        expect(config.bar).toBe(true);
        expect(config.baz).toBeUndefined();
    });


    it('custom stopper and ignore empty config', () => {
        const stopper = jest.fn(
            (start: string, root: string, times: number) => times > 2 || start === root
        );
        const finder = new Manis([{ name: 'foo.json' }], { stopper, orphan: true });

        mock({
            'path/foo.json': '{"foo": true}',
            'path/to/foo.json': '{"bar": true}',
            'path/to/the/foo.json': '{}'
        });

        const config = finder.from('path/to/the/');

        expect(stopper.mock.calls.length).toBe(2);
        expect(config.bar).toBe(true);
        expect(config.foo).toBeUndefined();
    });


    it('breadth first', () => {
        const manis = new Manis(['.eslintrc', '.eslintrc.json'], { enableRoot: true });

        mock({
            'path/.eslintrc.json': '{"root": true, "baz": true}',
            'path/to/.eslintrc': '{"root": true, "foo": false, "bar": true}',
            'path/to/the/.eslintrc': '{"root": true, "foo": true}',
        });

        const config = manis.from('path/to/the/hello-world.js');

        expect(config.foo).toBe(true);
        expect(config.bar).toBeUndefined();
        expect(config.baz).toBeUndefined();
    });

});

