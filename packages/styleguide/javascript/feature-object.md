
### 对象

#### [强制] 使用对象字面量 `{}` 创建新 `Object`。

示例：

```js
// GOOD
var obj = {};

// BAD
var obj = new Object();
```

#### [建议] 对象创建时，如果一个对象的所有 `属性` 均可以不添加引号，建议所有 `属性` 不添加引号。

示例：

```js
var info = {
    name: 'someone',
    age: 28
};
```

#### [建议] 对象创建时，如果任何一个 `属性` 需要添加引号，则所有 `属性` 建议添加 `'`。

解释：

如果属性不符合 Identifier 和 NumberLiteral 的形式，就需要以 StringLiteral 的形式提供。

示例：

```js
// GOOD
var info = {
    'name': 'someone',
    'age': 28,
    'more-info': '...'
};

// BAD
var info = {
    name: 'someone',
    age: 28,
    'more-info': '...'
};
```

#### [强制] 不允许修改和扩展任何原生对象和宿主对象的原型。

示例：

```js
// 以下行为绝对禁止
String.prototype.trim = function () {
};
```

#### [建议] 属性访问时，尽量使用 `.`。

解释：

属性名符合 Identifier 的要求，就可以通过 `.` 来访问，否则就只能通过 `[expr]` 方式访问。

通常在 JavaScript 中声明的对象，属性命名是使用 Camel 命名法，用 `.` 来访问更清晰简洁。部分特殊的属性（比如来自后端的 JSON ），可能采用不寻常的命名方式，可以通过 `[expr]` 方式访问。

示例：

```js
info.age;
info['more-info'];
```

#### [建议] `for in` 遍历对象时, 使用 `hasOwnProperty` 过滤掉原型中的属性。

示例：

```js
var newInfo = {};
for (var key in info) {
    if (info.hasOwnProperty(key)) {
        newInfo[key] = info[key];
    }
}
```
