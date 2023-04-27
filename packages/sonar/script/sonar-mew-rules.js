/* eslint-disable babel/quotes, max-lines, import/no-commonjs, no-undefined, max-len, import/no-dynamic-require */
/**
 * @file 生成 sonar eslint 规则描述 flowtype.json，替换 jar 包中的：org/sonar/l10n/javascript/rules/eslint/flowtype.json
 * 替换之后，mew 相关的规则能够得到正确显示
 * @author mengke(kekee000@gmail.com)
 */
const fs = require('fs');
const path = require('path');
const {eslintRulesDoc, stylelintRulesDoc, eslintRules, eslintRulesNames, stylelintRules} = require('./config');

const sonarEslintRulePath =  path.resolve(__dirname, '../extensions/org/sonar/l10n/javascript/rules/eslint');
const sonarStylelintRulePath =  path.resolve(__dirname, '../extensions/org/sonar/l10n/css/rules/stylelint');


function getSonarEslintRules() {
    const rulesMap = {};
    for (const plugin of ['core', 'import', 'jsx-a11y', 'promise', 'react', 'vue']) {
        const pluginJsonPath = path.resolve(sonarEslintRulePath, `${plugin}.json`);
        const rules = require(pluginJsonPath);
        for (const rule of rules) {
            rulesMap[rule.key] = rule;
        }
    }
    return rulesMap;
}

function getSonarStylelintRules() {
    const rulesMap = {};
    for (const plugin of ['rules']) {
        const pluginJsonPath = path.resolve(sonarStylelintRulePath, `${plugin}.json`);
        const rules = require(pluginJsonPath);
        for (const rule of rules) {
            rulesMap[rule.key] = rule;
        }
    }
    return rulesMap;
}

function getMewEslintRules() {
    const rulesMap = {};
    const rulePath = path.resolve(__dirname, '../mew-rules/eslint/');
    for (const plugin of ['mini']) {
        const pluginJsonPath = path.resolve(rulePath, `${plugin}.json`);
        const rules = require(pluginJsonPath);
        for (const rule of rules) {
            rulesMap[rule.key] = rule;
        }
    }
    return rulesMap;
}

function getMewStylelintRules() {
    const rulesMap = {};
    const rulePath = path.resolve(__dirname, '../mew-rules/stylelint/');
    for (const plugin of ['mew']) {
        const pluginJsonPath = path.resolve(rulePath, `${plugin}.json`);
        const rules = require(pluginJsonPath);
        for (const rule of rules) {
            rulesMap[rule.key] = rule;
        }
    }
    return rulesMap;
}

function getHtmlcsRules() {
    const rulesMap = {};
    const rulePath = path.resolve(__dirname, '../mew-rules/htmlint/');
    for (const plugin of ['core']) {
        const pluginJsonPath = path.resolve(rulePath, `${plugin}.json`);
        const rules = require(pluginJsonPath);
        for (const rule of rules) {
            rulesMap[rule.key] = rule;
        }
    }
    return rulesMap;
}

function escapeHTML(source) {
    let s = "";
    if (source.length === 0) {
        return "";
    }
    s = source.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    return s;
}

function main() {
    const results = [];
    // process eslint
    {
        const eslintRulesJson = {...getSonarEslintRules(), ...getMewEslintRules()};
        const ruleDocPrefixs = Object.keys(eslintRulesDoc).filter(i => i !== 'default');
        for (const ruleId of Object.keys(eslintRules)) {
            if (!eslintRules[ruleId]) {
                continue;
            }
            const item = {
                key: `mew:eslint(${ruleId})`,
                name: eslintRulesNames[ruleId],
                url: undefined
            };

            // 优先使用 sonar es 中的规则
            if (eslintRulesJson[ruleId]) {
                item.name = eslintRulesJson[ruleId].name;
                item.url = eslintRulesJson[ruleId].url;
            }

            if (!item.name) {
                console.warn('WARNING: no rule config:', item.key);
            }

            if (!item.url) {
                let docUrl = eslintRulesDoc.default;
                for (const prefix of ruleDocPrefixs) {
                    if (ruleId.startsWith(prefix)) {
                        docUrl = eslintRulesDoc[prefix];
                        break;
                    }
                }
                item.url = docUrl.replace('{rule}', ruleId);
            }

            if (item.name && item.url) {
                results.push(item);
                continue;
            }
        }
    }

    // process stylelint
    {
        const stylelintRulesJson = {...getSonarStylelintRules(), ...getMewStylelintRules()};
        const ruleDocPrefixs = Object.keys(stylelintRulesDoc).filter(i => i !== 'default');
        for (const ruleId of Object.keys(stylelintRules)) {
            if (!stylelintRules[ruleId]) {
                continue;
            }
            const item = {
                key: `mew:stylelint(${ruleId})`,
                name: void 0,
                url: void 0
            };

            // 优先使用 sonar es 中的规则
            if (stylelintRulesJson[ruleId]) {
                item.name = stylelintRulesJson[ruleId].name;
                item.url = stylelintRulesJson[ruleId].url;
            }

            if (!item.name) {
                console.warn('WARNING: no rule config:', item.key);
            }

            if (!item.url) {
                let docUrl = stylelintRulesDoc.default;
                for (const prefix of ruleDocPrefixs) {
                    if (ruleId.startsWith(prefix)) {
                        docUrl = stylelintRulesDoc[prefix];
                        break;
                    }
                }
                item.url = docUrl.replace('{rule}', ruleId);
            }

            if (item.name && item.url) {
                results.push(item);
                continue;
            }
        }
    }

    // process htmlint
    const htmlintRulesJson = getHtmlcsRules();
    for (const rule of Object.values(htmlintRulesJson)) {
        rule.name = escapeHTML(rule.name);
        rule.key = `mew:htmlint(${rule.key})`;
        results.push(rule);
    }

    results.forEach(item => {
        if (item.name.length >= 200) {
            console.warn('name too long', item.key);
        }
        item.description = `See Mew rule detail at <a href="${item.url}">${item.key}</a>.`;
        delete item.url;
    });

    fs.writeFileSync(path.join(sonarEslintRulePath, 'flowtype.json'), JSON.stringify(results, null, 2));

    console.log('done writing', path.join(sonarEslintRulePath, 'flowtype.json'));
}

main();
