import deepEqual from './lib/deepEqual';

const miniProgramLanguageIds = new Set(['wxml', 'axml', 'swan', 'wxs', 'wxss', 'json']);

export interface MewServerSettings {
    nodePath: string;
    autoFixOnSave: boolean;
    run: 'onType' | 'onSave';
    openRuleDoc: boolean;
    docLocale: 'en' | 'zh-cn';
}

/**
 * mew setting interface
 */
export interface MewSettings {
    enable: boolean;
    lintHtml: boolean;
    lintJavascript: boolean;
    lintCss: boolean;
    lintStylus: boolean;
    lintLess: boolean;
    lintTypescript: boolean;
    lintSass: boolean;
    lintVue: boolean;
    lintJsx: boolean;
    lintTsx: boolean;
    lintMD: boolean;
    lintMiniProgram: boolean;
    formatEnable: boolean;
}

/**
 * default mew setting
 */
export const defaultSettings: MewSettings = {
    enable: true,
    lintHtml: true,
    lintJavascript: true,
    lintCss: true,
    lintStylus: true,
    lintLess: true,
    lintTypescript: true,
    lintSass: true,
    lintVue: true,
    lintJsx: true,
    lintTsx: true,
    lintMD: true,
    lintMiniProgram: true,
    formatEnable: true
};

/**
 * default mew setting
 */
export const defaultServerSettings: MewServerSettings = {
    nodePath: null,
    autoFixOnSave: false,
    run: 'onType',
    openRuleDoc: true,
    docLocale: 'en'
};

export function isSettingsEqual(a: any, b: any) {
    return deepEqual(a, b);
}


export function isLanguageLintEnable(languageId: string, settings: MewSettings): boolean {
    const languageIdUpperCase = languageId.replace(/^[a-z]/, $0 => $0.toUpperCase());
    if (settings[`lint${ languageIdUpperCase }`]) {
        return true;
    }

    if (settings.lintJsx && languageId === 'javascriptreact') {
        return true;
    }

    if (settings.lintTsx && languageId === 'typescriptreact') {
        return true;
    }

    if (settings.lintMD && (languageId === 'markdown' || languageId === 'md')) {
        return true;
    }

    if (settings.lintMiniProgram && miniProgramLanguageIds.has(languageId)) {
        return true;
    }

    return false;
}

