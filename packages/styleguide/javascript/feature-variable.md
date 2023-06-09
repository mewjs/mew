
### 变量

#### [强制] 变量、函数在使用前必须先定义。

解释：

不通过 var 定义变量将导致变量污染全局环境。

示例：

```js
// GOOD
var name = 'MyName';

// BAD
name = 'MyName';
```

原则上不建议使用全局变量，对于已有的全局变量或第三方框架引入的全局变量，需要根据检查工具的语法标识。

示例：

```js
/* globals jQuery */
var element = jQuery('#element-id');
```

#### [强制] 每个 `var` 只能声明一个变量。

解释：

一个 `var` 声明多个变量，容易导致较长的行长度，并且在修改时容易造成逗号和分号的混淆。

示例：

```js
// GOOD
var hangModules = [];
var missModules = [];
var visited = {};

// BAD
var hangModules = [],
    missModules = [],
    visited = {};
```

#### [强制] 变量必须 `即用即声明`，不得在函数或其它形式的代码块起始位置统一声明所有变量。

解释：

变量声明与使用的距离越远，出现的跨度越大，代码的阅读与维护成本越高。虽然 JavaScript 的变量是函数作用域，还是应该根据编程中的意图，缩小变量出现的距离空间。

示例：

```js
// GOOD
function kv2List(source) {
    var list = [];

    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            var item = {
                k: key,
                v: source[key]
            };

            list.push(item);
        }
    }

    return list;
}

// BAD
function kv2List(source) {
    var list = [];
    var key;
    var item;

    for (key in source) {
        if (source.hasOwnProperty(key)) {
            item = {
                k: key,
                v: source[key]
            };

            list.push(item);
        }
    }

    return list;
}
```
