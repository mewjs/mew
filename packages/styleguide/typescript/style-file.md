
### 文件

#### [强制] TypeScript 文件使用 `.ts` 作为扩展名，JSX 组件使用 `.tsx`，仅当需要全局应用类型定义时使用 `.d.ts`。

解释：

1. 当项目中需要共享某些全局类型而不对外暴露时，可在 `global.d.ts` 中定义。
2. 当非严格意义上的全局类型（比如 2 个文件中共享的类型）并且项目外不可见时，使用 `<name>.d.ts`。
3. 多文件共享并且需要对外暴露的类型，应单独定义在 `types.ts` 中。
4. 为第三方模块定义或扩展类型时，可以在 `<package>.d.ts` 中通过 `declare module '<package>'` 实现。

其他情况下会自动生成对应的 `<name>.d.ts` 文件。

注意：`<name>`、`<package>` 分别为对应的文件名和包名点位符。

#### [建议] 源码目录为 `src`，`Node.js` 项目构建目录为 `lib`，`Web` 项目构建目录为 `dist`，补充声明的类型目录为 `types`。

解释：

一个典型的 `Node.js` 项目的构建目录结构如下：

```sh
├── lib/
├── src/
├── test/
├── types/
├── jest.config.js
├── package.json
└── tsconfig.json
```

注意：需要在 package.json 中指定 `main` 到 `lib` 目录。

一个典型的 `Web` 项目的构建目录结构如下：

```sh
├── dist/
├── src/
├── test/
├── types/
├── jest.config.js
├── package.json
└── tsconfig.json
```

### [强制] 为第三方库定义或修改类型时，统一使用 `types/<package>.d.ts` 的文件路径定义。

```ts
// types/references/react-redux.d.ts
// 最好加一句这段话，不然导出可能会被覆盖掉，只有 DefaultRootState 存在
import { type FooState } from './foo';

export * from 'react-redux';

// 扩展第三方库
declare module 'react-redux' {
    // 原来的 DefaultRootState 的定义类型为 {}，我们把它变成索引类型
    export interface DefaultRootState {
        foo: FooState;
        [key: string]: any;
   }
}
```

### [建议] 类型定义文件 `.d.ts` 头部不要出现 `import` 或 `export` 语句。

解释：

出现 `import` 或 `export` 语句会被当成模块，导致类型定义文件无法正常使用（比如不能默认全局生效）。

1. 当需要依赖其他模块的类型定义时，可以在对应模块中使用 `declare global` 来声明。

2. 当需要修改第三方模块的类型定义时，可以使用 `declare module '<package>'` 来声明，此时文件变成模块，需要有 `export` 语句。

注意：在 `global.d.ts` 中不需要再使用 `declare global` 来声明全局类型，使用之后文件会被当模块处理，此时要求必须有 `export` 语句，通常增加 `export {}` 可解决，但不推荐。

#### [强制] 模块文件中的类型定义必须在顶部统一定义。

示例：

```ts
// GOOD
import type Foo from './foo';

interface FooBar {
    foo: Foo;
    bar: string;
}

export const getFooBar = (foo: Foo, bar: string) => ({ foo, bar });

export default function fooBar(fooBar: FooBar): Foo {
    return fooBar.foo;
}
```

```ts
// BAD
import type Foo from './foo';

export const getFooBar = (foo: Foo, bar: string) => ({ foo, bar });

interface FooBar {
    foo: Foo;
    bar: string;
}

export default function fooBar(fooBar: FooBar): Foo {
    return fooBar.foo;
}
```
