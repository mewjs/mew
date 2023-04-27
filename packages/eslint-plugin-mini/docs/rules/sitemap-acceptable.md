# 小程序 sitemap.json 配置检查 (sitemap-acceptable)

小程序 sitemap.json 配置检查。

## Rule Details

检查 sitemap.json 配置项是否有缺失，配置项是否合理。

正确的代码示例，包含`desc`, `rules` 节点:

```json
{
    "desc": "关于本文件的更多信息，请参考文档 https://developers.weixin.qq.com/miniprogram/dev/framework/sitemap.html",
    "rules": [
        {
            "action": "allow",
            "page": "*",
            "params": ["abc"]
        }
    ]
}
```

错误的代码示例，节点缺失或者节点不正确:

```js
// not action value
{
    "rules": [
        {
            "action": "not action value",
            "page": "*",
            "params: ["abc"]
        }
    ]
}

// no page
{
    "rules": [
        {
            "action": "not action value"
        }
    ]
}

// no action
{
    "rules": [
        {
            "page": "page"
        }
    ]
}
```

## Options

无

## When Not To Use It

非小程序项目不适用此规则，会导致不必要的报错。

