
### 类型

#### 类型检测

##### [建议] 类型检测优先使用 `typeof`。对象类型检测使用 `instanceof`。`null` 或 `undefined` 的检测使用 `== null`。

示例：

```js
// string
typeof variable === 'string'

// number
typeof variable === 'number'

// boolean
typeof variable === 'boolean'

// Function
typeof variable === 'function'

// Object
typeof variable === 'object'

// RegExp
variable instanceof RegExp

// Array
variable instanceof Array

// null
variable === null

// null or undefined
variable == null

// undefined
typeof variable === 'undefined'
```

#### 类型转换

##### [建议] 转换成 `string` 时，使用 `+ ''`。

示例：

```js
// GOOD
num + '';

// BAD
new String(num);
num.toString();
String(num);
```

##### [建议] 转换成 `number` 时，通常使用 `+`。

示例：

```js
// GOOD
+str;

// BAD
Number(str);
```

##### [建议] `string` 转换成 `number`，要转换的字符串结尾包含非数字并期望忽略时，使用 `parseInt`。

示例：

```js
var width = '200px';
parseInt(width, 10);
```

##### [强制] 使用 `parseInt` 时，必须指定进制。

示例：

```js
// GOOD
parseInt(str, 10);

// BAD
parseInt(str);
```

##### [建议] 转换成 `boolean` 时，使用 `!!`。

示例：

```js
var num = 3.14;
!!num;
```

##### [建议] `number` 去除小数点，使用 `Math.floor` / `Math.round` / `Math.ceil`，不使用 `parseInt`。

示例：

```js
// GOOD
var num = 3.14;
Math.ceil(num);

// BAD
var num = 3.14;
parseInt(num, 10);
```
