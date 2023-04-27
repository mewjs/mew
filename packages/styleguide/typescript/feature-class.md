### 类

#### [建议] 类成员的顺序按大类排序依次为 `field`、`constructor`、`method`， 同大类再按先 `static` 后 `instance`，先 `public` 再 `protected` 后 `private` 的顺序。

解释：

field是类的数据，通常会在 constructor 中初始化，然后在方法 method 中 消费。

```ts
/* eslint-disable line-comment-position */
// GOOD
class Foo {
    static E: string; // -> public static field

    D: string; // -> public instance field

    private c: string; // -> private instance field


    constructor() {} // (irrelevant)

    get C(): string {} // -> public getter

    set C(v): void {} // -> public setter

    static A(): void {} // -> public static method

    B(): void {} // -> public instance method
}

// BAD
class Foo {
    B(): void {} // -> public instance method

    private c: string; // -> private instance field

    D: string; // -> public instance field

    static E: string; // -> public static field

    constructor() {} // (irrelevant)

    get C(): string {} // -> public getter

    set C(v): void {} // -> public setter

    static A(): void {} // -> public static method
}
```

### [强制] 类成员声明时除了 `public` 成员，其余成员都应该显式加上作用域修饰符。

解释：

TypeScript 类中的成员默认是 `public` 级别的可访问性。

```ts
// BAD
class Foo {
    foo = 'foo';
    bar = 'bar';
    getFoo() {
        return this.foo;
    }
}
const foo = new Foo();
foo.foo;
foo.bar;

// GOOD
class Foo {
    private foo = 'foo';
    bar = 'bar';
    getFoo() {
        return this.foo;
    }
}
const foo = new Foo();
foo.getFoo();
foo.bar;
```

### [强制] 子类继承父类时，如果需要重写父类方法，需要加上 `override` 修饰符。

```ts
class Animal {
    eat() {
        console.log('food');
    }
}

// GOOD
class Dog extends Animal {
    override eat() {
        console.log('bone');
    }
}

// BAD
class Dog extends Animal {
    eat() {
        console.log('bone');
    }
}
```

#### [建议] 当类成员不需要额外的处理，在构造函数中直接通过参数赋值时，可以在该参数前增加 `public`、`private` 或 `protected` 修饰符。

解释：

此时该参数将变成 `Parameter Properties`，即 [参数属性](https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties)。

```ts
// GOOD
class Position {
    constructor(public x: number, public y: number) {
        // No body
    }
}

// BAD
class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
```

#### [强制] 当方法的返回值是当前实例时，返回值应标记为 `this` 而非当前类名。

解释：

通过子类实现调用到父类该方法时，无法通过链式调用继续调用子类的特有方法。

```ts
// GOOD
class Animal {
    eat(): this {
        console.log('I\'m moving!');
        return this;
    }
}

class Cat extends Animal {
    meow(): this {
        console.log('Meow~');
        return this;
    }
}

const cat = new Cat();
// no errors. Because `eat` returns `Cat` now
cat.eat().meow();

// BAD
class Animal {
    eat(): Animal {
        console.log('I\'m moving!');
        return this;
    }
}

class Cat extends Animal {
    meow(): Cat {
        console.log('Meow~');
        return this;
    }
}

const cat = new Cat();
// Error: Property 'meow' does not exist on type 'Animal'.
// because `eat` returns `Animal` and not all animals meow.
cat.eat().meow();
```
