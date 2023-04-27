## 组件声明

### [强制] 单文件的组件文件的代码顺序必须为模板、脚本与样式。

解释：

模板代码让阅读者首先对 UI 界面结构和要操作的 HTML 有基本概念，然后通过脚本了解组件的行为，最后才是组件表现的样式。

示例：

```html
<template>
<!-- ... -->
</template>

<script>
// ...
</script>

<style>
/* ... */
</style>
```

### [强制] 禁止使用 `Vue.component` 直接定义全局组件。

### [强制] 必须为组件的所有 `props` 定义明确类型。

解释：

`propsTypes` 在提升组件健壮性的同时，也是一种类似组件的文档的存在，有助于代码的阅读和理解。

从优化角度考虑，也可以在 babel 构建时使用 `babel-plugin-transform-react-remove-prop-types` 插件自动移除相关的 `propTypes`。

### [强制] 对于所有非 `required` 的属性，务必通过 `default` 声明非 `undefined` 的默认值。

解释：

声明初始值有助于对组件初始状态的理解，对于初始没有值的属性，应当声明初始值为 `null` 而非 `undefined`，复杂的输入校验应该使用`validator` 实现。

### [强制] 依照规定顺序编排组件中的方法和属性。

解释：

按照以下顺序编排组件中的方法和属性：

1. `name`
2. `components`
3. `functional`
4. `directives`
5. `filters`
6. `data`
7. `watch`
8. `computed`
9. `model`
10. `props`
11. 生命周期
12. `methods`
13. `render`

其中生命周期的顺序：

1. `beforeCreate`
2. `created`
3. `beforeMount`
4. `mounted`
5. `beforeUpdate`
6. `updated`
7. `activated`
8. `deactivated`
9. `beforeDestroy`
10. `destroyed`

`methods` 中先写事件处理相关方法。
