### [强制] 使用继承时，如果在声明块内书写 `:extend` 语句，*必须*（MUST）写在开头：

```less
// BAD
.sub {
    color: red;
    &:extend(.mod all);
}

// GOOD
.sub {
    &:extend(.mod all);
    color: red;
}
```

### [强制] 在定义 mixin 时，如果 mixin 名称不是一个需要使用的 className，*必须*（MUST）加上括号，否则即使不被调用也会输出到 CSS 中。

```less
// BAD
.big-text {
    font-size: 2em;
}

h3 {
    .big-text;
}

// GOOD
.big-text() {
    font-size: 2em;
}

h3 {
    .big-text();
}
```

### [强制] 如果混入的是本身不输出内容的 mixin，*必须*（MUST）在 mixin 后添加括号（即使不传参数），以区分这是否是一个 className（修改以后是否会影响 HTML）。

```less
// BAD
.box {
    .clearfix;
    .size (20px);
}

// GOOD
.box {
    .clearfix();
    .size(20px);
}
```

### [强制] Mixin 的参数分隔符统一使用 `,`，但在同一项目中*必须*（MUST）保持统一。

### [强制] 变量和 mixin 在命名时*必须*（MUST）遵循如下原则：

- 一个项目只能引入一个无命名前缀的基础样式库
- 业务代码和其他被引入的样式代码中，变量和 mixin 必须有项目或库的前缀
