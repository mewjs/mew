## 图片

### [强制] 禁止 `img` 的 `src` 取值为空。延迟加载的图片也要增加默认的 `src`。

解释：

`src` 取值为空，会导致部分浏览器重新加载一次当前页面，参考：<https://developer.yahoo.com/performance/rules.html#emptysrc>

### [建议] 避免为 `img` 添加不必要的 `title` 属性。

解释：

多余的 `title` 影响看图体验，并且增加了页面尺寸，如因 SEO 需要建议使用 `alt` 属性。

### [建议] 为重要图片添加 `alt` 属性。

解释：

可以提高图片加载失败时的用户体验。

### [强制] 添加 `width` 和 `height` 属性或相应样式，以避免页面抖动。

### [建议] 有下载需求的图片采用 `img` 标签实现，无下载需求的图片采用 CSS 背景图实现。

解释：

1. 产品 logo、用户头像、用户产生的图片等有潜在下载需求的图片，以 `img` 形式实现，能方便用户下载。
2. 无下载需求的图片，比如：icon、背景、代码使用的图片等，尽可能采用 CSS 背景图实现。

### [建议] 为现代浏览器使用 `WebP` 格式的图片。
