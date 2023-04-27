# 小程序 app.json 配置检查 (app-config-acceptable)

小程序 app.json 配置检查。

## Rule Details

检查 app.json 配置项是否有缺失，配置项是否合理。

正确的代码示例，包含`pages`, `window` 节点:

```json
{
  "pages": [
    "pages/index/index"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "WeChat",
    "navigationBarTextStyle": "black"
  },
  "sitemapLocation": "sitemap91.json"
}
```

错误的代码示例，节点缺失或者节点不正确:

```json
// no config
{
}

// no pages
{
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "WeChat",
    "navigationBarTextStyle": "black"
  }
}

// no window
{
  "pages": [
    "pages/index/index"
  ]
}
```

## Options

无

## When Not To Use It

非小程序项目不适用此规则，会导致不必要的报错。

