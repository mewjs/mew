# 代码注释 (comment-directive)

wxml, axml, swan 文件的代码注释功能。

## Rule Details

通过代码注释开启或者禁用某些检查规则。

正确的代码示例:

```xml
<!-- eslint-disable -->
<text></text>
<!-- eslint-enable -->

<!-- eslint-disable-next-line -->
<text></text>
<!-- eslint-enable-next-line -->
```

正确的代码示例:

```xml
<!-- eslint-disable mini/no-static-inline-styles -->
<text style="color:red"></text>
<!-- eslint-enable mini/no-static-inline-styles -->

<!-- eslint-disable-nextline mini/no-static-inline-styles -->
<text style="color:red"></text>
<!-- eslint-enable-nextline mini/no-static-inline-styles -->
```

错误的代码示例，注释无效:

```xml
<!-- eslint--disable -->
<text></text>

<!-- no abc rule -->
<!-- eslint-disable abc-->

<!-- repeat disable rule -->
<!-- eslint-disable mini/no-static-inline-styles-->
<!-- eslint-disable mini/no-static-inline-styles-->

<!-- repeat disable rule -->
<!-- eslint-disable-nextline mini/no-static-inline-styles-->
<!-- eslint-disable-nextline mini/no-static-inline-styles-->
```


## Options

```javascript
[
    {
        type: 'object',
        properties: {
            reportUnusedDisableDirectives: {
                type: 'boolean'
            }
        }
    }
]
```

### reportUnusedDisableDirectives

报告未使用的 eslint-disable 注释，如果当前错误注释未被使用，则报告一个错误。

