
### 变量

#### [强制] 使用 `let` 和 `const` 定义变量，不使用 `var`。

解释：

使用 `let` 和 `const` 定义时，变量作用域范围更明确。

示例：

```js
// GOOD
for (let i = 0; i < 10; i++) {

}

// BAD
for (var i = 0; i < 10; i++) {

}
```
