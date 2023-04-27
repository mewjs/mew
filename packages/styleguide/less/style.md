## 风格

### [强制] `{`、`}`、`:`、`,` 前后的空格与换行规则与 CSS 规范一致。

解释：

1. 选择器和 `{` 之间*必须*（MUST）保留一个空格，`}` 独占一行。

2. 属性名后的冒号（`:`）与属性值之间*必须*（MUST）保留一个空格，冒号前*不得*（MUST NOT）保留空格。

3. 定义变量时冒号（`:`）与变量值之间*必须*（MUST）保留一个空格，冒号前*不得*（MUST NOT）保留空格。

在用逗号（`,`）分隔的列表（Less 函数参数列表、以 `,` 分隔的属性值等）中，逗号后*必须*（MUST）保留一个空格，逗号前*不得*（MUST NOT）保留空格。

示例：

```less
// BAD
.box{
    @w:50px;
    @h :30px;
    width:@w;
    height :@h;
    color: rgba(255,255,255,.3);
    transition: width 1s,height 3s;
}

// GOOD
.box {
    @w: 50px;
    @h: 30px;
    width: @w;
    height: @h;
    transition: width 1s, height 3s;
}
```

### [强制] `+` / `-` / `*` / `/` 四个运算符两侧*必须*（MUST）保留一个空格。`+` / `-` 两侧的操作数*必须*（MUST）有相同的单位，如果其中一个是变量，另一个数值*必须*（MUST）书写单位。

示例：

```less
// BAD
@a: 200px;
@b: (@a+100)*2;

// GOOD
@a: 200px;
@b: (@a + 100px) * 2;
```

### [强制] Mixin 和后面的空格之间*不得*（MUST NOT）包含空格。在给 mixin 传递参数时，在参数分隔符（`,` / `;`）后*必须*（MUST）保留一个空格。

解释：

参考 JavaScript 的函数调用。

示例：

```less
// BAD
.box {
    .size(30px,20px);
    .clearfix ();
}

// GOOD
.box {
    .size(30px, 20px);
    .clearfix();
}
```

### [强制] *必须*（MUST）采用 4 个空格为一次缩进， *不得*（MUST NOT）采用 TAB 作为缩进。

### [强制] 嵌套的声明块前*必须*（MUST）增加一次缩进，有多个声明块共享命名空间时*尽量*（SHOULD）嵌套书写，避免选择器的重复。

### [建议] *尽量*（SHOULD）仅在必须区分上下文时才引入嵌套关系（在嵌套书写前先考虑如果不能嵌套，会如何书写选择器）。

```less
// BAD
.main .title {
  font-weight: 700;
}

.main .content {
  line-height: 1.5;
}

.main {
.warning {
  font-weight: 700;
}

  .comment-form {
    #comment:invalid {
      color: red;
    }
  }
}

// GOOD
.main {
    .title {
        font-weight: 700;
    }

    .content {
        line-height: 1.5;
    }

    .warning {
        font-weight: 700;
    }
}

#comment:invalid {
    color: red;
}
```
