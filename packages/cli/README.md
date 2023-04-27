# Mew

`Mew` 是一款功能强大的代码风格检查工具，能够检查并修复主流前端相关代码风格问题。

`Mew` 支持语言包括:

- JavaScript 检查 & 修复
- JSX 检查 & 修复
- TS 检查 & 修复
- TypeScript 检查 & 修复
- TSX 检查 & 修复
- Vue 检查
- CSS 检查 & 修复
- Less 检查 & 修复
- Sass 检查 & 修复
- Stylus 检查 & 修复
- HTML 检查 & 修复
- Markdown 检查 & 修复
- MiniProgram 小程序代码 检查 & 修复

## 安装

Node.js 版本(12+)。

```sh
npm i @mewjs/cli
```

或者全局安装：

```sh
npm i @mewjs/cli -g
```

## 使用

检查：

> mew ./src

检查并显示规则：

> mew ./src --rule

修复：

> mew fix ./src

修复并替换文件：

> mew fix ./src --replace

更多命令行参数参考：[CLI](./doc/CLI.md)

如果 `Mew` 不是全局安装，而是安装在当前项目中，可以在前面加上 npx：

> npx mew ./src

## 配置

`Mew` 使用 eslint 检查 js 相关代码，使用 stylelint 检查 css 相关代码，使用 @mewjs/htmlint 检查 html 代码，使用
 markdownlint 检查 markdown 代码，可以分别对 eslint、stylelint、@mewjs/htmlint 和 markdown 进行配置。

使用命令行提示进行配置文件初始化：

> mew init

也可以分别进行手动配置。

### ESLint 相关配置

支持以 `.eslintrc.(yml|js|json)` 形式配置 js(js,jsx,ts,tsx)检 查规则，例如 `Vue` 项目配置如下：

.eslintrc.js

```javascript
module.exports = {
    extends: ['plugin:@mewjs/vue']
};
```

**注意：** Vue, React, TS 相关项目必须在项目根目录配置 `eslintrc` 文件，需要根据项目类型选择合适的插件。

详细配置参考 @mewjs/eslint-plugin：

- [Vue](https://github.com/mewjs/mew/tree/main/packages/eslint-plugin#vue)
- [React](https://github.com/mewjs/mew/tree/main/packages/eslint-plugin#react)
- [Typescript](https://github.com/mewjs/mew/tree/main/packages/eslint-plugin#typescript)

### Stylelint 相关配置

支持以 `.stylelint.(yml|js|json)` 形式配置 css(css,less,sass,stylus) 检查规则，例如 `css` 项目配置如下：

.stylelintrc.js

```javascript
module.exports = {
    rules: {
        'mew/color-no-invalid-hex': false
    }
};
```

**注意：** `Mew` 包含了默认的 stylelint 规则，没有特殊需求不需要另行配置。

### .mewignore

mew 支持忽略不检查的代码。在项目根目录配置 `.mewignore` 文件，文件内容为
要忽略的文件或者目录，一行一个忽略规则，支持 glob 表达式。

例如默认忽略的代码规则：

.mewignore

```text
node_modules/
*.min.js
bower_components/
```

## API

使用 `Mew` API 完成代码片段的检查和修复：

### 检查代码片段

```javascript
import fs from 'fs';
import mew from '@mewjs/cli';

const text = fs.readFileSync('test.js', 'utf-8');
mew.lintText(text, 'test.js', 'js')
    .then(data => console.log(data));
// {success: true, results: []}
```

### 修复代码片段

```javascript
import fs from 'fs';
import mew from '@mewjs/cli';

const text = fs.readFileSync('test.js', 'utf-8');
mew.fixText(text, 'test.js', 'js')
    .then(fixedText => console.log(fixedText));
// 修复后文本
```

## 在现有项目中集成 `Mew`

### 1. 已有的 webpack 项目

- 增加 mew 和 mew-loader 的依赖安装
- 在 webpack 配置中增加 mew-loader 的配置
- 在项目根目录增加 eslint 的配置文件

### 2. 已有非 webpack 项目

- 增加 `Mew` 的依赖安装
- 在 package.json 增加 npm scripts 的配置：

```json
{
    "lint": "mew src --rule",
    "prestart": "npm run lint",
    "prebuild": "npm run lint",
    "start": "...",
    "build": "..."
}
```

### 3. 需要提交前统一格式化的项目

使用 `mew init` 命令初始化配置，可选安装 git commit hooks，也可以手动设置钩子。

- 增加 mew、husky 和 lint-staged 的依赖安装
- 在 `package.json` 中增加 husky 和 lint-staged 的配置：

```json
{
  "husky": {
    "hooks": {
        "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
      "**/*.{html,html,less,styl,sass,scss,js,jsx,ts,tsx,vue}": [
          "mew --rule"
      ]
  }
}
```

## 小程序代码检查

使用 Mew 可以检查原生小程序代码，`mew init` 时选择项目使用的框架为 `MiniProgram`, 以及项目运行环境为 `MiniProgram`，

生成的 `.eslintrc.js` 如下：

```javascript
module.exports = {
    extends: ['plugin:@mewjs/miniprogram'],
    env: {
        commonjs: true
    }
};
```

也可以配合 `vscode-mew` 在微信开发者工具中进行代码检查，使用`ctrl + shift + p` 打开 vscode 命令面板，

输入 `Mew: Export Mew To WeChatWebDevTools`，即可在微信开发者工具中启用 `vscode-mew` 插件。

## 相关工具和插件

- vscode插件：[vscode-mew](https://github.com/mewjs/mew/tree/main/packages/vscode)
- eslint插件：[@mewjs/eslint-plugin](https://github.com/mewjs/mew/tree/main/packages/eslint-plugin)
- stylelint插件：[@mewjs/stylelint](https://github.com/mewjs/mew/tree/main/packages/stylelint)
- 小程序代码检查插件：[eslint-plugin-mini](https://github.com/mewjs/mew/tree/main/packages/eslint-plugin-mini)
- 小程序 wxml, wxs, axml, swan 解析器：[mpxml-eslint-parser](https://github.com/mewjs/mew/tree/main/packages/mpxml-eslint-parser)

## 相关文档

- [CLI](./doc/CLI.md)
- [rules](./doc/rules.md)
