/* eslint-disable @typescript-eslint/no-magic-numbers, no-await-in-loop */
import * as path from 'path';
import type {
    Diagnostic,
    InitializeParams,
    InitializeResult,
    WorkspaceEdit
} from 'vscode-languageserver/node';
import {
    createConnection,
    TextDocuments,
    DiagnosticSeverity,
    ProposedFeatures,
    DidChangeConfigurationNotification,
    Position,
    CodeActionKind,
    CodeActionRequest,
    ExecuteCommandRequest,
    CodeAction,
    Command,
    WorkspaceChange,
    Range
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { TextDocumentSyncKind } from 'vscode-languageserver-protocol';

import { URI } from 'vscode-uri';

import type { LintError, Suggestion } from './LintProvider';
import Provider, { Linter, ProviderStatus } from './LintProvider';
import { MewCommandIds, IS_DEBUG, NoticeTip } from './const';
import { defaultServerSettings, isSettingsEqual } from './settings';
import { getCommentTag } from './util';
import logger from './lib/logger';
import isSpecialFileIgnored from './lib/isIgnored';


// Create a connection for the server. The connection uses Node's IPC as a transport.
const connection = createConnection(ProposedFeatures.all);
logger.bindTo(connection.console);

// 保存当前文档的上一次lint结果缓存
const documentLintResultMap: Map<string, LintError[]> = new Map();
// 保存每个 workspace 的 mew 实例
const workspaceProviderMap: Map<string, Provider> = new Map();

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;

interface CodeActionParams {
    uri: string;
    diagnosticId?: string;
    rule?: string | number;
    suggestion?: Suggestion;
    suggestionId?: number;
}

async function getDocProvider(docUri: string): Promise<Provider> {
    const { fsPath: docPath } = URI.parse(docUri);
    const docFolder = path.dirname(docPath);
    let provider: Provider = null;

    // 直接找到
    if (workspaceProviderMap.has(docFolder)) {
        provider = workspaceProviderMap.get(docFolder);
    }
    else {
        for (const [workspaceRoot, cachedProvider] of workspaceProviderMap) {
            // 找到 workspace 目录下的 mew
            if (Provider.isInWorkspace(docFolder, workspaceRoot)) {
                provider = cachedProvider;
                break;
            }
        }
    }

    // 不在 workspace 中的文件，需要单独初始化
    if (!provider) {
        provider = new Provider(docFolder, true);
        workspaceProviderMap.set(docFolder, provider);
    }

    // 未初始化 mew instance
    if (provider.status === ProviderStatus.Prepare) {
        let settings = null;
        try {
            settings = await connection.workspace.getConfiguration({
                scopeUri: provider.workspaceFolder,
                section: 'mew.server'
            });
        }
        catch (e) {
            settings = defaultServerSettings;
            logger.error(NoticeTip.MEW_SETTING_ERROR);
        }

        await provider.initInstance(settings);
    }
    // 初始化中的 provider，需要等待初始化完成
    else if (provider.status === ProviderStatus.Loading) {
        logger.log('loading mew, please wait...');
        // TODO: 这里需要引入指令队列，才能处理加载中的请求，这一期先不做，作为一个优化点
    }

    return provider;
}

/**
 * 获取诊断标记ID，用来缓存诊断的问题，以便于修复
 *
 * @param diagnostic 诊断对象
 */
function getDiagnosticId(diagnostic: Diagnostic): string {
    return `${ diagnostic.source }(${ diagnostic.code })`
        + `@${ diagnostic.range.start.line }:${ diagnostic.range.start.character }`
        + `-${ diagnostic.range.end.line }:${ diagnostic.range.end.character }`;
}

function makeDiagnostic(error: LintError, textDocument: TextDocument, provider: Provider): Diagnostic {
    const startPos = Position.create(error.line - 1, error.column - 1);
    const endPos = Position.create(error.endLine - 1, error.endColumn - 1);

    const diagnostic: Diagnostic = {
        severity: error.severity === 2 ? DiagnosticSeverity.Error : DiagnosticSeverity.Warning,
        range: { start: startPos, end: endPos },
        message: error.message,
        source: `mew:${ error.linter }`,
        code: error.rule,
    };

    // 语法问题无解
    if (!/syntax/i.test(error.rule)) {
        diagnostic.codeDescription = { href: provider.getRuleDocUrl(error.rule, error.linter) };
        error.diagnosticId = getDiagnosticId(diagnostic);
    }

    return diagnostic;
}

async function validateTextDocument(textDocument: TextDocument, provider: Provider = null): Promise<void> {
    const { uri } = textDocument;
    if (!provider) {
        // eslint-disable-next-line require-atomic-updates
        provider = await getDocProvider(uri);
    }

    documentLintResultMap.delete(uri);
    const text = textDocument.getText();

    let lintStartTime: [number, number] = null;
    if (IS_DEBUG) {
        lintStartTime = process.hrtime();
    }
    const errors = await provider.lint(uri, text, textDocument.languageId);
    if (IS_DEBUG) {
        const [s, ns] = process.hrtime(lintStartTime);
        logger.log(`Lint Time: ${ uri }(${ (s * 1000 + ns / 1000000).toFixed(2) }ms)`);
    }

    if (!errors) {
        connection.sendDiagnostics({ uri, diagnostics: [] });
        return;
    }


    const diagnostics = errors
        .map(error => makeDiagnostic(error, textDocument, provider));
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    // 可修复的errors会附带诊断id
    const fixableErrors = errors.filter(error => error.diagnosticId);
    if (fixableErrors.length) {
        documentLintResultMap.set(uri, fixableErrors);
    }
}

/**
 * 处理文档改变导致的 mew lint
 *
 * @param textDocument 文档
 * @param eventName 文档事件
 */
async function doValidateTextDocument(textDocument: TextDocument, eventName: 'onType' | 'onSave'): Promise<void> {
    const { uri } = textDocument;
    if (isSpecialFileIgnored(uri)) {
        return;
    }
    const provider = await getDocProvider(uri);

    if (provider.settings.run === eventName) {
        await validateTextDocument(textDocument, provider);
    }
    if (eventName === 'onSave' && provider.settings.autoFixOnSave) {
        logger.log('autoFixOnSave is on, will fix lint error...');
        await execApplyFixAll(textDocument);
    }
}

async function validateWorkspaceTextDocument(
    workspaceRoot: string,
    documentList: TextDocument[]
) {
    for (const textDocument of documentList) {
        const { fsPath: docPath } = URI.parse(textDocument.uri);
        const docFolder = path.dirname(docPath);
        if (Provider.isInWorkspace(docFolder, workspaceRoot)) {
            await validateTextDocument(textDocument);
        }
    }
}

function createCodeAction(title: string, kind: string, commandId: string, arg: any): CodeAction {
    const command = Command.create(title, commandId, arg);
    const action = CodeAction.create(
        title,
        command,
        kind
    );
    return action;
}

function getDocOneLintErrorByDiagnosticId(uri: string, diagnosticId: string): LintError {
    const fixableErrors = documentLintResultMap.get(uri);
    if (!fixableErrors) {
        return null;
    }
    return fixableErrors.find(error => error.diagnosticId === diagnosticId);
}

function getDocAllLintErrors(uri: string): LintError[] {
    return documentLintResultMap.get(uri);
}

async function execApplyFixAll(params: { uri: string }): Promise<void> {
    const { uri } = params;
    const textDocument = documents.get(uri);
    const provider = await getDocProvider(uri);
    let fixStartTime: [number, number] = null;
    if (IS_DEBUG) {
        fixStartTime = process.hrtime();
    }
    const formattedText = await provider.fix(uri, textDocument.getText(), textDocument.languageId);
    if (IS_DEBUG) {
        const [s, ns] = process.hrtime(fixStartTime);
        logger.log(`Fix Time: ${ uri }(${ (s * 1000 + ns / 1000000).toFixed(2) }ms)`);
    }

    if (formattedText != null) {
        const workspaceChange = new WorkspaceChange();
        const textChange = workspaceChange.getTextEditChange({ uri, version: textDocument.version });
        textChange.replace({
            start: textDocument.positionAt(0),
            end: textDocument.positionAt(Number.MAX_SAFE_INTEGER)
        }, formattedText);

        await connection.workspace.applyEdit(workspaceChange.edit)
            .then(response => {
                if (!response.applied) {
                    logger.error(`Failed to apply command: ${ MewCommandIds.applyFixAll }`);
                }
                return true;
            }, () => {
                logger.error(`Failed to apply command: ${ MewCommandIds.applyFixAll }`);
            });
    }
}

connection.onInitialize((params: InitializeParams) => {
    const { capabilities } = params;
    hasConfigurationCapability = !!(
        capabilities.workspace && !!capabilities.workspace.configuration
    );
    hasWorkspaceFolderCapability = !!(
        capabilities.workspace && !!capabilities.workspace.workspaceFolders
    );

    const initializeResult: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
            // textDocumentSync: documents.syncKind,
            codeActionProvider: { codeActionKinds: [CodeActionKind.QuickFix] },
            executeCommandProvider: {
                commands: [
                    'mew.applySingleFix',
                    'mew.applyCurrentRuleFix',
                    'mew.applyFixAll',
                    'mew.disableSingleRule',
                    'mew.disableSingleLine',
                    'mew.disableEntireFile',
                    'mew.openRuleDoc'
                ]
            }
        }
    };

    const folders = params.workspaceFolders;
    if (folders) {
        for (const folder of folders) {
            // 由于初始化中时 配置信息拿不到，这里只初始化provider信息
            const { fsPath: workspaceRoot } = URI.parse(folder.uri);
            workspaceProviderMap.set(workspaceRoot, new Provider(workspaceRoot));
        }
    }
    return initializeResult;
});

connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(DidChangeConfigurationNotification.type, void 0);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(({ added, removed }) => {
            IS_DEBUG && logger.log('Workspace folder change event received.');
            if (added) {
                for (const folder of added) {
                    const { fsPath: workspaceRoot } = URI.parse(folder.uri);
                    workspaceProviderMap.set(workspaceRoot, new Provider(workspaceRoot));
                }
            }
            if (removed) {
                for (const folder of removed) {
                    const { fsPath: workspaceRoot } = URI.parse(folder.uri);
                    workspaceProviderMap.delete(workspaceRoot);
                }
            }
        });
    }
});

connection.onDidChangeConfiguration(async () => {
    IS_DEBUG && logger.log('Setting changes');
    const documentList = documents.all();

    for (const [workspaceRoot, provider] of workspaceProviderMap) {
        const settings = await connection.workspace.getConfiguration({
            scopeUri: workspaceRoot,
            section: 'mew.server'
        });

        if (!isSettingsEqual(settings, provider.settings)) {
            provider.settings = {
                ...defaultServerSettings,
                ...settings
            };
            await validateWorkspaceTextDocument(workspaceRoot, documentList);
        }
    }
});


documents.onDidClose(e => {
    const { fsPath: filePath } = URI.parse(e.document.uri);
    const docFolder = path.dirname(filePath);
    documentLintResultMap.delete(e.document.uri);
    const provider = workspaceProviderMap.get(docFolder);
    // 单独打开的文件，需要移出provider
    if (provider?.isFileLinter) {
        workspaceProviderMap.delete(docFolder);
    }
});

documents.onDidChangeContent(e => {
    doValidateTextDocument(e.document, 'onType');
});


documents.onDidSave(e => {
    doValidateTextDocument(e.document, 'onSave');
});

const LINTER_CONFIG_PATTER = /\.?(eslint|htmlint|stylelint|markdownlint)(?:rc)?(?:\.js|\.json|\.ya?ml)$/;
connection.onDidChangeWatchedFiles(async ({ changes }) => {
    const revalidate = async (uri: string, initFilterName = '') => {
        // 只需要 revalidate 当前workspace下的文件
        const { fsPath: docPath } = URI.parse(uri);
        const workspaceRoot = path.dirname(docPath);
        const provider = await getDocProvider(uri);

        if (provider) {
            if (initFilterName) {
                provider.initFileFilter(initFilterName);
            }

            provider.clearConfigs();
        }

        await validateWorkspaceTextDocument(workspaceRoot, documents.all());
    };
    for (const { uri } of changes) {
        const match = uri.match(LINTER_CONFIG_PATTER);

        if (match) {
            logger.log(`${ match[1] } config changed: ${ uri }`);
            await revalidate(uri);
        }
        else {
            const match = uri.match(/(\.(?:mew|eslint|stylelint)ignore)$/);
            if (match) {
                logger.log(`ignore config changed: ${ uri }`);
                await revalidate(uri, match[0]);
            }
        }
    }
});

const complexDocument = new Set(['markdown', 'html', 'swan', 'wxml', 'axml', 'vue']);
const complexDocumentLinter = new Set(['markdownlint', 'htmlint']);

// lint 相关提示请求, 出是否可以 fix 菜单
/* eslint-disable-next-line max-lines-per-function */
connection.onRequest(CodeActionRequest.type, params => {
    const { uri } = params.textDocument;
    const { languageId } = documents.get(uri);
    const codeActions: CodeAction[] = [];
    const { diagnostics } = params.context;

    const fixableErrors = getDocAllLintErrors(uri);

    if (!fixableErrors) {
        return codeActions;
    }

    // 有非语法错误的可修复问题，出菜单
    if (fixableErrors.some(error => !/syntax/i.test(error.rule))) {
        codeActions.push(
            createCodeAction(
                'Mew: Fix all auto-fixable problems.',
                `${ CodeActionKind.QuickFix }.mew`,
                MewCommandIds.applyFixAll,
                {
                    uri
                }
            )
        );
    }

    for (const diagnostic of diagnostics) {
        if (!diagnostic) {
            continue;
        }

        const diagnosticId = getDiagnosticId(diagnostic);
        const actionParams: CodeActionParams = {
            uri,
            diagnosticId
        };

        const error = fixableErrors
            ? fixableErrors.find(error => error.diagnosticId === diagnosticId)
            : null;

        if (error) {
            // 可以直接修复的
            if (diagnosticId && error.suggestions) {
                error.suggestions.forEach(suggestion => {
                    codeActions.push(
                        createCodeAction(
                            `Mew: Fix this ${ error.rule } problem.`,
                            `${ CodeActionKind.QuickFix }.mew`,
                            MewCommandIds.applySingleFix,
                            {
                                ...actionParams,
                                suggestion
                            }
                        )
                    );

                    codeActions.push(
                        createCodeAction(
                            `Mew: Fix all ${ error.rule } problems.`,
                            `${ CodeActionKind.QuickFix }.mew`,
                            MewCommandIds.applyCurrentRuleFix,
                            {
                                ...actionParams,
                                suggestion
                            }
                        )
                    );
                });
            }
            // CSS 可以使用 mew fix进行修复
            else if (uri.match(/\.(?:css|less|sass|scss|stylus)$/i)) {
                codeActions.push(
                    createCodeAction(
                        `Mew: Fix this ${ diagnostic.code } problem.`,
                        `${ CodeActionKind.QuickFix }.mew`,
                        MewCommandIds.applySingleFix,
                        actionParams
                    )
                );
            }

            codeActions.push(
                createCodeAction(
                    `Mew: Disable ${ diagnostic.code } for this line.`,
                    `${ CodeActionKind.QuickFix }.mew`,
                    MewCommandIds.disableSingleLine,
                    actionParams
                )
            );

            codeActions.push(
                createCodeAction(
                    `Mew: Disable ${ diagnostic.code } for the after lines.`,
                    `${ CodeActionKind.QuickFix }.mew`,
                    MewCommandIds.disableSingleRule,
                    actionParams
                )
            );

            //  TODO: 复合语言的文件由于无法判断当前规则语言起始行，无法直接在首行屏蔽规则
            if (!complexDocument.has(languageId) || complexDocumentLinter.has(error.linter)) {
                codeActions.push(
                    createCodeAction(
                        `Mew: Disable ${ diagnostic.code } for the entire file.`,
                        `${ CodeActionKind.QuickFix }.mew`,
                        MewCommandIds.disableEntireFile,
                        actionParams
                    )
                );
            }

            // show document
            if (typeof diagnostic.code === 'string' && diagnostic.code !== 'syntax') {
                codeActions.push(
                    createCodeAction(
                        `Mew: Show documentation for ${ diagnostic.code }.`,
                        `${ CodeActionKind.QuickFix }.mew`,
                        MewCommandIds.openRuleDoc,
                        actionParams
                    )
                );
            }
        }
    }

    return codeActions;
});

// 执行 format 相关命令
connection.onRequest(MewCommandIds.applyFixAll, execApplyFixAll);

// 执行 lint 相关命令
/* eslint-disable complexity, max-lines-per-function, max-lines */
connection.onRequest(ExecuteCommandRequest.type, params => {
    const commandId = params.command;
    const commandParams = params.arguments?.[0] as CodeActionParams;
    const { uri } = commandParams;
    const textDocument = documents.get(uri);

    // apply workspace edit
    const applyEdit = (edit: WorkspaceEdit) => {
        connection.workspace.applyEdit(edit)
            .then(response => {
                if (!response.applied) {
                    logger.error(`Failed to apply command: ${ commandId }`);
                }
                return true;
            }, () => {
                logger.error(`Failed to apply command: ${ commandId }`);
            });
    };

    if (commandId === MewCommandIds.applySingleFix) {
        const { suggestion: { fix }, diagnosticId } = commandParams;
        const [fixRangeStart, fixRangeEnd] = fix.range;
        const workspaceChange = new WorkspaceChange();
        const textChange = workspaceChange.getTextEditChange(uri);
        const error = getDocOneLintErrorByDiagnosticId(uri, diagnosticId);


        if (error.linter === Linter.Markdownlint) {
            if (fixRangeEnd === -1) {
                textChange.delete(Range.create(
                    Position.create(error.line - 1, 0),
                    Position.create(error.endLine, 0)
                ));
            }
            else {
                textChange.add({
                    range: {
                        start: Position.create(error.line - 1, Math.max(fixRangeStart - 1, 0)),
                        end: Position.create(
                            error.endLine - 1,
                            Math.max(
                                error.line < error.endLine
                                    ? fixRangeEnd - 1
                                    : fixRangeStart + fixRangeEnd - 1,
                                1
                            )
                        )
                    },
                    newText: fix.text
                });
            }
        }
        else {
            textChange.add({
                range: {
                    start: textDocument.positionAt(fixRangeStart),
                    end: textDocument.positionAt(fixRangeEnd)
                },
                newText: fix.text
            });
        }

        applyEdit(workspaceChange.edit);
    }
    else if (commandId === MewCommandIds.applyCurrentRuleFix) {
        const [, , rule] = commandParams.diagnosticId.match(/^mew:(\w+)\(([^)]+)\)/);
        const errors = getDocAllLintErrors(uri).filter(error => error.rule === rule);
        const workspaceChange = new WorkspaceChange();
        const textChange = workspaceChange.getTextEditChange(uri);

        for (const error of errors) {
            const { fix } = error.suggestions[commandParams.suggestionId || 0];
            const [fixRangeStart, fixRangeEnd] = fix.range;

            if (error.linter === Linter.Markdownlint) {
                if (fixRangeEnd === -1) {
                    textChange.delete(Range.create(
                        Position.create(error.line - 1, 0),
                        Position.create(error.endLine, 0)
                    ));
                }
                else {
                    textChange.add({
                        range: {
                            start: Position.create(error.line - 1, Math.max(fixRangeStart - 1, 0)),
                            end: Position.create(
                                error.endLine - 1,
                                Math.max(
                                    error.line < error.endLine
                                        ? fixRangeEnd - 1
                                        : fixRangeStart + fixRangeEnd - 1,
                                    1
                                )
                            )
                        },
                        newText: fix.text
                    });
                }
            }
            else {
                textChange.add({
                    range: {
                        start: textDocument.positionAt(fixRangeStart),
                        end: textDocument.positionAt(fixRangeEnd)
                    },
                    newText: fix.text
                });
            }

        }

        applyEdit(workspaceChange.edit);
    }
    // mew fix all
    else if (commandId === MewCommandIds.applyFixAll) {
        execApplyFixAll({ uri });
    }
    // disable single rule
    else if (commandId === MewCommandIds.disableSingleRule || commandId === MewCommandIds.disableSingleLine) {
        const error = getDocOneLintErrorByDiagnosticId(uri, commandParams.diagnosticId);
        const workspaceChange = new WorkspaceChange();
        const commentTag = getCommentTag(error, textDocument.languageId);
        const lineText = textDocument.getText(
            Range.create(
                Position.create(error.line - 1, 0),
                Position.create(error.line - 1, Number.MAX_VALUE)
            )
        );
        const preLineText = textDocument.getText(
            Range.create(
                Position.create(Math.max(0, error.line - 2), 0),
                Position.create(Math.max(0, error.line - 2), Number.MAX_VALUE)
            )
        );

        const commandSuffix = commandId === MewCommandIds.disableSingleLine ? '-next-line' : '';
        const directive = `${ error.linter }-disable${ commandSuffix }`;

        const [indentationText = ''] = /^([ \t]*)/.exec(lineText) || [];
        const directiveStart = `${ commentTag.open } ${ directive } `;
        const existsDirectiveIndex = preLineText.indexOf(directiveStart);

        const textChange = workspaceChange.getTextEditChange(uri);
        const [rule, detailRule] = error.rule.split('|');
        // 已有指令合并
        if (existsDirectiveIndex > -1) {
            const existsDirectiveEndIndex = preLineText.indexOf(
                commentTag.close,
                existsDirectiveIndex + directiveStart.length
            );

            textChange.insert(
                Position.create(error.line - 2, existsDirectiveIndex + directiveStart.length),
                // 区分是否已有其他规则名
                (detailRule || rule) + (existsDirectiveEndIndex > 0 ? ', ' : ' ')
            );
        }
        // 新增指令
        else {
            const disableDirective = `${ indentationText }${ commentTag.open } `
                + `${ directive } ${ (detailRule || rule) }`
                + ` ${ commentTag.close }\n`;

            textChange.add({
                range: {
                    start: Position.create(error.line - 1, 0),
                    end: Position.create(error.line - 1, 0)
                },
                newText: disableDirective
            });
        }

        applyEdit(workspaceChange.edit);
    }
    else if (commandId === MewCommandIds.disableEntireFile) {
        const error = getDocOneLintErrorByDiagnosticId(uri, commandParams.diagnosticId);
        const workspaceChange = new WorkspaceChange();
        const commentTag = getCommentTag(error, textDocument.languageId);
        let disableDirective = null;
        const firstLineText = textDocument.getText(
            Range.create(
                Position.create(0, 0),
                Position.create(0, Number.MAX_VALUE)
            )
        );

        const directive = `${ error.linter }-disable`;

        const [indentationText = ''] = /^([ \t]*)/.exec(firstLineText) || [];
        const directiveStart = `${ commentTag.open } ${ directive } `;
        const existsDirectiveIndex = firstLineText.indexOf(directiveStart);

        const textChange = workspaceChange.getTextEditChange(uri);
        const [rule, detailRule] = error.rule.split('|');
        // 已有指令合并
        if (existsDirectiveIndex > -1) {
            const existsDirectiveEndIndex = firstLineText.indexOf(
                commentTag.close,
                existsDirectiveIndex + directiveStart.length
            );

            textChange.insert(
                Position.create(0, existsDirectiveIndex + directiveStart.length),
                // 区分是否已有其他规则名
                (detailRule || rule) + (existsDirectiveEndIndex > 0 ? ', ' : ' ')
            );
        }
        // 新增指令
        else {
            disableDirective = `${ indentationText }${ commentTag.open } `
                + `${ directive } ${ (detailRule || rule) }`
                + ` ${ commentTag.close }\n`;

            textChange.add({
                range: {
                    start: Position.create(0, 0),
                    end: Position.create(0, 0)
                },
                newText: disableDirective
            });
        }

        applyEdit(workspaceChange.edit);
    }
    // mew open rule doc
    else if (commandId === MewCommandIds.openRuleDoc) {
        const [, linter, rule] = commandParams.diagnosticId.match(/^mew:(\w+)\(([^)]+)\)/);
        const error = getDocAllLintErrors(uri).find(error => error.rule === rule);
        if (error?.info) {
            connection.sendRequest(MewCommandIds.openRuleDoc, { url: error.info });
        }
        else {
            getDocProvider(uri).then(provider => {
                const url = provider.getRuleDocUrl(rule, linter);
                connection.sendRequest(MewCommandIds.openRuleDoc, { url });
            });
        }
    }
    else {
        logger.error(`Not support command: ${ commandId }`);
    }
});
/* eslint-enable complexity, max-lines-per-function, max-lines */

documents.listen(connection);
connection.listen();
