#  闭括号前的空格检查 (html-closing-bracket-spacing)

检查 wxml 文件中标签的闭括号前是否有空格。

## Rule Details

允许或禁止标签的闭括号前出现空格。

正确的代码示例:

```xml
<!-- ✓ GOOD -->
<view>
    <view></view>
    <input />
</view>

<view>
    <view class="{{abc}}"></view>
    <input placeholder="abc" />
</view>
```



错误的代码示例:

```xml
<view>
    <view ></view >
    <input/>
</view    >


<view>
    <view class="{{abc}}" ></view>
    <input value="{{abc}}"/>
</view>


<view >
    <view class="{{abc}}" style="flex-direction:row;" >
        <input placeholder="abc"/>
    </view >
</view>
```



### Options

```json
{
    "html-closing-bracket-spacing": ["error", {
        "startTag": "always" | "never",
        "endTag": "always" | "never",
        "selfClosingTag": "always" | "never"
    }]
}
```



1. startTag ("always" | "never"): 为开始标签设置空格（如： \<view\>），默认值为 `never`。

- "always": 至少需要一个空格，如 \<view     \>。

- "never": 不允许出现空格, 如\<view\>。



2. endTag ("always" | "never"): 为结束标签设置空格（如： \</view\>），默认值为 `never`。

- "always": 至少需要一个空格，如 \</view    \>。

- "never": 不允许出现空格, 如\</view\>。



3. selfClosingTag ("always" | "never"): 为自闭合标签设置空格（如： \<input /\>），默认值为 `always`。

- "always": 至少需要一个空格，如 \<input    /\>。

- "never": 不允许出现空格, 如\<input/\>。



### 标签闭括号前空格检查默认配置
"startTag": "never", "endTag": "never", "selfClosingTag": "always"

```xml
<view>
    <view class="{{abc}}">
        <input placeholder="abc" />
    </view>
</view>
```

