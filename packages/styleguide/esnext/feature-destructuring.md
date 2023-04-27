### 解构

#### [强制] 不要使用 3 层及以上的解构。

解释：

过多层次的解构会让代码变得难以阅读。

示例：

```js
// BAD
let {documentElement: {firstElementChild: {nextSibling}}} = window;
```

#### [建议] 使用解构减少中间变量。

解释：

常见场景如变量值交换，可能产生中间变量。这种场景推荐使用解构。

示例：

```js
// GOOD
[x, y] = [y, x];

// BAD
let temp = x;
x = y;
y = temp;
```

#### [强制] 如果不节省编写时产生的中间变量，解构表达式 `=` 号右边不允许是 `ObjectLiteral` 和 `ArrayLiteral`。

解释：

在这种场景下，使用解构将降低代码可读性，通常也并无收益。

示例：

```js
// GOOD
let {first: firstName, last: lastName} = person;
let one = 1;
let two = 2;

// BAD
let [one, two] = [1, 2];
```

#### [强制] 使用剩余运算符时，剩余运算符之前的所有元素必需具名。

解释：

剩余运算符之前的元素省略名称可能带来较大的程序阅读障碍。如果仅仅为了取数组后几项，请使用 `slice` 方法。

示例：

```js
// GOOD
let [one, two, ...anyOther] = myArray;
let other = myArray.slice(3);

// BAD
let [,,, ...other] = myArray;
```
