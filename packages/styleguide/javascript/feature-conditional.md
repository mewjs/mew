
### 条件

#### [强制] 在 Equality Expression 中使用类型严格的 `===`。仅当判断 `null` 或 `undefined` 时，允许使用 `== null`。

解释：

使用 `===` 可以避免等于判断中隐式的类型转换。

示例：

```js
// GOOD
if (age === 30) {
    // ......
}

// BAD
if (age == 30) {
    // ......
}
```

#### [建议] 尽可能使用简洁的表达式。

示例：

```js
// 字符串为空

// GOOD
if (!name) {
    // ......
}

// BAD
if (name === '') {
    // ......
}
```

```js
// 字符串非空

// GOOD
if (name) {
    // ......
}

// BAD
if (name !== '') {
    // ......
}
```

```js
// 数组非空

// GOOD
if (collection.length) {
    // ......
}

// BAD
if (collection.length > 0) {
    // ......
}
```

```js
// 布尔不成立

// GOOD
if (!notTrue) {
    // ......
}

// BAD
if (notTrue === false) {
    // ......
}
```

```js
// null 或 undefined

// GOOD
if (noValue == null) {
  // ......
}

// BAD
if (noValue === null || typeof noValue === 'undefined') {
  // ......
}
```

#### [建议] 按执行频率排列分支的顺序。

解释：

按执行频率排列分支的顺序好处是：

1. 阅读的人容易找到最常见的情况，增加可读性。
2. 提高执行效率。

#### [建议] 对于相同变量或表达式的多值条件，用 `switch` 代替 `if`。

示例：

```js
// GOOD
switch (typeof variable) {
    case 'object':
        // ......
        break;
    case 'number':
    case 'boolean':
    case 'string':
        // ......
        break;
}

// BAD
var type = typeof variable;
if (type === 'object') {
    // ......
}
else if (type === 'number' || type === 'boolean' || type === 'string') {
    // ......
}
```

#### [建议] 如果函数或全局中的 `else` 块后没有任何语句，可以删除 `else`。

示例：

```js
// GOOD
function getName() {
    if (name) {
        return name;
    }

    return 'unnamed';
}

// BAD
function getName() {
    if (name) {
        return name;
    }
    else {
        return 'unnamed';
    }
}
```
