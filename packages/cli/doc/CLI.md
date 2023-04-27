Mew 命令行参数
==========

> mew --help

查看命令行帮助

> mew --version

查看 `Mew` 当前版本

## mew lint

> mew lint [fileOrDirectory...] [options]

### 选项

| 名称 | 别名 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- | ---- |
| config | c | string | -- | 指定配置文件（暂未支持）|
| lookup | l | boolean | true | 是否查找自定义配置 |
| stream | -- | boolean | false | 是否检查文件流 |
| color | -- | boolean | true | 输出颜色高亮的信息 |
| time | -- | boolean | true | 输出运行耗时统计 |
| type | -- | string | js,css,html | 要处理的文件类型，多种类型间以半角逗号分隔 |
| project | p | string | -- | 以项目方式处理相关文件（仅当检查 TypeScript 文件时使用） |
| lines | -- | string | -- | 按代码行过滤错误（通常用于 git diff 部分检查）例如：1,2,3 |
| level | -- | string | -- | 按错误级别过滤，例如：warning,error |
| rules | -- | string | -- | 按检查规则名过滤，例如：color-named |
| maxerr | -- | number | 0 | 最多显示的错误数，默认不限制 |
| reporter | r | string | -- | 报告实现名（default|sonar） |
| sort | -- | boolean | false | 是否按行列升序显示错误 |
| no-ignore | -- | boolean | false | 是否禁用 mewignore 规则 |
| ignore-pattern | -- | string | -- | 自定义 glob 风格的忽略规则 |
| help | h | boolean | false | 显示帮助信息 |

## mew fix

> mew fix [fileOrDirectory...] [options]

### 选项

| 名称 | 别名 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- | ---- |
| config | c | string | -- | 指定配置文件（暂未支持）|
| lookup | l | boolean | true | 是否查找自定义配置 |
| stream | -- | boolean | false | 是否检查文件流 |
| color | -- | boolean | true | 输出颜色高亮的信息 |
| time | -- | boolean | true | 输出运行耗时统计 |
| type | -- | string | js,css,html | 要处理的文件类型，多种类型间以半角逗号分隔 |
| project | p | string | -- | 以项目方式处理相关文件（仅当检查 TypeScript 文件时使用） |
| output | -- | string | ./output | 指定格式化后的输出目录 |
| replace | -- | boolean | false | 指定格式化后是否替换原文件 |
| no-ignore | -- | boolean | false | 是否禁用 mewignore 规则 |
| ignore-pattern | -- | string | -- | 自定义 glob 风格的忽略规则 |
| help | h | boolean | false | 显示帮助信息 |

## mew init

> mew init [options]

### 选项

| 名称 | 别名 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- | ---- |
| moduleType | -- | string | esm | 模块类型 import/export(esm)、require/exports(commonjs)、none |
| framework | -- | string | react | 项目框架 react、vue、none |
| typescript | -- | boolean | false | 是否使用 typescript  |
| env | -- | string | -- | 项目运行环境 browser,node |
| format | -- | string | js | 配置文件格式 js、yaml、json  |