#/bin/bash
cd $(dirname $0)
pluginJar=$(ls sonar-javascript-plugin-*)

if [ -z "$pluginJar" ]; then
    echo 'no plugin jar!'
    exit 1
fi

unzip $pluginJar -d jar

mkdir -p org/sonar/l10n/javascript/rules

cp -rf jar/org/sonar/l10n/javascript/rules/eslint org/sonar/l10n/javascript/rules

echo 'update done'