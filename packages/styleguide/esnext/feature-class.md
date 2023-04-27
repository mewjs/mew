### 类

#### [强制] 使用 `class` 关键字定义一个类。

解释：

直接使用 `class` 定义类更清晰。不要再使用 `function` 和 `prototype` 形式的定义。

```js
// GOOD
class TextNode {
    constructor(value, engine) {
        this.value = value;
        this.engine = engine;
    }

    clone() {
        return this;
    }
}

// BAD
function TextNode(value, engine) {
    this.value = value;
    this.engine = engine;
}

TextNode.prototype.clone = function () {
    return this;
};
```

#### [强制] 使用 `super` 访问父类成员，而非父类的 `prototype`。

解释：

使用 `super` 和 `super.foo` 可以快速访问父类成员，而不必硬编码父类模块而导致修改和维护的不便，同时更节省代码。

```js
// GOOD
class TextNode extends Node {
    constructor(value, engine) {
        super(value);
        this.engine = engine;
    }

    setNodeValue(value) {
        super.setNodeValue(value);
        this.textContent = value;
    }
}

// BAD
class TextNode extends Node {
    constructor(value, engine) {
        Node.apply(this, arguments);
        this.engine = engine;
    }

    setNodeValue(value) {
        Node.prototype.setNodeValue.call(this, value);
        this.textContent = value;
    }
}
```
