
## head

### title

#### [强制] 页面必须包含 `title` 标签声明标题，对于 SPA 应用应当在路由切换时同时修改相匹配的标题。

#### [强制] `title` 必须作为 `head` 的直接子元素，并紧随 `charset` 声明之后。

解释：

`title` 中如果包含 ASCII 之外的字符，浏览器需要知道字符编码类型才能进行解码，否则可能导致乱码。

示例：

```html
<head>
    <meta charset="utf-8">
    <title>页面标题</title>
</head>
```

### favicon

#### [强制] 保证 `favicon` 可访问。

解释：

在未指定 favicon 时，大多数浏览器会请求 Web Server 根目录下的 `favicon.ico` 。为了保证 favicon 可访问，避免 404，必须遵循以下两种方法之一：

1. 在 Web Server 根目录放置 `favicon.ico` 文件。
2. 使用 `link` 指定 favicon。

示例：

```html
<link rel="shortcut icon" href="path/to/favicon.ico">
```

### viewport

#### [建议] 若页面欲对移动设备友好，需指定页面的 `viewport`。

解释：

viewport meta tag 可以设置可视区域的宽度和初始缩放大小，避免在移动设备上出现页面展示不正常。

比如，在页面宽度小于 `980px` 时，若需 iOS 设备友好，应当设置 viewport 的 `width` 值来适应你的页面宽度。同时因为不同移动设备分辨率不同，在设置时，应当使用 `device-width` 和 `device-height` 变量。

另外，为了使 viewport 正常工作，在页面内容样式布局设计上也要做相应调整，如避免绝对定位等。关于 viewport 的更多介绍，可以参见 [Safari Web Content Guide的介绍](https://developer.apple.com/library/mac/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html#//apple_ref/doc/uid/TP40006509-SW26)

### meta

#### [建议] 根据需要使用 `meta` 标签补充适当的 `keywords` 和 `description`。

解释：

在有 SEO 需求的页面，应根据内容补充适当的 `keywords` 和 `description` 内容。

```html
<meta charset="utf-8">
<title>【xxxxxx】xxxxxx，拥抱每一种生活</title>
<meta name="keywords" content="xxxxxx,xxxxxx官网,xxxxxx下载,github.com/xxxx,xxxxxx直播伴侣,xxxxxxapp,短视频app,xxxxxx直播">
<meta name="description" content="xxxxxx是一款国民级短视频App。在xxxxxx，了解真实的世界，认识有趣的人，也可以记录真实而有趣的自己。xxxxxx，拥抱每一种生活。">
```
