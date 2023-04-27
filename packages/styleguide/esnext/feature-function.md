### 函数

#### [建议] 使用变量默认语法代替基于条件判断的默认值声明。

解释：

添加默认值有助于引擎的优化，在未来 `strong mode` 下也会有更好的效果。

示例：

```js
// GOOD
function foo(text = 'hello') {
}

// BAD
function foo(text) {
    text = text || 'hello';
}
```

#### [强制] 不要使用 `arguments` 对象，应使用 `...args` 代替。

解释：

在未来 `strong mode` 下 `arguments` 将被禁用。

示例：

```js
// GOOD
function foo(...args) {
    console.log(args.join(''));
}

// BAD
function foo() {
    console.log([].join.call(arguments));
}
```
