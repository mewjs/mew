## 注释

### [强制] 单行注释*必须*（MUST）使用 `//` 方式。

解释：

现代编程器都支持 `cmd + /` 的操作快速增加注释或反注释的操作。

```less
// BAD
/* Hide everything */
* {
    display: none;
}

// GOOD
// Hide everything
* {
    display: none;
}
```
