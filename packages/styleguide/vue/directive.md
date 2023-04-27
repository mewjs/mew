## 指令

### [强制] 同一项目内统一使用 `:` 表示 `v-bind:` ，用 `@` 表示 `v-on:` ，用 `#` 表示 `v-slot:`。

示例：

```html
<!-- BAD -->
<input
    v-bind:value="value"
    v-on:input="handleInput"
>

<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<!-- GOOD -->
<input
    :value="value"
    @input="handleInput"
>

<template #header>
  <h1>Here might be a page title</h1>
</template>
```

### [强制] 对于需要使用 `key` 的场合，提供一个唯一标识作为 `key` 属性的值，禁止使用可能会变化的属性（如索引）。

解释：

`key` 属性是 Vue 在进行列表更新时的重要属性，如该属性会发生变化，渲染的性能和**正确性**都无法得到保证。

```html
<!-- BAD -->
<li v-for="item in list">
<li
    v-for="(item, index) in list"
    :key="index"
>

<!-- GOOD -->
<li
    v-for="item in list"
    :key="item.id"
>
```

### [强制] 禁止把 `v-if` 和 `v-for` 同时用在同一个元素上。

示例：

```html
<!-- BAD -->
<ul>
    <li
        v-for="user in users"
        v-if="user.isActive"
        :key="user.id"
    >
        {{ user.name }}
    </li>
</ul>

<!-- GOOD -->
<ul v-if="shouldShowUsers">
    <li
        v-for="user in users"
        :key="user.id"
    >
        {{ user.name }}
    </li>
</ul>
```
