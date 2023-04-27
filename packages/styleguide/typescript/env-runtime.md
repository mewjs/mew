### 运行环境

#### [建议] 根据项目兼容要求，选择合适的目标产物。

解释：

主要涉及到 tsconfig.json 的配置，根据项目的兼容性要求，设置 `target`（比如内部项目 `es6`，C 端项目 `es5`） 和 `downlevelIteration`。

```json5
{
    "compilerOptions": {
        "target": "es6",
        "downlevelIteration": true
    }
}
```
