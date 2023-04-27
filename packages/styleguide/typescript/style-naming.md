## 命名

### [强制] 私有成员使用 `private` 而不是 `_` 和 `#` 前缀。

解释：

类似 C#，TypeScript 支持 `private`、`protected` 与 `public` 访问修饰符，用于控制方法和属性的可见范围，不使用无实际意义的 `_`，也不使用 [ES2019 的 '#'](https://github.com/tc39/proposal-class-fields)。

示例：

```ts
// GOOD
class Foo {
    private bar: string;
}

// BAD
class Foo {
    _bar: string;
}

class Foo {
    #bar: string;
}
```

### [强制] `interface` 使用 `Pascal命名法`，不允许增加 `I` 作前缀标识。

解释：

与 Java、C# 不同，TypeScript 中的 `interface` 和类并没有明显的区分。

示例：

```ts
// GOOD
interface Animal {
    eat(): void;
}

class Dog extends Animal {
    bark() {}
}

class Cat extends Animal {
    meow() {}
}

// BAD
interface IAnimal {
    eat(): void;
}

class Dog extends IAnimal {
    bark() {}
}

class Cat extends IAnimal {
    meow() {}
}
```

### [建议] `namespace` 使用 `Pascal命名法`。

解释：

除非在为第三方模块声明类型，正常情况下并不建议使用 TypeScript 的 `namespace`，此时依照该模块的实际命名情况。

#### [强制] `枚举变量` 使用 `Pascal命名法`，`枚举的属性` 使用 `全部字母大写，单词间下划线分隔` 的命名方式。

解释：

与 JavaScript 规范部分保持一致，区别在于 JavaScript 无 `enum` 关键字，书写语法上也有区别。

示例：

```ts
// GOOD
enum TargetState {
    READING = 1,
    READ = 2,
    APPLIED = 3,
    READY = 4
}

// BAD
enum targetState {
    reading = 1,
    read = 2,
    applied = 3,
    ready = 4
}
```

注意：如果 `enum` 前加上 `const`，最终编译生成的代码将不包含枚举变量，而是全部替换成相应的枚举值。

### [建议] 泛型名称通常使用大写单字母的形式，如 `T`、`U`、`P`、`R`、`K`、`V`。

解释：

+ `T` for `Type`
+ `U` for the second type（字母表中 `U` 在 `T` 之后，类似 `i`/`j`/`k` 在多重循环的用法）
+ `P` for `Parameter` or `Property`
+ `R` for `Return`
+ `K` for `Key`
+ `V` for `Value`
+ `E` for `Element`
+ `F` for `Function`

简而言之，泛型名称通常所代表类型含义的首字母。
