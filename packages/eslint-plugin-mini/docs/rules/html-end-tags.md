# 闭合标签规则 (html-end-tags)

检查 wxml 文件的代码是否有闭合标签。

## Rule Details

强制代码使用闭合标签。

正确的代码示例:

```xml
 <!-- ✓ GOOD -->
    <view>
        <text></text>
    </view>

    <view>
        <text>
            <input placeholder="abc" />
        </text>
    </view>

    <view>
        <block>
            <!-- hello -->
        </block>
    </view>
```

错误的代码示例，不包含闭合标签:

```xml
    <view>
        <block>
            <text>
        </block>
    </view>

    <view>
        <text>
            <text>
        </text>
    </view>
```



