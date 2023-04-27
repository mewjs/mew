### 对象

#### [建议] 定义对象时，如果所有键均指向同名变量，则所有键都使用缩写；如果有一个键无法指向同名变量，则所有键都不使用缩写。

解释：

目的在于保持所有键值对声明的一致性。

```js
// GOOD
let foo = {x, y, z};

let foo2 = {
    x: 1,
    y: 2,
    z: z
};


// BAD
let foo = {
    x: x,
    y: y,
    z: z
};

let foo2 = {
    x: 1,
    y: 2,
    z
};
```

#### [强制] 定义方法时使用 `MethodDefinition` 语法，不使用 `PropertyName: FunctionExpression` 语法。

解释：

`MethodDefinition` 语法更清晰简洁。

示例：

```js
// GOOD
let foo = {
    bar(x, y) {
        return x + y;
    }
};

// BAD
let foo = {
    bar: function (x, y) {
        return x + y;
    }
};
```

#### [建议] 使用 `Object.keys` 或 `Object.entries` 进行对象遍历。

解释：

不建议使用 `for .. in` 进行对象的遍历，以避免遗漏 `hasOwnProperty` 产生的错误。

示例：

```js
// GOOD
for (let key of Object.keys(foo)) {
    let value = foo[key];
}

// GOOD
for (let [key, value] of Object.entries(foo)) {
    // ...
}
```

#### [建议] 定义对象的方法不应使用箭头函数。

解释：

箭头函数将 `this` 绑定到当前环境，在 `obj.method()` 调用时容易导致不期待的 `this`。除非明确需要绑定 `this`，否则不应使用箭头函数。

示例：

```js
// GOOD
let foo = {
    bar(x, y) {
        return x + y;
    }
};

// BAD
let foo = {
    bar: (x, y) => x + y
};
```

#### [建议] 尽量使用计算属性键在一个完整的字面量中完整地定义一个对象，避免对象定义后直接增加对象属性。

解释：

在一个完整的字面量中声明所有的键值，而不需要将代码分散开来，有助于提升代码可读性。

示例：

```js
// GOOD
const MY_KEY = 'bar';
let foo = {
    [MY_KEY + 'Hash']: 123
};

// BAD
const MY_KEY = 'bar';
let foo = {};
foo[MY_KEY + 'Hash'] = 123;
```
