
### 结构

#### 缩进

##### [建议] 使用多行模板字符串时遵循缩进原则。当空行与空白字符敏感时，不使用多行模板字符串。

解释：

`4` 空格为一个缩进，换行后添加一层缩进。将起始和结束的 `` ` `` 符号单独放一行，有助于生成 HTML 时的标签对齐。

为避免破坏缩进的统一，当空行与空白字符敏感时，建议使用 `多个模板字符串` 或 `普通字符串` 进行连接运算，也可使用数组 `join` 生成字符串。

示例：

```js
// GOOD
function foo() {
    let html = `
        <div>
            <p></p>
            <p></p>
        </div>
    `;
}

// GOOD
function greeting(name) {
    return 'Hello, \n'
        + `${name.firstName} ${name.lastName}`;
}

// BAD
function greeting(name) {
    return `Hello,
${name.firstName} ${name.lastName}`;
}
```

#### 空格

##### [强制] 使用 `generator` 时，`*` 前面不允许有空格，`*` 后面必须有一个空格。

示例：

```js
// GOOD
function* caller() {
    yield 'a';
    yield* callee();
    yield 'd';
}

// BAD
function * caller() {
    yield 'a';
    yield *callee();
    yield 'd';
}
```

#### 语句

##### [强制] 类声明结束不允许添加分号。

解释：

与函数声明保持一致。

##### [强制] 类成员定义中，方法定义后不允许添加分号，成员属性定义后必须添加分号。

解释：

成员属性是当前 **Stage 0** 的标准，如果使用的话，则定义后加上分号。

示例：

```js
// GOOD
class Foo {
    foo = 3;

    bar() {

    }
}

// BAD
class Foo {
    foo = 3

    bar() {

    }
}
```

##### [强制] `export` 语句后，不允许出现表示空语句的分号。

解释：

`export` 关键字不影响后续语句类型。

示例：

```js
// GOOD
export function foo() {
}

export default function bar() {
}


// BAD
export function foo() {
};

export default function bar() {
};
```

##### [强制] 属性装饰器后，可以不加分号的场景，不允许加分号。

解释：

只有一种场景是必须加分号的：当属性 `key` 是 `computed property key` 时，其装饰器必须加分号，否则修饰 `key` 的 `[]` 会做为之前表达式的 `property accessor`。

上面描述的场景，装饰器后需要加分号。其余场景下的属性装饰器后不允许加分号。

示例：

```js
// GOOD
class Foo {
    @log('INFO')
    bar() {

    }

    @log('INFO');
    ['bar' + 2]() {

    }
}

// BAD
class Foo {
    @log('INFO');
    bar() {

    }

    @log('INFO')
    ['bar' + 2]() {

    }
}
```

##### [强制] 箭头函数的参数只有一个，并且不包含解构时，参数部分的括号必须省略。

示例：

```js
// GOOD
list.map(item => item * 2);

// GOOD
let fetchName = async id => {
    let user = await request(`users/${id}`);
    return user.fullName;
};

// BAD
list.map((item) => item * 2);

// BAD
let fetchName = async (id) => {
    let user = await request(`users/${id}`);
    return user.fullName;
};
```

##### [建议] 箭头函数的函数体只有一个单行表达式语句，且作为返回值时，省略 `{}` 和 `return`。

如果单个表达式过长，可以使用 `()` 进行包裹。

示例：

```js
// GOOD
list.map(item => item * 2);

let foo = () => (
    condition
        ? returnValueA()
        : returnValueB()
);

// BAD
list.map(item => {
    return item * 2;
});
```

##### [建议] 箭头函数的函数体只有一个 `Object Literal`，且作为返回值时，使用 `()` 包裹。

示例：

```js
// GOOD
list.map(item => ({name: item[0], email: item[1]}));
```

##### [强制] 解构多个变量时，如果超过行长度限制，每个解构的变量必须单独一行。

解释：

太多的变量解构会让一行的代码非常长，极有可能超过单行长度控制，使代码可读性下降。

示例：

```js
// GOOD
let {
    name: personName,
    email: personEmail,
    sex: personSex,
    age: personAge
} = person;

// BAD
let {name: personName, email: personEmail,
    sex: personSex, age: personAge
} = person;
```
