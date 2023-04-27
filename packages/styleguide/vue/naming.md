## 命名规则

### [强制] 组件类、构造函数及变量名必须为 PascalCase，`name` 必须为 kebab-case，但均以 kebab-case 方式使用。

解释：

PascalCase 的情况是与 JavaScript 规范保持一致，kebab-case 的情况是与 HTML 规范保持一致。

可以简单记忆为：在字符串和模板中用 kebab-case，其他情况则用 PascalCase。

示例：

```js
// todo-item.vue

// 1.
app.component('todo-item', {
    // ...
});

// 2.
export default {
    name: 'todo-item',
    // ...
};

// 3.
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TodoItem extends Vue {
    // ...
}

// 4.
const TodoItem = (props, context) => {
    // ...
}

```

### [强制] 组件名称与文件名称保持相同的 KebabCase。

解释：

同时组件名称应当能体现出组件的功能，以便通过观察文件名即确定使用哪一个组件。

### [强制] 组件属性定义时命名时使用 camelCase，在模板中使用时使用 kebab-case。

示例：

```html
<template>
    <my-component foo-bar="foobar"></my-component>
</template>
```

```js
export default {
    name: 'foo-bar',
    props: {
        fooBar: {
            type: String,
            require: true
        }
        // ...
    },
    // ...
};
```

### [强制] 使用 `onXxx` 形式作为 `props` 中用于回调的属性名称。

解释：

使用统一的命名规则用以区分 `props` 中回调和非回调部分的属性，可以清晰地看到一个组件向上和向下的逻辑交互。

对于不用于回调的函数类型的属性，使用动词或动宾结构作为属性名称。

```html
<button @click="onClick"></button>
```

### [建议] 作为组件方法的事件处理函数以具备业务含义的词作为名称，不使用 `onXxx` 形式命名。

解释：

```html
<form @submit.prevent="collectAndSubmit">
    <label>
        姓名：
        <input
            type="text"
            name="name"
            @change="syncName"
        >
    </label>
    <label>
        年龄：
        <input
            type="number"
            name="age"
            @change="syncAge"
        >
    </label>
    <button type="submit">提交</button>
</form>
```
