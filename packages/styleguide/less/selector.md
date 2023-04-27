## 选择器

### [强制] 当多个选择器共享一个声明块时，每个选择器声明*必须*（MUST）独占一行。

```less
// BAD
h1, h2, h3 {
    font-weight: 700;
}

// GOOD
h1,
h2,
h3 {
    font-weight: 700;
}
```

### [强制] Class 选择器命名不得以样式信息进行描述，避免原子 CSS 化。

解释：

原子 CSS（Atomic CSS），也叫 Meta CSS，是一种反模式（[Anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern)）,见 [Meta CSS —— 一个 Anti Pattern 的典型](https://www.iteye.com/blog/hax-497338)。

示例：

```less
// BAD
.h300 {
    height: 300px;
}

.w500 {
    width: 500px;
}

.float-right {
    float: right;
}

// GOOD
.profile {
    float: right;
    width: 500px;
    height: 300px;
}
```
