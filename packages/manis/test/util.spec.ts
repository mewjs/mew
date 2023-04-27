import {
    extend,
    mix,
    pick,
    typeOf,
    defaultLoader
} from '../src/util';

describe('util', () => {

    interface Foo {
        foo?: number;
    }
    interface Bar {
        bar: number;
    }
    type FooBar = Foo & Bar;
    interface Baz {
        baz: number;
    }
    type FooBaz = Foo & Baz;

    it('extend', () => {
        const foo: Foo = { foo: 1 };
        const bar: Bar = { bar: 1 };
        const baz: FooBaz = { foo: 0, baz: 1 };

        const foobar = extend<FooBaz & Bar>(foo, bar, null);

        expect(foobar.foo).toBe(foo.foo);
        expect(foobar.bar).toBe(bar.bar);

        const foobaz: FooBaz = extend(foo, baz) as unknown as FooBaz;

        expect(foobaz.foo).toBe(baz.foo);
        expect(foobaz.baz).toBe(baz.baz);
    });

    it('deep extend', () => {
        interface KeyFoobar<T> {
            key: Partial<T>;
        }

        const foo: KeyFoobar<Foo> = { key: { foo: 1 } };
        const bar: KeyFoobar<Bar> = { key: { bar: 1 } };
        const baz: KeyFoobar<Foo & Baz> = { key: { foo: 0, baz: 1 } };

        const foobar = extend<KeyFoobar<Foo & Bar>>(foo, bar) as KeyFoobar<Foo & Bar>;

        expect(foobar.key.foo).toBe(foo.key.foo);
        expect(foobar.key.bar).toBe(bar.key.bar);

        const foobaz = extend(foo, baz) as KeyFoobar<Foo & Baz>;

        expect(foobaz.key.foo).toBe(baz.key.foo);
        expect(foobaz.key.baz).toBe(baz.key.baz);
    });

    it('extend should ignore property from prototype', () => {
        const foo: Foo = { foo: 1 };
        const bar: Bar = Object.create({ bar: 1 });

        const foobar = extend<FooBar>(foo, bar);

        expect(foobar.foo).toBe(foo.foo);
        expect(foobar.bar).toBe(bar.bar);
    });

    it('mix', () => {
        const foo: Foo = { foo: 1 };
        const bar: Bar = { bar: 1 };
        const baz: FooBaz = { foo: 0, baz: 1 };

        const foobaz = mix<FooBaz & Bar>(foo, bar, baz);


        expect(foobaz.foo).toBe(baz.foo);
        expect(foobaz.baz).toBe(baz.baz);
    });

    it('pick', () => {
        const foo: Foo = {};
        const bar: FooBar = { foo: 1, bar: 1 };
        const baz: FooBaz = { foo: 0, baz: 1 };


        const pickBar = pick([foo, bar, baz]) as FooBar;
        expect(pickBar).toBe(bar);
    });

    /* eslint-disable no-new-wrappers */
    it('typeOf', () => {
        expect(typeOf('')).toBe('string');
        expect(typeOf(new String())).toBe('string');

        expect(typeOf(true)).toBe('boolean');
        expect(typeOf(new Boolean(true))).toBe('boolean');

        expect(typeOf(0)).toBe('number');
        expect(typeOf(NaN)).toBe('number');

        // eslint-disable-next-line no-undefined
        expect(typeOf(undefined)).toBe('undefined');
        expect(typeOf(null)).toBe('null');

        expect(typeOf([])).toBe('array');
        expect(typeOf(new Array(3))).toBe('array');

        expect(typeOf(describe)).toBe('function');
        expect(typeOf(new Function())).toBe('function');

        expect(typeOf(/foo/)).toBe('regexp');
        expect(typeOf(new RegExp('foo'))).toBe('regexp');

        expect(typeOf(new Date())).toBe('date');
    });
    /* eslint-enable no-new-wrappers */
});

describe('default loader', () => {

    it('JSON file', () => {
        const config = defaultLoader('{"foo": false, "bar": true}', 'path/foo.json');

        expect(config.foo).toBe(false);
        expect(config.bar).toBe(true);
    });

    it('invalid JSON file', () => {

        const reading = () => defaultLoader('{"foo": false, "bar": true', 'path/foo.json');

        expect(reading).toThrow();
    });

    it('YAML file', () => {

        const config = defaultLoader('foo: false\nbar: true', 'path/foo.yml');

        expect(config.foo).toBe(false);
        expect(config.bar).toBe(true);
    });

    it('invalid YAML file', () => {

        const reading = () => defaultLoader('foo: false\nbar:[', 'path/foo.yml');

        expect(reading).toThrow();
    });

});
