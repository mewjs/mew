# 检查import/include/wxs 标签引入的 src 文件是否存在 (resolve-src)

检查import/include/wxs 标签引入的 src 文件是否存在.

## Rule Details

文件目录结构
文件根目录：demo
demo 目录结构：

```js
demo
├── app.json
├── app.js
├── app.wxss
├── sitemap.json
├── tools.wxs
├── pages
        └── index
            ├── index.js
            ├── index.json
            ├── index.wxss
            └── index.wxml
        └── test
            ├── index.js
            ├── index.json
            ├── index.wxss
            └── index.wxml

```


正确的代码示例:

文件所在路径：demo/page/index/index.wxml

```xml
<wxs src="../../tools.wxs" />
<wxs src="../../tools.wxs"></wxs>
<import src="../test/item.wxml"/>
<import src="/pages/test/item.wxml"/>
<import src="../test/item.wxml"></import>
<include src="../test/item.wxml"/>
<include src="/pages/test/item.wxml"/>
<include src="../test/item.wxml"></include>
<include />
<import />
<include></include>
<import></import>
```

错误的代码示例:

文件所在路径：demo/pages/index/index.wxml

```xml
<wxs src="/pages/test/tools.wxs" />
<wxs src="./tools.wxs"></wxs>
<wxs src="{{srcUrl}}" />
<import src="{{srcUrl}}" />
<import src="../index.wxml"></import>
<import src="/pages/test/files/index.wxml"></import>
<include src="{{srcUrl}}" />
<include src="../index.wxml"></include>
<include src="/pages/test/files/index.wxml"></include>

```

## Options

无