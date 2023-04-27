#/bin/bash

cd $(dirname $0)
baseDir=`pwd`


cd $baseDir/script && node sonar-mew-rules.js

cd $baseDir/extensions

pluginJar=$(ls sonar-javascript-plugin-*)

if [ -z "$pluginJar" ]; then
    echo '没有 jar 文件，请下载 jar 插件到 extensions 目录，参考 extensions/README.md !'
    exit 1
fi

jar -uvf $pluginJar org/sonar/l10n/javascript/rules/eslint/flowtype.json

echo "pack $pluginJar done"

