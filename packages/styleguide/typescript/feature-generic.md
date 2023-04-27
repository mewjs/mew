### 泛型

#### [建议] 多个参数、返回值与逻辑高度相似的函数，可以考虑使用泛型重构提高复用。

解释：

通常我们编程对象主要是值，而泛型是对类型进行编程提高复用性的一种方式。

```ts
// GOOD
function id<T>(arg: T): T {
    return arg;
}

// BAD
function idNumber(arg: number): number {
    return arg;
}

function idString(arg: string): string {
    return arg;
}
```

#### [建议] 如无必要勿增新类型。

解释：

[TypeScript 内转了很多工具类型](https://www.typescriptlang.org/docs/handbook/utility-types.html)，支持对现有类型编程方式转为新的类型，比如 `Partial<T>`、`Required<T>`、`Readonly<T>`、`Pick<T, K>`、`Omit<T, K>`、`NonNullable<T>`、`Parameters<T>`、`ReturnType<T>`……等使用率非常高的泛型。

此外，社区也有一些优秀的工具类型，比如 [type-fest](https://github.com/sindresorhus/type-fest)。

```ts
// GOOD
interface FooBar {
    foo: string;
    bar: string;
}

function foobar(foo: Omit<FooBar, 'bar'>, bar: Omit<FooBar, 'foo'>): FooBar {
    return {
        ...foo,
        ...bar
    } as FooBar;
}

// Or

function foobar(foo: Pick<FooBar, 'foo'>, bar: Pick<FooBar, 'bar'>): FooBar {
    return {
        ...foo,
        ...bar
    } as FooBar;
}

// BAD
interface FooBar {
    foo: string;
    bar: string;
}

interface Foo {
    foo: string;
}

interface Bar {
    bar: string;
}

function foobar(foo: Foo, bar: Bar): FooBar {
    return {
        ...foo,
        ...bar
    } as FooBar;
}
```

#### [建议] 如有必要请为泛型增加约束。

解释：

未增加约束时，泛型类似 `any`，可以传任何类型，不同之处在于，如果涉及到对 `T` 的属性的读写或方法调用，都会报错，而 `any` 不会，除非是所有类型的共有的属性或方法。

但是如果直接将类型限制为要具备要读写的属性和方法的子类型，在需要返回原类型时，就会有类型丢失的问题，无法访问子类型以外的成员，详见 [A use case for TypeScript Generics](https://juliangaramendy.dev/blog/when-ts-generics)。

示例：

```ts
// GOOD
function getLength<T extends { length: number }>(input: T): number {
    return input.length;
}

// BAD
function getLength<T>(input: T): number {
    // Error: Property 'length' does not exist on type 'T'.
    return input.length;
}
```

#### [强制] 数组的 `reduce` 与 `reduceRight` 方法使用泛型方式调用。

解释：

这两个方法有泛型的调用方式，在返回值或被初始值是复合类型时，不需要针对初始值作类型声明或断言。

对于初始值为 `[]` 或 `{}` 时，如果未作类型声明，`[]` 将等于 `never[]`，`{}` 等于类型 `{}`，两者都不允许新增元素和键值。

```ts
// GOOD
let odd = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce<number[]>(
    (odd, num) => {
        if (num % 2) {
            odd.push(num);
        }

        return odd;
    },
    []
);

// BAD
const odd = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(
    (odd, num) => {
        if (num % 2) {
            odd.push(num);
        }

        return odd;
    },
    []
);

// Or
const odd = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(
    (odd, num) => {
        if (num % 2) {
            odd.push(num);
        }

        return odd;
    },
    [] as number[]
);
```
