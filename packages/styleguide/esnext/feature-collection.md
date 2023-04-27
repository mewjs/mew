
### 集合

#### [建议] 对数组进行连接操作时，使用数组展开语法。

解释：

用数组展开代替 `concat` 方法，数组展开对 `Iterable` 有更好的兼容性。

示例：

```js
// GOOD
let foo = [...foo, newValue];
let bar = [...bar, ...newValues];

// BAD
let foo = foo.concat(newValue);
let bar = bar.concat(newValues);
```

#### [建议] 尽可能使用 `for .. of` 进行遍历。

解释：

使用 `for .. of` 可以更好地接受任何的 `Iterable` 对象，如 `Map#values` 生成的迭代器，使得方法的通用性更强。

以下情况除外：

1. 遍历确实成为了性能瓶颈，需要使用原生 `for` 循环提升性能。
2. 需要遍历过程中的索引。

#### [强制] 当键值有可能不是字符串时，必须使用 `Map`；当元素有可能不是字符串时，必须使用 `Set`。

解释：

使用普通 Object，对非字符串类型的 `key`，需要自己实现序列化。并且运行过程中的对象变化难以通知 Object。

#### [建议] 需要一个不可重复的集合时，应使用 `Set`。

解释：

不要使用 `{foo: true}` 这样的普通 `Object`。

示例：

```js
// GOOD
let members = new Set(['one', 'two', 'three']);

// BAD
let members = {
    one: true,
    two: true,
    three: true
};
```

#### [建议] 当需要遍历功能时，使用 `Map` 和 `Set`。

解释：

`Map` 和 `Set` 是可遍历对象，能够方便地使用 `for...of` 遍历。不要使用使用普通 Object。

示例：

```js
// GOOD
let membersAge = new Map([
    ['one', 10],
    ['two', 20],
    ['three', 30]
]);
for (let [key, value] of map) {
}

// BAD
let membersAge = {
    one: 10,
    two: 20,
    three: 30
};
for (let key in membersAge) {
    if (membersAge.hasOwnProperty(key)) {
        let value = membersAge[key];
    }
}
```

#### [建议] 程序运行过程中有添加或移除元素的操作时，使用 `Map` 和 `Set`。

解释：

使用 `Map` 和 `Set`，程序的可理解性更好；普通 Object 的语义更倾向于表达固定的结构。

示例：

```js
// GOOD
let membersAge = new Map();
membersAge.set('one', 10);
membersAge.set('two', 20);
membersAge.set('three', 30);
membersAge.delete('one');

// BAD
let membersAge = {};
membersAge.one = 10;
membersAge.two = 20;
membersAge.three = 30;
delete membersAge['one'];
```
