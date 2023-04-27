declare var KJSON;

type KJSON<T> = KJSON.Success<T> | KJSON.Failure<T> | KJSON.PaginatedSuccess<T>;

declare namespace KJSON {

    type BuildPowersOf2LengthArrays<
        N extends number,
        R extends never[][]
    > =
        R[0][N] extends never
            ? R
            : BuildPowersOf2LengthArrays<N, [[...R[0], ...R[0]], ...R]>;

    type ConcatLargestUntilDone<
        N extends number,
        R extends never[][],
        B extends never[]
    > =
        B['length'] extends N
            ? B
            : [...R[0], ...B][N] extends never
                ? ConcatLargestUntilDone<
                    N,
                    R extends [R[0], ...infer U]
                        ?
                            U extends never[][]
                                ? U
                                : never
                        : never,
                    B
                >
                : ConcatLargestUntilDone<
                    N,
                    R extends [R[0], ...infer U]
                        ?
                            U extends never[][]
                                ? U
                                : never
                        : never,
                    [...R[0], ...B]
                >;

    type Replace<R extends any[], T> = {
        [K in keyof R]: T
    };

    type TupleOf<T, N extends number> = number extends N ? T[] : {
        [K in N]: BuildPowersOf2LengthArrays<K, [[never]]> extends infer U ? U extends never[][]
            ? Replace<ConcatLargestUntilDone<K, U, []>, T>
            : never : never;
    }[N];

    type RangeOf<N extends number> = Partial<TupleOf<unknown, N>>['length'];

    type Range<From extends number, To extends number> = Exclude<RangeOf<To>, RangeOf<From>> | From;


    type SuccessStatus = 0;
    type FailureStatus = Range<1, 999>;


    type KObject = {
        [Key in string]?: KValue
    };

    type KArray = KValue[];

    type KPrimitive = string | number | boolean;

    type KValue = KPrimitive | KObject | KArray;

    type ASC = 'asc' | 1;
    type DESC = 'desc' | 0;
    type OrderBy = ASC | DESC;


    interface Pagination<T extends KValue> {
        page: number;
        size: number;
        total: number;
        keyword?: string;
        orderBy?: string | Record<string, OrderBy>;
        filters?: Record<string, string>;
        list: T[];
        [key: string]: KValue;
    }

    interface Success<T extends KValue> {
        code: SuccessStatus;
        data: T;
    }

    interface Failure<T extends KValue> {
        code: FailureStatus;
        info: T;
    }

    type PaginatedSuccess<T extends KValue> = Success<Pagination<T>>;

}
