### 模板字符串

#### [强制] 字符串内变量替换时，不要使用 `2` 次及以上的函数调用。

解释：

在变量替换符内有太多的函数调用等复杂语法会导致可读性下降。

示例：

```js
// GOOD
let fullName = getFullName(getFirstName(), getLastName());
let s = `Hello ${fullName}`;

// BAD
let s = `Hello ${getFullName(getFirstName(), getLastName())}`;
```
