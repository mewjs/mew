
### 预编译

#### [建议] 使用 `babel` 做为预编译工具时，建议使用 `6+` 版本。

#### [建议] 使用 `TypeScript` 做为预编译工具时，建议使用 `1.6+` 版本。

解释：

`TypeScript` 1.6 之后，基本摒弃了之前的与 ESNext 相冲突的地方。目前 `TypeScript` 的思路就是遵循标准，将 stage 已经足够成熟的功能纳入，并提供静态类型和类型检查，所以其在 stage 0/1 的支持上不如 `babel`。另外，`TypeScript` 不能指定关闭某个 transform，但其编译速度比 `babel` 更高。

`TypeScript` 的常用参数在下面给出了示例。

示例：

```shell
--module amd --target ES3
--module commonjs --target ES6
```

#### [建议] 使用 `TypeScript` 做为预编译工具时，不使用 `tsc` 命令。

解释：

`TypeScript` 提供的 `tsc` 命令只支持后缀名 `.ts`、`.tsx`、`.d.ts` 的文件编译，对于 JavaScript 来说，保持后缀名为 `.js` 是原则，本文档的 `文件` 章节也有所要求。

- 如果要使用 `TypeScript` 做为预编译工具，可基于其 [Compiler API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API) 开发自己的预编译工具。
- FIS 用户，可以使用 [FIS TypeScript 插件](https://github.com/fex-team/fis3-parser-typescript)。
- Webpack 用户，可以使用 [ts-loader](https://github.com/TypeStrong/ts-loader) 或 [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader)。

#### [建议] 浏览器端项目中如果 ESNext 代码和 ES3/5 代码混合，不要使用 `TypeScript` 做为预编译工具。

解释：

`TypeScript` 产生的 module 代码使用 exports.default 导出默认的 export，但是没有直接为 module.exports 赋值，导致在另外一个普通文件中使用 require('moduleName') 是拿不到东西的。

需要使用 `TypeScript` 的话，建议整个项目所有文件都是 ESNext module 的，采用混合的 module 容易出现不可预期的结果。

#### [建议] AMD/CommonJS 模块依赖 ESNext 模块时，AMD/CommonJS 模块对 default export 的 require 需要改造。

解释：

ESNext 模块经过编译后，named export 会挂载在 exports 对象上，default export 也会挂载在 exports 对象上名称为 default 的属性。同时 exports 对象会包含一个值为 true 的 __esModule 属性。那么问题来了，当 AMD/CommonJS 模块依赖了 ESNext 模块时，require 期望拿到的是 exports.default，但你实际上拿到的是 exports。

所以，老的 AMD/CommonJS 模块依赖了 default export 的 ESNext 模块时，对 default export 的 require 需要改造成 `require('name').default`。

另外，如果是 ESNext 模块之间的互相依赖，transpiler 会通过加入中间对象和引入 interop 方法，所以不会产生这个问题。
