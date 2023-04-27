
### 结构

#### [强制] 声明变量或参数的类型时，半角冒号 `:` 与类型之间必须有一个空格。

```ts
// GOOD
let foo: string;
const log = (info: string) => console.log(info);

// BAD
let bar:string;
const log = (info:string) => console.log(info);
```

#### [强制] 声明复合类型时，字段类型之间使用半角分号 `;` 作分隔。

```ts
// GOOD
interface Foo {
    bar: string;
    baz: number;
}

// 元组类型例外
type Foobar = [string, number];

function foo(value: { a: string; b: string }) {
    console.log(value.a);
}

// BAD
interface Foo {
    bar: string
    baz: number
}

interface Foo {
    bar: string,
    baz: number,
}

function foo(value: { a: string, b: string }) {
    console.log(value.a);
}
```

注意：元组类型不同，保持类数组的形式。
