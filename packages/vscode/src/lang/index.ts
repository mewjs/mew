/* eslint-disable import/no-commonjs */

const langConfig = {
    'zh-cn': {
        eslint: require('./zh-cn/eslint'),
        htmlint: require('./zh-cn/htmlint'),
        stylelint: require('./zh-cn/stylelint')
    }
};

export function getRuleMessage(linter: string, ruleName: string, lang = 'zh-cn') {
    return langConfig[lang]?.[linter]?.rules?.[ruleName];
}

export default langConfig;
