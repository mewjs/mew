# VSCode Mew Plugin

Vscode 的 Mew 插件，支持mew相关的代码检查、格式化、配置初始化、任务设置等。

## Install

### Install from Marketplace

[Mew - Code Linter and Formatter](https://marketplace.visualstudio.com/items?itemName=Mew.vscode-mew)

### Install from VSIX

安装步骤：

- 在[当前代码目录](https://github.com/mewjs/mew/tree/main/packages/vscode/) 执行 `npm run package` 得到打包产物 `vscode-mew-x.y.z.vsix`
- `command + shift + x` 进入插件列表
- 选择下拉列表 `Install from VSIX`（从 VSIX 安装） 进行安装

## Install Mew

插件依赖 `Mew`，但默认不提供 `Mew` 安装，需要在项目根目录或者全局安装 `Mew` 最新版：

```sh
npm install @mewjs/cli
```

重新打开 `VSCode`。

**注意：**

如果安装插件之后没有启动代码检查，则从以下几个方面查找原因：

- Mew 是否已经安装
- 打开控制台输出，选择 `Mew` 输出，看有没有报错出现
- 项目根目录有没有 `eslintrc.(js|yaml|json)` 或者 `mewrc.(js|yaml|json)` 配置文件，

根据项目类型可以使用 `mew init` 进行初始化。

## Capability

Lint

- HTML
- Markdown
- JavaScript/TypeScript
- CSS
- Stylus
- Less
- Sass/Scss
- Vue
- SWAN/WXML/WXSS/AXML
- JSX/TSX

Format

- HTML
- Markdown
- JavaScript/TypeScript
- CSS
- Stylus
- Less
- Sass/Scss
- JSX/TSX

## Develop

使用 Typescript + Webpack 进行插件开发，在 VSCode 中可以很方便进行调试：

- Run `npm install`
- Press `F5` to start debug server

打包发布：

> npm run pack
