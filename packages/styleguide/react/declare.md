## 组件声明

### [强制]  使用 Class 声明组件，禁止使用 `React.createClass`。

解释：

[React v15.5.0](https://facebook.github.io/react/blog/2017/04/07/react-v15.5.0.html) 已经弃用了 `React.createClass` 函数。

```js
// BAD
const Message = React.createClass({
    render() {
        return <span>{this.state.message}</span>;
    }
});

// GOOD
class Message extends PureComponent {
    render() {
        return <span>{this.state.message}</span>;
    }
}
```

### [强制] 不使用 `state` 的组件声明为函数组件。

解释：

函数组件在 React 中有着特殊的地位，在将来也有可能得到更多的内部优化。

```js
// BAD
class NextNumber {
    render() {
        return <span>{this.props.value + 1}</span>
    }
}

// GOOD
const NextNumber = ({value}) => <span>{value + 1}</span>;
```

### [强制] 所有组件均需声明 `propTypes`。

解释：

`propsTypes` 在提升组件健壮性的同时，也是一种类似组件的文档的存在，有助于代码的阅读和理解。

从优化角度考虑，也可以在 babel 构建时使用 `babel-plugin-transform-react-remove-prop-types` 插件自动移除相关的 `propTypes`。

### [强制] 对于所有非 `isRequired` 的属性，在 `defaultProps` 中声明对应的值。

解释：

声明初始值有助于对组件初始状态的理解，也可以减少`propTypes`对类型进行校验产生的开销。

对于初始没有值的属性，应当声明初始值为 `null` 而非 `undefined`。

### [强制] 如无必要，使用静态属性语法声明 `propsTypes`、`contextTypes`、`defaultProps` 和 `state`。

解释：

仅当初始 `state` 需要从 `props` 计算得到的时候，才将 `state` 的声明放在构造函数中，其它情况下均使用静态属性声明进行。

### [强制] 依照规定顺序编排组件中的方法和属性。

解释：

按照以下顺序编排组件中的方法和属性：

1. `static displayName`
2. `static propTypes`
3. `static contextTypes`
4. `static defaultProps`
5. `state`
6. 其它静态的属性
7. 用于事件处理并且以属性的方式（`onClick = e => {...}`）声明的方法
8. 其它实例属性
9. `constructor`
10. `getChildContext`
11. `getDerivedStateFromProps`
12. `componentWillMount`
13. `componentDidMount`
14. `componentWillReceiveProps`
15. `shouldComponentUpdate`
16. `componentWillUpdate`
17. `getSnapshotBeforeUpdate`
18. `componentDidUpdate`
19. `componentDidCatch`
20. `componentWillUnmount`
21. 事件处理方法
22. 其它方法
23. `render`

其中 `shouldComponentUpdate` 和 `render` 是一个组件最容易被阅读的函数，因此放在最下方有助于快速定位。

### [建议] 无需显式引入React对象。

解释：

使用 JSX 隐式地依赖当前环境下有 `React` 这一对象，但在源码上并没有显式使用，这种情况下添加 `import React from 'react';` 会造成一个没有使用的变量存在。

使用 [babel-plugin-react-require](https://www.npmjs.com/package/babel-plugin-react-require) 插件可以很好地解决这一问题，因此无需显式地编写 `import React from 'react';` 这一语句。

### [建议] 使用箭头函数声明函数组件。

解释：

箭头函数具备更简洁的语法（无需`function`关键字），且可以在仅有一个语句时省去`return`造成的额外缩进。

### [建议] 高阶组件返回新的组件类型时，添加 `displayName` 属性。

解释：

同时在 `displayName` 上声明高阶组件的存在。

```js
// GOOD
const asPureComponent = Component => {
    const componentName = Component.displayName || Component.name || 'UnknownComponent';
    return class extends PureComponent {
        static displayName = `asPure(${componentName})`

        render() {
            return <Component {...this.props} />;
        }
    };
};
```
