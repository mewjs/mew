## 变量

### [建议] Less 的变量值总是以同一作用域下最后一个同名变量为准，务必注意后面的设定会覆盖所有之前的设定。

### [强制] 变量命名*必须*（MUST）采用 `@foo-bar` 形式，*不得*（MUST NOT）使用 `@fooBar` 形式。

```less
// BAD
@sidebarWidth: 200px;
@width:800px;

// GOOD
@sidebar-width: 200px;
@width: 800px;
```
