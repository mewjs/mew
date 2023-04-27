# 组件属性检查 (component-attributes)

小程序组件属性检查，属性是否可用，属性值是否设置正确等。

## Rule Details

通过代码注释开启或者禁用某些检查规则，仅检查静态属性，动态属性，如 directive，或者 属性值为表达式不进行检查。

正确的代码示例:

```xml
<text class="abc"></text>
<text class="{{className}}"></text>
<text wx:if="{{1}}"></text>
<view hover-class="abc"></text>
<view aria-role="button"></text>
<icon size="1"></text>
```

错误的代码示例:

```xml
<!-- 类型错误 -->
<icon size="notNumber"></text>

<!-- 不是枚举中的值 -->
<icon type="unknownType"></text>

<!-- 不认识的属性 -->
<icon unknown-attribute="unknown-attribute"></text>
```


## Options

```javascript
[
    {
        type: 'object',
        properties: {
            allowEmpty: {
                type: 'boolean'
            },
            allowUnknown: {
                type: 'boolean'
            }
        }
    }
]
```

### allowEmpty

是否允许 attribute 值为空值，默认为 `false` 不允许


错误的代码示例:

```xml
<icon size=""></text>
<icon size=" "></text>
```

### allowUnknown

是否允许未知的 attribute 属性，默认为 `true`，当前参照微信版本为: v2.14.0 (2020-10-23)，由于微信官方没有提供
小程序组件schema，不排除未来新的属性设置没有得到及时更新。


错误的代码示例:

```xml
<icon unknown-attribute="unknown-attribute"></text>
```