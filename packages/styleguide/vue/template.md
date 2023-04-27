## 模板

### [强制] 模板中的 HTML 标签闭合规则遵循 HTML 规范，组件标签无子元素时使用自闭合标签。

解释：

对于 DOM 节点，按照 HTML 编码规范相关规则进行闭合，**其中 void element 不需要闭合**。

``` html
<!-- BAD -->
<input type="text" />
<my-component></my-component>

<!-- GOOD -->
<input type="text">
<my-component />
<my-component>
    text here...
</my-component>

```

### [强制] 禁止直接使用 DOM 定义模板。

解释：

从 DOM 中获取字符串作为模板，会因为浏览器的原生 HTML 解析行为而导致一些小问题，比如大小写不敏感 与 HTML 嵌套规则导致忽略自定义组件的标签节点等。

### [强制] 保持起始和结束标签在同一层缩进。

示例：

```html
<!-- BAD -->
<my-component>
    <p>text</p></my-component>

<!-- GOOD -->
<my-component>
    <p>
        text
    </p>
</my-component>

```

### [强制] 对于多属性需要换行，从第一个属性开始，每个属性一行。

解释：

```html
<!-- 没有子节点 -->
<my-component
    :long-prop="longPropValue"
    another-long-prop="anotherLongPropValue"
/>

<!-- 有子节点 -->
<my-component
    :long-prop="longPropValue"
    another-long-prop="anotherLongPropValue"
>
    <my-foo />
    <my-bar />
</my-component>
```

### [强制] 以字符串字面量作为值的属性使用双引号（`"`），在其它类型表达式中的字符串使用单引号（`'`）。

解释：

表达式可以理解为 JavaScript 的 Context，因此遵循 JavaScript 的相关规范。

```html
<!-- BAD -->
<foo-bar bar='bar' />
<foo-bar>
    {{ "foobar".slice(3) }}
</foo-bar>


<!-- GOOD -->
<foo-bar bar="bar" />
<foo-bar>
    {{ 'foobar'.slice(3) }}
</foo-bar>
```

### [强制] 自闭合标签的 `/>` 前添加一个空格。

解释：

```html
<!-- BAD -->
<foo-bar bar="bar"/>
<foo-bar bar="bar"  />

<!-- GOOD -->
<foo-bar bar="bar" />
```

### [强制] 对于值为 `true` 的属性，省去值部分。

解释：

```html
<!-- BAD -->
<foo-bar :visible="true" />

<!-- GOOD -->
<foo-bar visible />
```

### [建议] 组件模板的标签嵌套层级控制在 3 层以内。

解释：

层次过深的结构会带来过多缩进、可读性下降等缺点，可以通过拆分成一定粒度的函数组件来避免过多的层级嵌套。如同控制函数内代码行数和分支层级一样，对标签的层级进行控制可以有效提升代码的可维护性。
