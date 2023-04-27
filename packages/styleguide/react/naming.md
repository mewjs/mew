## 命名规则

### [强制] 组件名为 PascalCase。

解释：

包括函数组件，名称均为 PascalCase。

### [强制] 组件名称与文件名称保持相同。

解释：

同时组件名称应当能体现出组件的功能，以便通过观察文件名即确定使用哪一个组件。

### [强制] 高阶组件使用 camelCase 命名。

解释：

高阶组件事实上并非一个组件，而是一个“生成组件类型”的函数，因此遵守 JavaScript 函数命名的规范，使用 camelCase 命名。

### [强制] 使用 `onXxx` 形式作为 `props` 中用于回调的属性名称。

解释：

使用统一的命名规则用以区分 `props` 中回调和非回调部分的属性，在 JSX上 可以清晰地看到一个组件向上和向下的逻辑交互。

对于不用于回调的函数类型的属性，使用动宾结构作为属性名称。

```js
// onClick 作为回调以 on 开头，renderText 非回调函数则使用动词
let Label = ({onClick, renderText}) => <span onClick={onClick}>{renderText()}</span>;
```

### [建议] 使用 `withXxx` 或 `xxxable` 形式的词作为高阶组件的名称。

解释：

高阶组件是为组件添加行为和功能的函数，因此使用如上形式的词有助于对其功能进行理解。

### [建议] 作为组件方法的事件处理函数以具备业务含义的词作为名称，不使用 `onXxx` 形式命名。

解释：

```js
// GOOD
class Form {
    @autobind
    collectAndSubmitData() {
        let data = {
            name: this.state.name,
            age: this.state.age
        };
        this.props.onSubmit(data);
    }

    @autobind
    syncName() {
        // ...
    }

    @autobind
    syncAge() {
        // ...
    }

    render() {
        return (
            <div>
                <label>
                    姓名：
                    <input
                        type="text"
                        onChange={this.syncName}
                    />
                </label>
                <label>
                    年龄：
                    <input
                        type="number"
                        onChange={this.syncAge}
                    />
                </label>
                <button
                    type="button"
                    onClick={this.collectAndSubmit}
                >
                    提交
                </button>
            </div>
        );
    }
}
```
