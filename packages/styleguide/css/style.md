## 代码风格

### 文件

#### [建议] `CSS` 文件使用无 `BOM` 的 `UTF-8` 编码。

解释：

UTF-8 编码具有更广泛的适应性。BOM 在使用程序或工具处理文件时可能造成不必要的干扰。

### 缩进

#### [强制] 使用 `4` 个空格做为一个缩进层级，不允许使用 `2` 个空格 或 `tab` 字符。

示例：

```css
.selector {
    margin: 0;
    padding: 0;
}
```

### 空格

#### [强制] `选择器` 与 `{` 之间必须包含空格。

示例：

```css
.selector {
}
```

#### [强制] `属性名` 与之后的 `:` 之间不允许包含空格， `:` 与 `属性值` 之间必须包含空格。

示例：

```css
margin: 0;
```

#### [强制] `列表型属性值` 书写在单行时，`,` 后必须跟一个空格。

示例：

```css
font-family: Arial, sans-serif;
```

### 行长度

#### [强制] 每行不得超过 `120` 个字符，除非单行不可分割。

解释：

常见不可分割的场景为 URL 超长。

#### [建议] 对于超长的样式，在样式值的 `空格` 处或 `,` 后换行，建议按逻辑分组。

示例：

```css
/* 不同属性值按逻辑分组 */
background:
    transparent url(aVeryVeryVeryLongUrlIsPlacedHere)
    no-repeat 0 0;

/* 可重复多次的属性，每次重复一行 */
background-image:
    url(aVeryVeryVeryLongUrlIsPlacedHere)
    url(anotherVeryVeryVeryLongUrlIsPlacedHere);

/* 类似函数的属性值可以根据函数调用的缩进进行 */
background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.04, rgb(88,94,124)),
    color-stop(0.52, rgb(115,123,162))
);
```

### 选择器

#### [强制] 当一个 rule 包含多个 selector 时，每个选择器声明必须独占一行。

示例：

```css
/* GOOD */
.post,
.page,
.comment {
    line-height: 1.5;
}

/* BAD */
.post, .page, .comment {
    line-height: 1.5;
}
```

#### [强制] `>`、`+`、`~` 选择器的两边各保留一个空格。

示例：

```css
/* GOOD */
main > nav {
    padding: 10px;
}

label + input {
    margin-left: 5px;
}

input:checked ~ button {
    background-color: #69C;
}

/* BAD */
main>nav {
    padding: 10px;
}

label+input {
    margin-left: 5px;
}

input:checked~button {
    background-color: #69C;
}
```

#### [强制] 属性选择器中的值必须用双引号包围。

解释：

不允许使用单引号，不允许不使用引号。

示例：

```css
/* GOOD */
article[character="juliet"] {
    voice-family: "Vivien Leigh", victoria, female;
}

/* BAD */
article[character='juliet'] {
    voice-family: "Vivien Leigh", victoria, female;
}
```

### 属性

#### [强制] 属性定义必须另起一行。

示例：

```css
/* GOOD */
.selector {
    margin: 0;
    padding: 0;
}

/* BAD */
.selector { margin: 0; padding: 0; }
```

#### [强制] 属性定义后必须以分号结尾。

示例：

```css
/* GOOD */
.selector {
    margin: 0;
}

/* BAD */
.selector {
    margin: 0
}
```
