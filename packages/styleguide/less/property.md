## 属性

### [建议] 多个属性定义可以使用缩写时， *尽量*（SHOULD）使用缩写。缩写更清晰字节数更少。常见缩写有 `margin`、`border`、`padding`、`font`、`list-style` 等。在书写时*必须*（MUST）考量缩写展开后是否有不需要覆盖的属性内容被修改，从而带来副作用。

示例：

```less
// BAD
p {
    margin-top: 10px;
    margin-left: 5px;
    margin-bottom: 0;
    margin-right: 15px;
}

// GOOD
p {
    margin: 10px 5px 0 15px;
}
```

### [建议] 对于处于 `(0, 1)` 范围内的数值，小数点前的 `0` *可以*（MAY）省略，同一项目中*必须*（MUST）保持一致。

```less
// BAD
transition-duration: 0.5s, .7s;

// GOOD
transition-duration: .5s, .7s;
```

### [强制] 当属性值为 0 时，*必须*（MUST）省略可省的单位（长度单位如 `px`、`em`，不包括时间、角度等如 `s`、`deg`）。

```less
// BAD
margin-top: 0px;

// GOOD
margin-top: 0;
```

### [强制] 颜色定义*必须*（MUST）使用 `#rrggbb` 或 `#rrggbbaa` 格式定义，并在可能时*尽量*（SHOULD）缩写为 `#rgb` 或 `#rgba` 形式，且避免直接使用颜色名称与 `rgb()` 或 `rgba()` 表达式。

```less
// BAD
border-color: red;
color: rgb(254, 254, 254);
background-color: rgba(0, 0, 0, 50%);

// GOOD
border-color: #f00;
color: #fefefe;
background-color: #00000080;
```

### [建议] 同一属性有不同私有前缀的，*尽量*（SHOULD）按前缀长度降序书写，标准形式*必须*（MUST）写在最后。且这一组属性以第一条的位置为准，*尽量*（SHOULD）按冒号的位置对齐。

解释：

建议使用 [Autoprefixer](https://github.com/postcss/autoprefixer) 插件实现，书写时只写标准形式的属性。

```less
// GOOD
.box {
    -webkit-transform: rotate(30deg);
       -moz-transform: rotate(30deg);
        -ms-transform: rotate(30deg);
         -o-transform: rotate(30deg);
            transform: rotate(30deg);
}
```

### [建议] *可以*（MAY）在无其他更好解决办法时使用 CSS hack，并且*尽量*（SHOULD）使用简单的属性名 hack 如 `_zoom`、`*margin`。

### [建议] *可以*（MAY）但谨慎使用 IE 滤镜。需要注意的是，IE 滤镜中图片的 URL 是以页面路径作为相对目录，而不是 CSS 文件路径。
