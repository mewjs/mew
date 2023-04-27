## 文件组织

### [强制] 使用 UTF-8 编码。*不得*（MUST NOT）包含 BOM 信息。

### [强制] 代码*必须*（MUST）按如下形式按顺序组织：

1. `@import`
2. 变量声明
3. 样式声明

```less
// GOOD
@import "ui/all.less";

@default-text-color: #333;

.page {
    width: 960px;
    margin: 0 auto;
}
```
