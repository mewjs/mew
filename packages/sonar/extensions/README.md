
通过更新成新的 SonarQube 检查规则，以便于在生成 mew 规则的时候
不生成已有的这些规则，减少 mew 规则文件大小。

下载 SonarQube 插件：


https://github.com/SonarSource/SonarJS/releases/tag/6.2.2.13315


> wget https://github.com/SonarSource/SonarJS/releases/download/6.2.2.13315/sonar-javascript-plugin-6.2.2.13315.jar

更新 rules 文件:

> sh update-rules.sh

eslint 相关规则在这个目录：`org/sonar/l10n/javascript/rules/eslint/`

stylelint 相关规则在这个目录：`org/sonar/l10n/javascript/rules/eslint/`
