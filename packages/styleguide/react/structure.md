## 文件组织

### [强制] 同一目录下不得拥有**同名**的 `.js` 和 `.jsx` 文件。

解释：

在 import 模块时，倾向于不添加后缀，如果存在同名但不同后缀的文件，构建工具将无法决定哪一个是需要引入的模块。

### [强制] 组件文件使用一致的 `.js` 或 `.jsx` 后缀。

解释：

所有组件文件的后缀名从 `.js` 或 `.jsx` 中任选其一。不应在项目中出现部分组件为 `.js` 文件，部分为 `.jsx` 的情况。

### [强制] 每个文件以 `export default` 的形式暴露一个组件。

解释：

允许一个文件中存在多个不同的组件，但仅允许通过 `export default` 暴露一个组件，其它组件均定义为内部组件。

### [强制] 每个存放组件的目录使用一个 `index.js` 以命名导出的形式暴露所有组件。

解释：

同目录内的组件相互引用使用 `import Foo from './Foo';` 进行。

引用其它目录的组件使用 `import { Foo } from '../component';` 进行。

建议使用类似 [VSCode 的 export-index 插件](https://marketplace.visualstudio.com/items?itemName=BrunoLM.export-index) 的插件自动生成 `index.js` 的内容：

```js
// index.js
export * as Foo from './Foo';
export * as Bar from './Bar';
```
