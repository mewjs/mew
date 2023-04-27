/* eslint-disable no-underscore-dangle */

import * as path from 'path';
import { URI } from 'vscode-uri';
import type mew from '@mewjs/cli';
import * as Mew from '@mewjs/cli/lib/types';

import { getRuleMessage } from './lang';
import type { MewServerSettings } from './settings';
import getWorkspaceMewInstance from './getWorkspaceMewInstance';
import { NoticeTip, DocUrl } from './const';
import logger from './lib/logger';

/**
 * linter 类型
 */
export enum Linter {

    /**
     * unknown
     */
    Unknown = 'unknown',

    /**
     * htmlint
     */
    Htmlint = 'htmlint',

    /**
     * eslint
     */
    Eslint = 'eslint',

    /**
     * stylelint
     */
    Stylelint = 'stylelint',

    /**
     * markdown
     */
    Markdownlint = 'markdownlint'
}

export interface LintError {
    line: number;
    column: number;
    endLine: number;
    endColumn: number;
    message: string;
    rule: string;
    severity: Mew.Severity;
    linter: Linter;
    diagnosticId?: string;
    info?: string;
    suggestions?: Mew.Suggestion[];
}

/* eslint-disable-next-line @typescript-eslint/no-type-alias */
export type Suggestion = Mew.Suggestion;

/**
 * mew 引擎初始化状态
 */
export enum ProviderStatus {

    /**
     * 准备中，未初始化
     */
    Prepare = 1,

    /**
     * 正在初始化中
     */
    Loading = 2,

    /**
     * 已初始化
     */
    Initialized = 3,

    /**
     * 初始化错误
     */
    InitError = 4
}


function getTypeOfExt(extName: string): string {
    switch (extName) {
        case 'styl':
            return 'stylus';
        case 'htm':
        case 'html':
            return 'html';
        case 'jsx':
            return 'js';
        case 'tsx':
            return 'ts';
        case 'md':
        case 'markdown':
            return 'markdown';
    }

    return extName || 'js';
}

function getTypeOfLanguageId(languageId: string): string {
    switch (languageId) {
        case 'javascript':
        case 'javascriptreact':
            return 'js';
        case 'typescript':
        case 'typescriptreact':
            return 'ts';
        case 'markdown':
            return 'md';
        case 'json':
            return 'json';
    }

    return languageId || 'js';
}


function getFileName(fileUri: string): string {
    const { fsPath } = URI.parse(fileUri);
    return fsPath;
}

function normalize(mewLintError: Mew.LintError, settings: MewServerSettings): LintError {
    const { docLocale } = settings;
    // fix severity
    let severity = 0;
    if (typeof mewLintError.severity === 'string') {
        if (mewLintError.severity === 'error') {
            severity = 2;
        }
        else if (mewLintError.severity === 'warning') {
            severity = 1;
        }
    }
    else {
        severity = mewLintError.severity as number;
    }

    // 修复 endLine 问题
    let endLine = mewLintError.endLine ?? mewLintError.line;
    let endColumn = mewLintError.endColumn ?? mewLintError.column;
    if (mewLintError.origin) {
        const { origin } = mewLintError;
        if (null != origin.endLine) {
            endLine = Math.max(endLine, 1);
        }
        if (null != origin.endColumn) {
            endColumn = Math.max(endColumn, origin.endColumn);
        }
    }

    if (mewLintError.linter === Linter.Markdownlint) {
        endColumn = mewLintError.column + mewLintError.endColumn;
    }


    const suggestions: Mew.Suggestion[] = mewLintError.suggestions ?? [];
    if (mewLintError.origin?.fix) {
        suggestions.push({
            desc: `Mew: Fix this ${ mewLintError.rule } problem.`,
            fix: mewLintError.origin.fix
        });
    }

    if (mewLintError.origin?.suggestions) {
        const mewSuggestions = mewLintError.origin.suggestions.map(s => {
            s.desc = `Mew: ${ s.desc }`;
            return s;
        });

        suggestions.push(...mewSuggestions);
    }

    // 初始化LintError类型
    const error: LintError = {
        line: mewLintError.line,
        column: mewLintError.column,
        endLine,
        endColumn,
        message: docLocale === 'zh-cn'
            ? getRuleMessage(mewLintError.linter, mewLintError.rule, 'zh-cn') || mewLintError.message
            : mewLintError.message,
        rule: mewLintError.rule,
        info: mewLintError.origin?.ruleInformation ?? '',
        severity,
        linter: mewLintError.linter ? (mewLintError.linter as Linter) : Linter.Unknown,
        suggestions: suggestions?.length ? suggestions : null
    };

    return error;
}

export default class Provider {

    /**
     *  mew 实例
     */
    private mewInstance: typeof mew;

    /**
     *  mew 文件过滤器
     */
    private _fileFilter: Mew.FileFilter;

    /**
     * 记录当前 linter 配置
     */
    private _settings: MewServerSettings;

    /**
     * 当前加载状态
     */
    private _status: ProviderStatus;

    /**
     * linter provider
     *
     * @param workspaceFolder 记录工作区目录
     * @param isFileLinter 记录是否是针对单独文件的linter
     */
    constructor(public workspaceFolder: string, public isFileLinter: boolean = false) {
        this._status = ProviderStatus.Prepare;
    }

    /**
     * 判断文件是否属于workspace
     * @param fileFolder 文件目录
     * @param workspaceFolder workspace目录
     */
    static isInWorkspace(fileFolder: string, workspaceFolder: string) {
        if (fileFolder === workspaceFolder) {
            return true;
        }

        const relativePath = path.relative(workspaceFolder, fileFolder);
        // 找到workspace目录下的 mew
        return !relativePath.startsWith('..');
    }

    /**
     * 判断文件是否属于workspace
     * @param fileFolder 文件目录
     * @param workspaceFolder workspace目录
     */
    isInWorkspace(fileFolder: string) {
        return Provider.isInWorkspace(this.workspaceFolder, fileFolder);
    }

    /**
     * 初始化mew实例
     */
    async initInstance(settings: MewServerSettings) {
        this._settings = settings;
        this._status = ProviderStatus.Loading;
        const mewInstance = await getWorkspaceMewInstance(this.workspaceFolder, settings.nodePath);
        // 未安装
        if (!mewInstance) {
            logger.error(NoticeTip.MEW_NOT_INSTALLED);
            this._status = ProviderStatus.InitError;
        }
        // 版本错误
        else if (!mewInstance.fixText || !mewInstance.lintText || !mewInstance.getOptions) {
            logger.error(NoticeTip.MEW_VERSION_ERROR);
            this._status = ProviderStatus.InitError;
        }
        else {
            this.mewInstance = mewInstance;
            this._status = ProviderStatus.Initialized;
            this.initFileFilter();
        }
    }

    /**
     * 获取当前Provider状态
     */
    get status(): ProviderStatus {
        return this._status;
    }

    /**
     * 设置文档目录
     * @param settings 文档目录
     */
    set settings(settings: MewServerSettings) {
        this._settings = settings;
    }

    /**
     * 获取文档目录
     */
    get settings(): MewServerSettings {
        return this._settings;
    }


    /**
     * 判断文件是否被 .mewignore 忽略
     * @param fileName 文件路径
     */
    isFileIgnored(fileName: string) {
        if (!this._fileFilter) {
            return false;
        }

        return this._fileFilter.isIgnored(fileName);
    }

    /**
     * 初始化文件过滤器
     */
    initFileFilter(ignoreFilename = '.mewignore') {
        this._fileFilter = new Mew.FileFilter(this.workspaceFolder, { ignoreFilename });
    }

    /**
     * 进行代码检查
     * @param fileUri 文件uri
     * @param content 文件内容
     * @param languageId 文件 language
     */
    async lint(fileUri: string, content: string, languageId?: string): Promise<LintError[]> {
        if (!this.mewInstance) {
            return Promise.resolve(null);
        }

        const fileName = getFileName(fileUri);
        if (this.isFileIgnored(fileName)) {
            logger.log(`mewignore: ${ fileName }`);
            return Promise.resolve(null);
        }

        const type = (languageId
            ? getTypeOfLanguageId(languageId)
            : getTypeOfExt(path.extname(fileName).slice(1))) as Mew.LintType;
        const settings = this._settings;
        const opts = { cwd: this.workspaceFolder, silent: true };

        return this.mewInstance
            .lintText(content, fileName, type, opts)
            .then(
                (result: Mew.LintTextResult) =>
                    (result.errors || []).map(error => normalize(error, settings))
            );
    }

    /**
     * 进行代码格式化
     * @param fileUri 文件uri
     * @param content 文件内容
     * @param languageId 文件 language
     */
    async fix(fileUri: string, content: string, languageId?: string): Promise<string> {
        if (!this.mewInstance) {
            return Promise.resolve(null);
        }
        const fileName = getFileName(fileUri);
        if (this.isFileIgnored(fileName)) {
            logger.log(`mewignore: ${ fileName }`);
            return Promise.resolve(null);
        }

        const type = (
            languageId
                ? getTypeOfLanguageId(languageId)
                : getTypeOfExt(path.extname(fileName).slice(1))
        ) as Mew.LintType;

        const opts = { cwd: this.workspaceFolder, silent: true };
        return this.mewInstance?.fixText(content, fileName, type, opts);
    }

    /**
     * 根据规则名称查找相关文档地址
     *
     * @param ruleId 规则名称
     * @param linter 检查器 htmlint|eslint|stylelint|markdownlint
     */
    getRuleDocUrl(ruleId: string, linter = 'eslint') {
        const { docLocale } = this._settings;
        const docUrlLocale = DocUrl[docLocale] || DocUrl.en;

        let docUrl = null;
        let rule = linter === 'markdownlint' ? ruleId.split('|')[0] : ruleId;
        // 根据 local 和 linter 查找规则对应的 docUrl
        if (docUrlLocale.rules[linter]) {
            const urls = docUrlLocale.rules[linter];
            docUrl = urls.default;
            for (const prefix of Object.keys(urls)) {
                if (ruleId.startsWith(prefix) && prefix !== 'default') {
                    docUrl = urls[prefix];
                    // 带前缀的需要去掉前缀
                    rule = ruleId.replace(prefix, '');
                    break;
                }
            }
        }

        if (!docUrl) {
            docUrl = docUrlLocale.home;
        }

        return docUrl.replace('{rule}', rule.toLowerCase());
    }

    /**
     * 清除已缓存的配置
     */
    clearConfigs() {
        this.mewInstance?.resetConfig();
    }
}
