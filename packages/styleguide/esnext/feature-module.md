### 模块

#### [强制] `export` 与内容定义放在一起。

解释：

何处声明要导出的东西，就在何处使用 `export` 关键字，不在声明后再统一导出。

示例：

```js
// GOOD
export function foo() {
}

export const bar = 3;


// BAD
function foo() {
}

const bar = 3;

export {foo};
export {bar};
```

#### [建议] 相互之间无关联的内容使用命名导出。

解释：

举个例子，工具对象中的各个方法，相互之间并没有强关联，通常外部会选择几个使用，则应该使用命名导出。

简而言之，当一个模块只扮演命名空间的作用时，使用命名导出。

#### [强制] 所有 `import` 语句写在模块开始处。

示例：

```js
// GOOD
import {bar} from './bar';

function foo() {
    bar.work();
}

// BAD
function foo() {
    import {bar} from './bar';
    bar.work();
}
```
