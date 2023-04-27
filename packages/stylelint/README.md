# stylelint-mew

主要增强了 CSS 的检查能力，以及 stylus 扩展检查能力

## usage

```json
{
    "plugins": ["@mewjs/stylelint"],
    "rules": {
        "mew/white-space-between-values": [true, {"severity": "warning"}],
        "mew/strict-values": [true, {"ignoreUnits": ["rpx", "upx"]}],
        "mew/stylus-colon": true,
        "mew/stylus-trailing-semicolon": true,
        "mew/use-hex-color": [true, {"severity": "warning"}]
    }
}
```

## rules

## @mewjs/white-space-between-values

检查空格情况，仅允许多个值之间出现1个空格

### accept

```css
.foo {
    padding: 1px 1px;
    background: url('./img.png');
}
```

### reject

```css
.foo {
    padding: 1px  1px; /* 多余空格 */
    background: url(  './img.png'); /* 多余空格 */
}
```

## @mewjs/strict-values

利用 [csstree](https://github.com/csstree/csstree) 检查 css 值是否合法，css 值定义在[md/data](https://github.com/mdn/data/)里面。

`csstree` 仅能解析 `css` 的 value，对 sass, less 不支持，需要排除带有 sass, less 函数、变量的行。

### accept

```css
.foo {
    padding: 1px;
}

.bar {
    color: #ccc;
}

.baz {
    transform: rotate(1deg);
}
```

### reject

```css
.foo {
    padding: 1px 2px 3px 4px 5px; /* 多余值 */
}

.bar {
    color: 1px; /* 错误值 */
}

.baz {
    transform: rotate(1px); /* 错误值 */
}
```

## @mewjs/stylus-colon

stylus 属性不可省略属性名后面的冒号。

### accept

```css
.foo {
    padding: 1px 2px;
}
```

### reject

```css
.foo {
    padding 1px 2px;
}
```

## @mewjs/stylus-trailing-semicolon

stylus 属性不可省略行尾的分号。

`注意：`stylus 函数行尾分号不能检查出来，需要自行添加。

### accept

```less
.foo {
    padding: 1px 2px;
}

.bar {
    padding() /* 此处行尾分号检查不出来 */
}
```

### reject

```css
.foo {
    padding: 1px 2px
}
```

## @mewjs/use-hex-color

强制使用hex编码的颜色

`注意：` 带有变量的rgb, rgba, hsl, hsla不进行检查

### accept

```less
.foo {
    color: #ccc;
    // less 变量不检查
    background-color: rgba(@r, @g, @b, @percentage);
    // less变量不检查
    border-color: hsla(@h, @s, @l, @percentage);
}

```

### reject

```css
.foo {
    color: rgb(100, 100, 100);
    background-color: rgb(100, 100, 100, .5);
    border-color: hsla(100, 1%, 1%, .5);
}
```
