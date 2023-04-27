# 禁止多个空格 (no-multi-spaces)

## Rule Details

此规则不允许存在不用于缩进的多个空格。

正确的代码示例:

```xml
<view></view>   <view></view>

<view class="myClass"></view>

<view
    class="myClass"
></view>
```

错误的代码示例:

```xml
<view class  =  "myClass"></view>

<view
    class="myClass"    style="color:red"
></view>

<view class="myClass"   ></view>
```

## Options

```javascript
[
    'no-multi-spaces': [
        'error',
        {
            'ignoreProperties': true | false,
        },
    ]
]
```

### ignoreProperties
是否忽略对象内部属性键值间多个空格，默认false

