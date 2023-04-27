### 类型

#### [强制] 内置类型使用小写的 `string`、`number`、`boolean`、`null` 与 `undefined`。

解释：

在 TypeScript 中，内置类型的名称都是小写的，对应的 `String`、`Number`、`Boolean`、`Function` 和 `Object` 被认为是不安全的。

#### [强制] 不使用 `Function` 和 `Object` 作为类型。

解释：

`Function` 仅仅表示函数类型，对于参数与返回值无任何限定，相当于 `(...args: any[]) => any`，同时它还可以接受类名，但不允许被调用，所以它是不安全的；

`Object` 仅仅表示非空值，对 `key` 和 `value` 无任何限定。如果想要`任意对象`，请用 `Record<string, unknown>` 代替；如果想要任意值，请用 `unknown` 代替。

#### [建议] 使用 `any` 或 `object` 的场景尽可能改为更具体的类型，无法确定类型的场景建议使用 `unknown`。

解释：

以下是一些常见使用 `any` 的场景：

1. 当形参或变量是一个不确定 key 和 value 的 object，为省事可能会直接写 `any` 或 `object`。但是通常我们知道 key 必定是 `string`，剩下的问题就是 value 的类型能否通过有限的类型联合来确定。此时可以使用 `Record<string, string | boolean | number>`，如果类型确实太多，也可以用 `unknown`，然后在调用的地方通过 `as` 转为更具体的类型或提前作类型断言。

2. 当形参或变量是一个长度固定但每个元素类型不同的数组时，可以使用元组，如：`[string, number, boolean]`。

3. 当形参或变量有已知 key 及 value，同时包含可能未知的 key 和 value，可以通过补充索引签名避免直接使用 `any`。

4. 当实参是对象直接量，并且包含的字段名比原定的形参类型定义更多时，可以将对象直接量先赋值给一个变量，然后再使用该变量来作为实参，避免将形参类型定义为 `any`。

5. 当返回值的类型依赖形参类型，并且可以为多种类型时，可以使用泛型代替 `any`。

#### [建议] 模块 `export` 或 `import` 类型时，增加 `type` 关键字。

示例：

```ts
// GOOD
import type Foo from './foo';

interface ButtonProps {
  onClick: () => void;
}
class Button implements ButtonProps {
    onClick() {
        console.log('button!');
    }
}

export { Button };
export type { ButtonProps };
```

```ts
// BAD
import Foo from './foo';

interface ButtonProps {
  onClick: () => void;
}
class Button implements ButtonProps {
    onClick() {
        console.log('button!');
    }
}
export { Button, ButtonProps };
```

### [建议] 可以自动的推断出类型时无须显式声明。

示例：

```ts
// GOOD
let version = 1;
let code: number | string = 404;

version = 2;
code = '500';

class People {
    constructor(public name = 'John', public age = 30) {
        // ...
    }
}

function foo(bar = 'bar') {
    return bar;
}

interface Validator<T> {
    (value: T): boolean;
    create(key: string, validate: (value: T) => boolean): Validator;
}

const validateName: Validator = (value: string) => /^[a-z_-]{4,}$/.test(value);
const validatePhoneNumber: Validator<string> = value => /^1\d{10}$/.test(value);
```

```ts
// BAD
let version: number = 1;

version = 2;

class People {
    constructor(public name: string = 'John', public age: number = 30) {
        // ...
    }
}

function foo(bar: string = 'bar') {
    return bar;
}

interface Validator {
    (value: string): boolean;
    create(key: string, validate: (value: T) => boolean): Validator;
}

const validateName: Validator = (value: string): boolean => /^[a-z_-]{4,}$/.test(value);
const validatePhoneNumber: Validator = (value: string): boolean => /^1\d{10}$/.test(value);
```

### [强制] 数组类型统一使用简写形式 `T[]`。

### [建议] 类型定义的成员顺序依照 `field`、`method`、`index signature` 的顺序。

示例：

```ts
// GOOD
interface Foo {
    a: x;
    B: x;
    c: x;

    a(): void;
    B(): void;
    c(): void;

    [key: string]: x;
}
```

### [建议] 严格模式下建议函数类型成员的声明使用属性的方式。

解释：

`strict` 模式下，`strictFunctionTypes`，属性的方式能得到更严格的类型检查，在严格模式下它仅是逆变（contravariant）而不是双变（bivariance: covariant or contravariant），见 [TypeScript PR](https://github.com/microsoft/TypeScript/pull/18654)。

```ts
// GOOD
interface Comparer<T> {
    compare: (a: T, b: T) => number;
}

declare let animalComparer: Comparer<Animal>;
declare let dogComparer: Comparer<Dog>;

// Error
animalComparer = dogComparer;
// Ok
dogComparer = animalComparer;

// BAD
interface Comparer<T> {
    compare(a: T, b: T): number;
}

declare let animalComparer: Comparer<Animal>;
declare let dogComparer: Comparer<Dog>;

// Ok because of bivariance
animalComparer = dogComparer;
// Ok
dogComparer = animalComparer;
```

### [强制] 避免使用 `null`，只使用 `undefined`。

### [建议] 避免使用 `type` 来定义类型，尽可能使用 `interface`。

解释：

当需要动态的推断新类型时，才必须使用 `type`，除此之外的情况基本可以使用 `interface` 代替。使用 `interface` 的好处是可以合并同名类型的多次声明，是可变的，而通过 `type` 定义的类型是不可变的。

概括性的原则：用 `interface` 描述数据结构，用 `type` 描述类型关系，当用 `interface` 定义类型报错时，改用 `type` 定义。

1. 当需要用到 `keyof` 或 `in` 定义类型时使用 `type`。

    在 `keyof` 的操作对象是泛型时例外：

    ```ts
    interface Foo<T> {
        value: T;
        keys: (keyof T)[];
    }
    ```

2. 当需要定义交叉或联合类型时使用 `type`。

3. 当需要定义类型别名（现存复杂类型的简单表示）时使用 `type`。

#### [强制] 使用 `as Type` 而非 `<Type>` 作为类型断言。

解释：

在需要使用 JSX 的项目中，`<Type>` 会与 JSX 冲突。

#### [建议] 对于可能包含非法值的值，可以使用类型保护或类型断言简化后续对该值的使用。

```ts
function is<T>(value: any): value is T {
    return true;
}

let value: any;
value = 'foo';

if (is<string>(value)) {
    value.toUpperCase();
}
```

```ts
function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}

let value: any;
value = 'foo';

assert(typeof value === 'string', 'value 应该为字符串');
// 后面语句的上下文中都会在 typeof value === 'string' 的判断条件中
value.toUpperCase();
```

```ts
function assertType<T>(value: any): asserts value is T {
    // do nothing
}

let value: any;
value = 'str';

assertType<string>(value);
// 后面语句的上下文中都会在 typeof value === 'string' 的判断条件中
value.toUpperCase();
```

#### [强制] 当需要忽略某些类型错误时，使用 `@ts-expect-error` 代替 `@ts-ignore`。

解释：

`@ts-ignore` 用于忽略某行代码的类型错误，但是当代码调整修复相关错误后，这个注释指令很容易被遗忘。TypeScript 3.9 后增加了新的单行注释指令 `@ts-expect-error`，工作模式与 `@ts-ignore` 一致，而当类型错误被修复后，会得到及时的提示。
