### 注释

#### 单行注释

##### [强制] 必须独占一行。`//` 后跟一个空格，缩进与下一行被注释说明的代码一致。

#### 多行注释

##### [建议] 避免使用 `/*...*/` 这样的多行注释。有多行注释内容时，使用多个单行注释。

解释：时下的编辑器和 IDE，都支持选中代码后按快捷键注释、反注释，使用 `//` 控制起来更便捷。

#### 文档化注释

##### [强制] 为了便于代码阅读和自文档化，以下内容必须包含以 `/**...*/` 形式的块注释中。

解释：

1. 文件
2. namespace
3. 类
4. 函数或方法
5. 类属性
6. 事件
7. 全局变量
8. 常量
9. AMD 模块

##### [强制] 文档注释前必须空一行。

##### [建议] 自文档化的文档说明 what，而不是 how。

#### 类型定义

##### [强制] 类型定义都是以 `{` 开始, 以 `}` 结束。

解释：

常用类型如：{string}, {number}, {boolean}, {Object}, {Function}, {RegExp}, {Array}, {Date}。

类型不仅局限于内置的类型，也可以是自定义的类型。比如定义了一个类 Developer，就可以使用它来定义一个参数和返回值的类型。

##### [强制] 对于基本类型 {string}, {number}, {boolean}，首字母必须小写。

| 类型定义 | 语法示例 | 解释 |
| ------- | ------- | --- |
|String|{string}|--|
|Number|{number}|--|
|Boolean|{boolean}|--|
|Object|{Object}|--|
|Function|{Function}|--|
|RegExp|{RegExp}|--|
|Array|{Array}|--|
|Date|{Date}|--|
|单一类型集合|{Array.&lt;string&gt;}|string 类型的数组|
|多类型|{(number｜boolean)}|可能是 number 类型, 也可能是 boolean 类型|
|允许为null|{?number}|可能是 number, 也可能是 null|
|不允许为null|{!Object}|Object 类型, 但不是 null|
|Function类型|{function(number, boolean)}|函数, 形参类型|
|Function带返回值|{function(number, boolean):string}|函数, 形参, 返回值类型|
|Promise|Promise.&lt;resolveType, rejectType&gt;|Promise，成功返回的数据类型，失败返回的错误类型|
|参数可选|@param {string=} name|可选参数, =为类型后缀|
|可变参数|@param {...number} args|变长参数,  ...为类型前缀|
|任意类型|{*}|任意类型|
|可选任意类型|@param {*=} name|可选参数，类型不限|
|可变任意类型|@param {...*} args|变长参数，类型不限|

#### 文件注释

##### [建议] 文件顶部可以包含文件注释，用 `@file` 标识文件说明。

示例：

```js
/**
 * @file Describe the file
 */
```

#### 命名空间注释

##### [建议] 命名空间使用 `@namespace` 标识。

示例：

```js
/**
 * @namespace
 */
var util = {};
```

#### 类注释

##### [建议] 使用 `@class` 标记类或构造函数。

解释：

对于使用对象 `constructor` 属性来定义的构造函数，可以使用 `@constructor` 来标记。

示例：

```js
/**
 * 描述
 *
 * @class
 */
function Developer() {
    // constructor body
}
```

##### [建议] 使用 `@extends` 标记类的继承信息。

示例：

```js
/**
 * 描述
 *
 * @class
 * @extends Developer
 */
function FrontEndEngineer() {
    Developer.call(this);
    // constructor body
}
util.inherits(FrontEndEngineer, Developer);
```

##### [强制] 使用包装方式扩展类成员时， 必须通过 `@lends` 进行重新指向。

解释：

没有 `@lends` 标记将无法为该类生成包含扩展类成员的文档。

示例：

```js
/**
 * 类描述
 *
 * @class
 * @extends Developer
 */
function FrontEndEngineer() {
    Developer.call(this);
    // constructor body
}

util.extend(
    FrontEndEngineer.prototype,
    /** @lends FrontEndEngineer.prototype */{
        getLevel: function () {
            // TODO
        }
    }
);
```

##### [强制] 类的属性或方法等成员信息不是 `public` 的，应使用 `@protected` 或 `@private` 标识可访问性。

解释：

生成的文档中将有可访问性的标记，避免用户直接使用非 `public` 的属性或方法。

示例：

```js
/**
 * 类描述
 *
 * @class
 * @extends Developer
 */
var FrontEndEngineer = function () {
    Developer.call(this);

    /**
     * 属性描述
     *
     * @type {string}
     * @private
     */
    this.level = 'T12';

    // constructor body
};
util.inherits(FrontEndEngineer, Developer);

/**
 * 方法描述
 *
 * @private
 * @return {string} 返回值描述
 */
FrontEndEngineer.prototype.getLevel = function () {
};
```

#### 函数/方法注释

##### [强制] 函数/方法注释必须包含函数说明，有参数和返回值时必须使用注释标识。

解释：

当 `return` 关键字仅作退出函数/方法使用时，无须对返回值作注释标识。

##### [强制] 参数和返回值注释必须包含类型信息，且不允许省略参数的说明。

##### [建议] 当函数是内部函数，外部不可访问时，可以使用 `@inner` 标识。

示例：

```js
/**
 * 函数描述
 *
 * @param {string} p1 参数1的说明
 * @param {string} p2 参数2的说明，比较长
 *     那就换行了.
 * @param {number=} p3 参数3的说明（可选）
 * @return {Object} 返回值描述
 */
function foo(p1, p2, p3) {
    var p3 = p3 || 10;
    return {
        p1: p1,
        p2: p2,
        p3: p3
    };
}
```

##### [强制] 对 Object 中各项的描述， 必须使用 `@param` 标识。

示例：

```js
/**
 * 函数描述
 *
 * @param {Object} option 参数描述
 * @param {string} option.url option项描述
 * @param {string=} option.method option项描述，可选参数
 */
function foo(option) {
    // TODO
}
```

##### [建议] 重写父类方法时， 应当添加 `@override` 标识。如果重写的形参个数、类型、顺序和返回值类型均未发生变化，可省略 `@param`、`@return`，仅用 `@override` 标识，否则仍应作完整注释。

解释：

简而言之，当子类重写的方法能直接套用父类的方法注释时可省略对参数与返回值的注释。

#### 事件注释

##### [强制] 必须使用 `@event` 标识事件，事件参数的标识与方法描述的参数标识相同。

示例：

```js
/**
 * 值变更时触发
 *
 * @event Select#change
 * @param {Object} e e描述
 * @param {string} e.before before描述
 * @param {string} e.after after描述
 */
this.fire(
    'change',
    {
        before: 'foo',
        after: 'bar'
    }
);
```

##### [强制] 在会广播事件的函数前使用 `@fires` 标识广播的事件，在广播事件代码前使用 `@event` 标识事件。

##### [建议] 对于事件对象的注释，使用 `@param` 标识，生成文档时可读性更好。

示例：

```js
/**
 * 点击处理
 *
 * @fires Select#change
 * @private
 */
Select.prototype.clickHandler = function () {

    /**
     * 值变更时触发
     *
     * @event Select#change
     * @param {Object} e e描述
     * @param {string} e.before before描述
     * @param {string} e.after after描述
     */
    this.fire(
        'change',
        {
            before: 'foo',
            after: 'bar'
        }
    );
};
```

#### 常量注释

##### [强制] 常量必须使用 `@const` 标记，并包含说明和类型信息。

示例：

```js
/**
 * 常量说明
 *
 * @const
 * @type {string}
 */
var REQUEST_URL = 'myurl.do';
```

#### 复杂类型注释

##### [建议] 对于类型未定义的复杂结构的注释，可以使用 `@typedef` 标识来定义。

示例：

```js
// `namespaceA~` 可以换成其它 namepaths 前缀，目的是为了生成文档中能显示 `@typedef` 定义的类型和链接。
/**
 * 服务器
 *
 * @typedef {Object} namespaceA~Server
 * @property {string} host 主机
 * @property {number} port 端口
 */

/**
 * 服务器列表
 *
 * @type {Array.<namespaceA~Server>}
 */
var servers = [
    {
        host: '1.2.3.4',
        port: 8080
    },
    {
        host: '1.2.3.5',
        port: 8081
    }
];
```

#### 细节注释

对于内部实现、不容易理解的逻辑说明、摘要信息等，我们可能需要编写细节注释。

#### [建议] 细节注释遵循单行注释的格式。说明必须换行时，每行是一个单行注释的起始。

示例：

```js
function foo(p1, p2, opt_p3) {
    // 这里对具体内部逻辑进行说明
    // 说明太长需要换行
    for (...) {
        ....
    }
}
```

##### [强制] 有时我们会使用一些特殊标记进行说明。特殊标记必须使用单行注释的形式。下面列举了一些常用标记：

解释：

1. TODO: 有功能待实现。此时需要对将要实现的功能进行简单说明。
2. FIXME: 该处代码运行没问题，但可能由于时间赶或者其他原因，需要修正。此时需要对如何修正进行简单说明。
3. HACK: 为修正某些问题而写的不太好或者使用了某些诡异手段的代码。此时需要对思路或诡异手段进行描述。
4. XXX: 该处存在陷阱。此时需要对陷阱进行描述。
