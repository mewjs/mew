## 值与单位

### 文本

#### [强制] 文本内容必须用双引号包围。

解释：

文本类型的内容可能在选择器、属性值等内容中。

示例：

```css
/* GOOD */
html[lang|="zh"] q:before {
    font-family: "Microsoft YaHei", sans-serif;
    content: "“";
}

html[lang|="zh"] q:after {
    font-family: "Microsoft YaHei", sans-serif;
    content: "”";
}

/* BAD */
html[lang|=zh] q:before {
    font-family: 'Microsoft YaHei', sans-serif;
    content: '“';
}

html[lang|=zh] q:after {
    font-family: "Microsoft YaHei", sans-serif;
    content: "”";
}
```

### 数值

#### [强制] 当数值为 0 - 1 之间的小数时，省略整数部分的 `0`。

示例：

```css
/* GOOD */
panel {
    opacity: .8;
}

/* BAD */
panel {
    opacity: 0.8;
}
```

### url()

#### [建议] `url()` 函数中的路径不加引号。

解释：

大部分情况下都不需要加引号，除非：

1. 需要兼容低版本 IE；
2. 避免在某些情况下，字符出现需要转码的认知负担；
3. 需要为 url() 传递第 2 个参数；
4. 有被 XSS 的风险。

示例：

```css
body {
    background: url(bg.png);
}
```

#### [建议] `url()` 函数中的绝对路径可省去协议名。

示例：

```css
body {
    background: url(//domain.com/img/bg.png) no-repeat 0 0;
}
```

### 长度

#### [强制] 长度为 `0` 时须省略单位。 (也只有长度单位可省)

示例：

```css
/* GOOD */
body {
    padding: 0 5px;
}

/* BAD */
body {
    padding: 0px 5px;
}
```

#### [建议] 同一项目内尽量统一单位。

解释：

在同一个项目内尽量统一长度单位，例如在做响应式时，避免 rem 和 px 混用:

```css
.name {
    font-size: 12px;
    width: .4rem;
}
```

目前有几种解决方法：

1. 全部统一转成 rem；
2. 使用 less/stylus/scss 时通过 mixin 转换；
3. 直接写 px，然后通过 [px2rem](https://github.com/songsiqi/px2rem)/[px2rem-loader](https://github.com/Jinjiang/px2rem-loader) 之类的插件自动转换。

### 颜色

#### [强制] RGB颜色值必须使用十六进制记号形式 `#rrggbb`。不允许使用 `rgb()`。

解释：

带有 alpha 的颜色信息可以使用 `rgba()`。使用 `rgba()` 时每个逗号后必须保留一个空格。

示例：

```css
/* GOOD */
.success {
    box-shadow: 0 0 2px rgba(0, 128, 0, .3);
    border-color: #008000;
}

/* BAD */
.success {
    box-shadow: 0 0 2px rgba(0,128,0,.3);
    border-color: rgb(0, 128, 0);
}
```

#### [强制] 颜色值可以缩写时，必须使用缩写形式。

示例：

```css
/* GOOD */
.success {
    background-color: #aca;
}

/* BAD */
.success {
    background-color: #aaccaa;
}
```

#### [强制] 颜色值不允许使用命名色值。

示例：

```css
/* GOOD */
.success {
    color: #90ee90;
}

/* BAD */
.success {
    color: lightgreen;
}
```

#### [建议] 颜色值中的英文字符采用小写。如不用小写也需要保证同一项目内保持大小写一致。

示例：

```css
/* GOOD */
.success {
    background-color: #aca;
    color: #90ee90;
}

/* GOOD */
.success {
    background-color: #ACA;
    color: #90EE90;
}

/* BAD */
.success {
    background-color: #ACA;
    color: #90ee90;
}
```

### 2D 位置

#### [强制] 必须同时给出水平和垂直方向的位置。

解释：

2D 位置初始值为 `0% 0%`，但在只有一个方向的值时，另一个方向的值会被解析为 center。为避免理解上的困扰，应同时给出两个方向的值。[background-position 属性值的定义](http://www.w3.org/TR/CSS21/colors.html#propdef-background-position)

示例：

```css
/* GOOD */
body {
    background-position: center top; /* 50% 0% */
}

/* BAD */
body {
    background-position: top; /* 50% 0% */
}
```
