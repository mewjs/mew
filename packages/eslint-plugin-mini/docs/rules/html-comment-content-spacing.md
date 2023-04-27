# 检查html注释内部空格 (html-comment-content-spacing)


## Rule Details

此规则强制html注释`<!--`后和`-->`前空格保持一致，可以设置空格前存在特殊字符。

正确的代码示例:

```xml
<!-- -->

<!--
    comment
-->

<!-- comment -->
```

错误的代码示例:

```xml
<!--comment -->

<!-- comment-->

<!--comment-->
```

## Options

```javascript
[
    'html-comment-content-spacing': [
        'error',
        'always' | 'never',
        {
            'exceptions': []
        }
    ]
]
```

### 'always' | 'never'
-   always:  默认，`<!--`后和`-->`前最少存在一个空格或换行
-   never:  强制`<!--`后和`-->`前不能存在空格

### exceptions
设置`<!--`后和`-->`前可以存在特殊字符，只有第一个参数为'always'时起作用，例如:

`[2, 'always', {exceptions: ['+', '*', '++xx']}]`,

```xml
<!--++++ comment ++++-->
<!--****
    comment
****-->
<!--++xx
    comment
++xx-->
```