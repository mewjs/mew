# 检查表达式内部空格 (mustache-interpolation-spacing)


## Rule Details

表达式开标签`{{`后和闭标签`}}`前，禁止出现或强制加上空格。

正确的代码示例:

```xml
<view>{{1+1}}</view>

<view class="{{myClass}}"></view>

<view wx:for="{{[1, 2, 3]}}">
    {{item}}
</view>
```

错误的代码示例:

```xml
<view>{{ 1+1 }}</view>

<view class="{{ myClass }}"></view>

<view wx:for="{{ [1, 2, 3] }}">
    {{ item }}
</view>
```

## Options

```javascript
[
    'mustache-interpolation-spacing': [
        'error',
        'always' | 'never'
    ]
]
```

### 'always' | 'never'
-   always: 默认，禁止出现空格

-   never: 强制加上空格