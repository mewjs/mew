## JSX

### [强制] 没有子节点的非DOM组件使用自闭合语法。

解释：

对于 DOM 节点，按照 HTML 编码规范相关规则进行闭合，**其中 void element 使用自闭合语法**。

```js
// BAD
<Foo></Foo>

// GOOD
<Foo />
```

### [强制] 保持起始和结束标签在同一层缩进。

解释：

对于标签前面有其它语句（如 `return` 的情况，使用括号进行换行和缩进）。

```js
// BAD
class Message {
    render() {
        return <div>
            <span>Hello World</span>
        </div>;
    }
}

// GOOD
class Message {
    render() {
        return (
            <div>
                <span>Hello World</span>
            </div>;
        );
    }
}
```

对于直接 `return` 的函数组件，可以直接使用括号而省去大括号和 `return` 关键字：

```js
let Message = () => (
    <div>
        <span>Hello World</span>
    </div>
);
```

### [强制] 对于多属性需要换行，从第一个属性开始，每个属性一行。

解释：

```js
// 没有子节点
<SomeComponent
    longProp={longProp}
    anotherLongProp={anotherLongProp}
/>

// 有子节点
<SomeComponent
    longProp={longProp}
    anotherLongProp={anotherLongProp}
>
    <SomeChild />
    <SomeChild />
</SomeComponent>
```

### [强制] 以字符串字面量作为值的属性使用双引号（`"`），在其它类型表达式中的字符串使用单引号（`'`）。

解释：

```js
// BAD
<Foo bar='bar' />
<Foo style={{width: "20px"}} />

// GOOD
<Foo bar="bar" />
<Foo style={{width: '20px'}} />
```

### [强制] 自闭合标签的 `/>` 前添加一个空格。

解释：

```js
// BAD
<Foo bar="bar"/>
<Foo bar="bar"  />

// GOOD
<Foo bar="bar" />
```

### [强制] 对于值为 `true` 的属性，省去值部分。

解释：

```js
// BAD
<Foo visible={true} />

// GOOD
<Foo visible />
```

### [强制] 对于需要使用 `key` 的场合，提供一个唯一标识作为 `key` 属性的值，禁止使用可能会变化的属性（如索引）。

解释：

`key` 属性是 React 在进行列表更新时的重要属性，如该属性会发生变化，渲染的性能和**正确性**都无法得到保证。

```js
// BAD
{list.map((item, index) => <Foo key={index} {...item} />)}

// GOOD
{list.map(item => <Foo key={item.id} {...item} />)}
```

### [建议] 避免在 JSX 的属性值中直接使用对象和函数表达式。

解释：

`PureComponent` 使用 [`shallowEqual`](https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/shallowEqual.js) 对 `props` 和 `state` 进行比较来决定是否需要渲染，而在 JSX 的属性值中使用对象、函数表达式会造成每一次的对象引用不同，从而 `shallowEqual` 会返回 `false`，导致不必要的渲染。

```js
// BAD
class WarnButton {
    alertMessage(message) {
        alert(message);
    }

    render() {
        return <button type="button" onClick={() => this.alertMessage(this.props.message)}>提示</button>
    }
}

// GOOD
class WarnButton {
    @autobind
    alertMessage() {
        alert(this.props.message);
    }

    render() {
        return <button type="button" onClick={this.alertMessage}>提示</button>
    }
}
```

### [建议] 将 JSX 的层级控制在 3 层以内。

解释：

JSX 提供了基于组件的便捷的复用形式，因此可以通过将结构中的一部分封装为一个函数组件来很好地拆分大型复杂的结构。层次过深的结构会带来过多缩进、可读性下降等缺点。如同控制函数内代码行数和分支层级一样，对 JSX 的层级进行控制可以有效提升代码的可维护性。

```js
// BAD
const List = ({items}) => (
    <ul>
        {
            items.map(item => (
                <li>
                    <header>
                        <h3>{item.title}</h3>
                        <span>{item.subtitle}</span>
                    </header>
                    <section>{item.content}</section>
                    <footer>
                        <span>{item.author}</span>@<time>{item.postTime}</time>
                    </footer>
                </li>
            ))
        }
    </ul>
);
```

```js
// GOOD
const Header = ({title, subtitle}) => (
    <header>
        <h3>{title}</h3>
        <span>{subtitle}</span>
    </header>
);

const Content = ({content}) => <section>{content}</section>;

const Footer = ({author, postTime}) => (
    <footer>
        <span>{author}</span>@<time>{postTime}</time>
    </footer>
);

const Item = item => (
    <div>
        <Header {...item} />
        <Content {...item} />
        <Footer {...item} />
    </div>
);

const List = ({items}) => (
    <ul>
        {items.map(Item)}
    </ul>
);
```
