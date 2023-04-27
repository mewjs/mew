/**
  * 是否调试环境
  */
export const IS_DEBUG = process.env.MEW_ENV === 'debug' || true;

/**
 * 支持的 mew 最低版本
 */
export const MIN_MEW_VERSION = '1.0.13';

/**
 * git repo
 */
const GIT_REPO_URL = 'https://github.com/mewjs/mew';

/**
 * 英文 url 定义
 */
const docUrlEn = {
    home: 'https://eslint.org/docs/rules/',
    rules: {
        eslint: {
            'default': 'https://eslint.org/docs/rules/{rule}',
            'import/': 'https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/{rule}.md',
            'node/': 'https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/{rule}.md',
            '@babel/': 'https://github.com/babel/eslint-plugin-babel#rules',
            'react/': 'https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/{rule}.md',
            'jsx-a11y/': 'https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/{rule}.md',
            'react-native/': 'https://github.com/Intellicode/eslint-plugin-react-native/blob/master/docs/rules/{rule}.md',
            'vue/': 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/{rule}.md',
            'mini/': `${ GIT_REPO_URL }/blob/main/packages/eslint-plugin-mini/docs/rules/{rule}.md`,
            'vuejs-accessibility': 'https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility/docs/{rule}.md',
            'eslint-comments': 'https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/{rule}.html',
            '@typescript-eslint/': 'https://typescript-eslint.io/rules/{rule}/'
        },
        htmlint: {
            default: `${ GIT_REPO_URL }/wiki/rule-{rule}`
        },
        stylelint: {
            'default': 'https://stylelint.io/user-guide/rules/{rule}',
            '@mewjs/': `${ GIT_REPO_URL }/blob/main/packages/stylelint/README.md#mew{rule}`
        },
        markdownlint: {
            default: 'https://github.com/DavidAnson/markdownlint/tree/main/doc/Rules.md#{rule}'
        }
    }
};

/**
 * 相关的Url常量
 */
export const DocUrl = {
    'home': `${ GIT_REPO_URL }/tree/main/packages/cli`,
    'en': docUrlEn,
    'zh-cn': {
        home: 'https://eslint.bootcss.com/docs/rules/',
        rules: {
            eslint: {
                ...docUrlEn.rules.eslint,
                default: 'https://eslint.bootcss.com/docs/rules/{rule}'
            },
            htmlint: docUrlEn.rules.htmlint,
            stylelint: {
                ...docUrlEn.rules.stylelint,
                default: 'http://stylelint.cn/user-guide/rules/{rule}'
            }
        }
    }
};

export const NoticeTip = {
    MEW_NOT_INSTALLED: `mew not installed, try \`npm install @mewjs/cli\`, \
version >= ${ MIN_MEW_VERSION }, then reload vscode.`,
    MEW_SETTING_ERROR: 'load mew settings error!',
    MEW_VERSION_ERROR: 'current `mew` version is too old, try `npm install @mewjs/cli@latest`.',
};

export const MewCommandIds = {

    /**
     * 修复单条问题
     */
    applySingleFix: 'mew.applySingleFix',

    /**
     * 修复特定规则问题
     */
    applyCurrentRuleFix: 'mew.applyCurrentRuleFix',

    /**
     * 修复所有问题，fix整个文档
     */
    applyFixAll: 'mew.applyFixAll',

    /**
     * 禁用单个规则
     */
    disableSingleRule: 'mew.disableSingleRule',

    /**
     * 禁用单行规则
     */
    disableSingleLine: 'mew.disableSingleLine',

    /**
     * 禁用规则扩大到当前文件
     */
    disableEntireFile: 'mew.disableEntireFile',

    /**
     * 打开规则定义文档
     */
    openRuleDoc: 'mew.openRuleDoc',
};
