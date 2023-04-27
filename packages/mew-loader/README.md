# @mewjs/loader

mew loader (for webpack) —— webpack 中的 mew 检查工具

## Usage

安装 `@mewjs/loader` 与 `@mewjs/cli`

```sh
yarn add -D @mewjs/loader @mewjs/cli
```

如果 less/css/js/ts/vue 文件都 check，可直接在原有 webpack.config.js 配置中的 module.rules 的基础上加多一项

```json
{
    test: /\.(less|css|js|ts|vue)$/,
    use: ['@mewjs/loader']
}
```

或者只针对某一类文件 check，可在原有的 loader 配置中添加 @mewjs/loader，如：

```json
{
    test: /\.js$/,
    use: ['@mewjs/loader']
},
{
    test: /\.css$/,
    use: [
        'style-loader',
        'css-loader',
        '@mewjs/loader'
    ]
},
{
    test: /\.less$/,
    use: [
        'style-loader',
        'css-loader',
        'less-loader',
        '@mewjs/loader'
    ]
}
```

因为 webpack 的 loader 调用的顺序是从后往前的，所以为了 @mewjs/loader 能 check 最原始的代码，请将 @mewjs/loader 放置在数组的最后

## Options

可以直接将参数加在loader后，形如 `@mewjs/loader?key=value`，也可以将参数写在 loader 的 options 中形如：

```json
{
    test: /\.js$/,
    use: [
        {
            loader: '@mewjs/loader',
            options: {
                failOnError: true,
                exclude: './index.js'
            }
        }
    ]
}
```

### `failOnError`(default: true)

是否在 mew 检测到模块内容有 error 时使模块编译失败，若 failOnError 为 true，则在遇到 error 错误时会导致编译失败。

### `failOnWarning`(default: false)

是否在mew检测到模块内容有warning时使模块编译失败，若failOnWarning 为 true，则在遇到 warning 错误时会导致编译失败。

### `exclude`（default: ''）

指定要忽略的 `glob` 文件模式，如 `./index.js,./src/config/*.js`，文件模式若有多条，模式之间使用逗号 `,` 分隔

### Example

#### webpack.config.js

```js
module.exports = {
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(less|css|jsx?|tsx?|vue)$/,
                use: [
                    {
                        loader: '@mewjs/loader',
                        options: {
                            failOnError: true,
                            failOnWarning: true,
                            exclude: './index.js,./index2.js'
                        }
                    }
                ]
            }
        ]
    }
};
```

#### vue.config.js - vue (webpack)

```js
module.exports = {
    chainWebpack(config) {
        const eslint = config.module.rule('eslint');
        eslint.uses.clear();

        const loaderName = '@mewjs/loader';

        eslint
            .pre()
            .test(/\.(?:m?jsx?|tsx?|css|less|sass|scss|styl|md|vue)+$/)
            .use(loaderName)
            .loader(loaderName)
            .options({
                failOnError: true,
                failOnWarning: false,
                silent: true
            });
    },
};
```

#### vite.config.js - vue (vite)

使用 [`@mewjs/vite-plugin`](https://github.com/mewjs/mew/tree/main/packages/vite-plugin)

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import mew from '@mewjs/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [mew({ throwOnError: true }), vue()],
});
```

**注意：** 使用 `@mewjs/loader` 替换原有的 `eslint`，需要移除 `devDependencies` 中 `eslint` 相关的包再重新安装，否则会
导致某些公共包被提升，`@mewjs/eslint-plugin` 中的某些 `peerDependencies` 无法找到。
