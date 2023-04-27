## 导入

### [强制] `@import` 语句引用的文件*必须*（MUST）写在单引号 `'` 内，`.less` 后缀*不得*（MUST NOT）省略（与引入 CSS 文件时的路径格式一致）。

```less
// BAD
@import "my/mixins.less";

// GOOD
@import 'my/mixins.less';
```
