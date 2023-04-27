
## 注释

### [建议] 文档注释的描述与其后的其他 tag 之间空一行。

```ts
// GOOD
/**
 * Foo
 *
 * @param bar - Bar
 * @return Bar
 */
function foo(bar = 'baz') {
    return bar;
}
```

```ts
// BAD
/**
 * Foo
 * @param bar - Bar
 * @return Bar
 */
function foo(bar = 'baz') {
    return bar;
}
```

### [建议] 遵循 `TSDoc` 而非 `JSDoc` 的文档注释风格。

解释：

[TSDoc](https://tsdoc.org/) 与 [JSDoc](https://jsdoc.app/) 的关注点不同，前者更聚焦于文档与 API 管理，而后者更多的是为 JavaScript 提供类型注释，这对于 TypeScript 来说是冗余信息。

因此在 JSDoc 中需要用来标记类型的 tag 对于 TypeScript 来说是多此一举的，如 @function、@enum、@class、@interface、@type、@var 等。

同样，标记成员可访问性的 @public、@private、@protected 等也是多余的。

```ts
// GOOD
/**
 * Foo
 *
 * @param bar - Bar
 * @return Bar
 */
function foo(bar = 'baz') {
    return bar;
}

/**
 * 前端工程师
 */
export default class FrontEndEngineer extends Developer {

    /**
     * 获取级别
     *
     */
    getLevel() {
        // TODO
    }
}
```

```ts
// BAD
/**
 * Foo
 *
 * @param {string} bar - Bar
 * @return {string} Bar
 */
function foo(bar = 'baz') {
    return bar;
}

/**
 * 前端工程师
 *
 * @class
 * @extends Developer
 */
export default class FrontEndEngineer extends Developer {

    /**
     * 获取级别
     *
     * @public
     */
    public getLevel() {
        // TODO
    }
}
```

注意：TSDoc 中的 @public 用于标记 API 的发布阶段，而非成员的可访问性，同功能的系列 tag 还有 @alpha 和 @beta。
