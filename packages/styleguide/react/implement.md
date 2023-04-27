## 组件实现

### [强制] 除顶层或路由级组件以外，所有组件均在概念上实现为纯组件（Pure Component）。

解释：

本条规则并非要求组件继承自 `PureComponent`，“概念上的纯组件”的意思为一个组件在 `props` 和 `state` 没有变化（shallowEqual）的情况下，渲染的结果应保持一致，即`shouldComponentUpdate` 应当返回 `false`。

一个典型的非纯组件是使用了随机数或日期等函数：

```js
const RandomNumber = () => <span>{Math.random()}</span>;
const Clock = () => <span>{Date.time()}</span>;
```

非纯组件具备向上的“传染性”，即一个包含非纯组件的组件也必须是非纯组件，依次沿组件树结构向上。由于非纯组件无法通过 `shouldComponentUpdate` 优化渲染性能且具备传染性，因此要避免在非顶层或路由组件中使用。

如果需要在组件树的某个节点使用随机数、日期等非纯的数据，应当由顶层组件生成这个值并通过 `props` 传递下来。对于使用 Redux 等应用状态管理的系统，可以在应用状态中存放相关值（如 Redux 使用 Action Creator 生成这些值并通过 Action 和 reducer 更新到 store 中）。

### [强制] 禁止为继承自 `PureComponent` 的组件编写 `shouldComponentUpdate` 实现。

解释：

参考 [React 相关 Issue](https://github.com/facebook/react/issues/9239)，在 React 的实现中，`PureComponent` 并不直接实现 `shouldComponentUpdate`，而是添加一个 `isReactPureComponent` 的标记，由 `CompositeComponent` 通过识别这个标记实现相关的逻辑。因此在 `PureComponent` 上自定义 `shouldComponentUpdate` 并无法享受 `super.shouldComponentUpdate` 的逻辑复用，也会使得这个继承关系失去意义。

### [强制] 为非继承自`PureComponent`的纯组件实现`shouldComponentUpdate`方法。

解释：

`shouldComponentUpdate` 方法在 React 的性能中扮演着至关重要的角色，纯组件必定能通过 `props` 和 `state` 的变化来决定是否进行渲染，因此如果组件为纯组件且不继承`shouldComponentUpdate`，则应当有自己的 `shouldComponentUpdate` 实现来减少不必要的渲染。

### [建议] 为函数组件添加`PureComponent`能力。

解释：

函数组件并非一定是纯组件，因此其 `shouldComponentUpdate` 的实现为 `return true;`，这可能导致额外的无意义渲染，因此推荐使用高阶组件为其添加`shouldComponentUpdate` 的相关逻辑。

推荐使用 [react-pure-stateless-component](https://www.npmjs.com/package/react-pure-stateless-component) 库实现这一功能。

### [建议] 使用`@autobind`进行事件处理方法与`this`的绑定。

解释：

由于 `PureComponent` 使用 [`shallowEqual`](https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/shallowEqual.js)` 进行是否渲染的判断，如果在 JSX 中使用 `bind` 或箭头函数绑定 `this` 会造成子组件每次获取的函数都是一个新的引用，这破坏了 `shouldComponentUpdate` 的逻辑，引入了无意义的重复渲染，因此需要在 `render` 调用之前就将事件处理方法与 `this` 绑定，在每次 `render` 调用中获取同样的引用。

当前比较流行的事前绑定 `this` 的方法有2种，其一使用类属性的语法：

```js
class Foo {
    onClick = e => {
        // ...
    }
};
```

其二使用`@autobind`的装饰器：

```js
class Foo {
    @autobind
    onClick(e) {
        // ...
    }
}
```

使用类属性语法虽然可以避免引入一个 `autobind` 的实现，但存在一定的缺陷：

1. 对于新手不容易理解函数内的 `this` 的定义。
2. 无法在函数是使用其它的装饰器（如`memoize`、`deprecated` 或检验相关的逻辑等）。

因此，推荐使用 `@autobind` 装饰器实现 `this` 的事先绑定，推荐使用 [core-decorators](https://www.npmjs.com/package/core-decorators) 库提供的相关装饰器实现。
