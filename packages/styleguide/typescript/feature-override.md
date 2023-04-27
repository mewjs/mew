### 重载

#### [强制] 重载的成员应该放一起以提高可读性。

#### [强制] 如果只有最后一个参数有与无的区分，使用可选参数而不是重载。

注意：此时返回值类型也应该是一样的，如果不同可以重载。

#### [强制] 函数重载时顺序按明确到模糊的原则。

解释：

当解析函数调用的时候，TypeScript 会选择匹配到的第一个重载。当位于前面的重载比后面的更”模糊“，那么后面的会被隐藏且不会被选用。

示例：

```ts
// GOOD
declare function fn(x: HTMLDivElement): string;
declare function fn(x: HTMLElement): number;
declare function fn(x: any): any;

let myElem: HTMLDivElement;
// x: string, :)
let x = fn(myElem);

// BAD
declare function fn(x: any): any;
declare function fn(x: HTMLElement): number;
declare function fn(x: HTMLDivElement): string;

let myElem: HTMLDivElement;
// x: any, what?
let x = fn(myElem);
```
