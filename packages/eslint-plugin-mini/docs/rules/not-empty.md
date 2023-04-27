# 检查小程序模板文件是否空文件 (not-empty)

检查小程序模板文件是否空文件。

## Rule Details


正确的代码示例:

```xml
<view></view>
```

正确的代码示例:

```xml
<!-- page.wxml -->
```

错误的代码示例:

```xml

```

## Options

```javascript
[
    {
        type: 'object',
        properties: {
            allowComment: {
                type: 'boolean'
            }
        }
    }
]
```

### allowComment

是否允许只包含注释的空文件，默认 true。