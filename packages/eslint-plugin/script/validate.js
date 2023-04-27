const chalk = require('chalk');

const { configs } = require('..');


const PLUGIN_PREFIX = 'eslint-plugin';
const ESLINT_RULES_DIR = 'eslint/lib/rules/';
const MessageType = {
    REMOVE: 'Remove',
    DEPRECATED: 'Deprecated'
};
const BACK_CHAR = '\x1B[1A\x1B[2K';

// 'no-magic-numbers' -> ['eslint', 'no-magic-numbers']
// 'import/no-unresolved' -> ['eslint-plugin-import', 'no-unresolved']
// 'node/prefer-promises/dns' -> ['eslint-plugin-node', 'prefer-promises/dns']
// '@babel/new-cap' -> ['@babel-eslint-plugin', 'new-cap']
// '@mewjs/mini/camelcase' -> ['@mewjs/eslint-plugin-mini', 'camelcase']
const resolvePluginName = namePath => {
    let [name, rule, ...subRule] = namePath.split('/');
    const hasScope = name.startsWith('@');
    const hasSubRule = subRule.length > 0;

    name = rule
        ? (
            hasScope
                ? `${ name }/${ PLUGIN_PREFIX }${ hasSubRule ? `-${ rule }` : '' }`
                : `${ PLUGIN_PREFIX }-${ name }`
        )
        : '';

    rule = hasScope && hasSubRule
        ? subRule.join('/')
        : (
            hasSubRule
                ? [rule, ...subRule].join('/')
                : (rule || namePath)
        );

    return [name, rule];
};

const getPluginRule = namePath => {
    const [pluginName, ruleName] = resolvePluginName(namePath);
    if (pluginName) {
        // console.log(pluginName, ruleName);
        const { rules } = require(pluginName) || {};

        return rules && rules[ruleName];
    }

    return require(`${ ESLINT_RULES_DIR }/${ ruleName }`);
};

const validateRule = (ruleName, messages) => {
    let rule;

    try {
        rule = getPluginRule(ruleName);
    }
    catch (e) {
        console.log(e);
    }

    if (rule) {
        const {
            deprecated,
            replacedBy = []
        } = rule.meta || {};

        if (deprecated) {
            messages.push({
                type: MessageType.DEPRECATED,
                name: ruleName,
                replacedBy: replacedBy.length ? replacedBy : false
            });
        }
    }
    else {
        messages.push({ type: MessageType.REMOVE, name: ruleName });
    }
};

const validateConfig = ({ rules = {}, overrides = [] }, name, messages) => {

    const ruleNames = {
        ...rules,
        ...overrides.reduce((result, { rules = {} }) => ({ ...result, ...rules }), {})
    };

    Object.keys(ruleNames).forEach(ruleName => {
        validateRule(ruleName, messages);
    });
};

const printMessages = messages => {
    messages.forEach(({ type, name, replacedBy }) => {
        if (type === MessageType.REMOVE) {
            console.log(
                '\t[%s] Rule: %s',
                chalk.red.bold(type),
                chalk.bgRed.bold(name)
            );
        }
        else {
            console.log(
                '\t[%s] Rule: %s%s%s',
                chalk.yellow.bold(type),
                chalk.yellow.underline.bold(name),
                replacedBy ? ', ReplacedBy: ' : '',
                replacedBy ? replacedBy.map(rule => chalk.green.underline.bold(rule)).join(', ') : ''
            );
        }
    });
};


const validateConfigs = () => {
    let valid = true;
    const entries = Object.entries(configs);
    const total = entries.length;
    let current = 1;

    for (const [name, config] of entries) {
        const messages = [];
        console.log('[%s/%s] Checking: %s', current < 10 ? `0${ current }` : current, total, chalk.blue.bold(name));

        validateConfig(config, name, messages);

        valid = !messages.length && valid;

        console.log(
            '%s[%s/%s] %s: %s',
            BACK_CHAR,
            current < 10 ? `0${ current }` : current,
            total,
            chalk.blue.bold(name),
            messages.length ? chalk.red.bold('✘') : chalk.green.bold('✔')
        );

        if (messages.length) {
            printMessages(messages);
        }

        current++;
    }

    if (!valid) {
        process.exit(1);
    }
};

validateConfigs();
