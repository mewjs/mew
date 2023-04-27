/**
 * @file extend.d.ts
 */

interface A {
    key1: string;
    key2: string;
}

interface B<T extends keyof A> {
    key3: string;
}

type Function0<R> = () => R
type Function1<A1, R> = (a1: A1) => R
type Function2<A1, A2, R> = (a1: A1, a2: A2) => R
type Function3<A1, A2, A3, R> = (a1: A1, a2: A2, a3: A3) => R
type Function4<A1, A2, A3, A4, R> = (a1: A1, a2: A2, a3: A3, a4: A4) => R
type Fn<
    A = undefined,
    B = undefined,
    C = undefined,
    D = undefined,
    E = undefined
> = E extends undefined
    ? D extends undefined
        ? C extends undefined
            ? B extends undefined
                ? Function0<A>
                : Function1<A, B>
            : Function2<A, B, C>
        : Function3<A, B, C, D>
    : Function4<A, B, C, D, E>;

type Res<K extends keyof any, T> = {
    [k in K]: {
        total: number;
        data: T;
    }
};
