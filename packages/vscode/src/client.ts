import * as path from 'path';
import { homedir } from 'os';

import type {
    ExtensionContext,
    TextDocument,
    TextEdit,
    WorkspaceFolder,
    QuickPickItem
} from 'vscode';
import {
    workspace,
    commands,
    languages,
    Uri,
    window,
    extensions
} from 'vscode';
import {
    existsSync,
    readdirSync,
    readFileSync,
    writeFileSync,
    copySync,
    removeSync
} from 'fs-extra';

import type {
    LanguageClientOptions,
    ServerOptions,
    DocumentFilter
} from 'vscode-languageclient/node';
import {
    LanguageClient,
    TransportKind
} from 'vscode-languageclient/node';

import * as stripJsonComments from 'strip-json-comments';
import type { MewSettings } from './settings';
import { defaultSettings } from './settings';
import { MewCommandIds, DocUrl, IS_DEBUG } from './const';
import StatusBar from './StatusBar';
import TaskProvider from './TaskProvider';

import logger from './lib/logger';
import { getWorkspaceMewPath } from './getWorkspaceMewInstance';
import { md5 } from './util';

logger.bindTo(console);

let taskProvider: TaskProvider;
let client: LanguageClient;
let globalMewSettings: MewSettings;


function openUrl(url: string): void {
    commands.executeCommand('vscode.open', Uri.parse(url));
}

interface PickFolderItem extends QuickPickItem {
    folder: WorkspaceFolder;
}

async function pickFolder(folders: WorkspaceFolder[], placeHolder: string): Promise<WorkspaceFolder | undefined> {
    if (folders.length === 1) {
        return Promise.resolve(folders[0]);
    }

    const selected = await window.showQuickPick(
        folders.map<PickFolderItem>(folder => ({
            folder,
            label: folder.name,
            description: folder.uri.fsPath
        })),
        {
            placeHolder
        }
    );

    return selected?.folder;
}

async function getAppPath(): Promise<string> {
    const { platform } = process;
    let appPath = '';

    if (platform === 'darwin') {
        appPath = '/Applications/wechatwebdevtools.app';
    }

    if (platform === 'win32') {
        window.showInformationMessage('Not support windows!');
        return;
    }

    if (!existsSync(appPath)) {
        appPath = await window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: 'Enter the absolute install path of \'微信开发者工具\'：',
        });

        if (appPath && !existsSync(appPath)) {
            window.showErrorMessage(`Invalid path of '${ appPath }'!`);
            return;
        }
    }
    return appPath;
}

function getExtensionPath(appPath: string): string {

    let extPath = '';
    const { platform } = process;

    if (platform === 'darwin') {
        extPath = path.resolve(
            homedir(),
            'Library/Application Support/微信开发者工具',
            md5(`${ appPath }/Contents/MacOS`),
            'Default/Editor/User/extensions'
        );
    }

    if (!existsSync(extPath)) {
        window.showErrorMessage(
            'Can\'t find \'微信开发者工具\' extensions path, \'微信开发者工具\' version should >= 1.03.2004271'
        );
        return;
    }
    return extPath;
}

function updateWechatwebdevtoolsConfig(
    appPath: string,
    extensionPath: string,
    extensionId: string
): boolean {

    const configPath = path.resolve(extensionPath, '../_extensionmanage');
    const appCodePath = path.resolve(appPath, 'Contents/Resources/package.nw/core.wxvpkg');
    let config = null;

    try {
        if (existsSync(configPath)) {
            config = stripJsonComments(readFileSync(configPath, 'utf-8')).trim();
        }
        else {
            [config] = readFileSync(appCodePath, 'utf-8')
                .match(/(?<=DefaultExtensionsIds=)\[[^\]]*\]/);
        }
        config = (new Function(`return ${ config }`))();
    }
    catch (e) {
        logger.error('load wechatdevtool extension config error!\n', e);
        return false;
    }

    try {
        !config.includes(extensionId) && config.push(extensionId);
        writeFileSync(
            configPath,
            JSON.stringify(config, null, 2),
            { encoding: 'utf-8' }
        );
    }
    catch (e) {
        logger.error('update wechatdevtool extension config error!\n', e);
        return false;
    }

    return true;
}

/**
 * 注册格式化处理器
 *
 * @param settings mew 设置选项
 */
function registerCommands(settings: MewSettings): void {

    // open mew doc
    commands.registerCommand('mew.openDoc', () => {
        openUrl(DocUrl.home);
        return {};
    });

    commands.registerCommand('mew.init', () => {
        const folders = workspace.workspaceFolders.slice();
        pickFolder(folders, 'Select a workspace folder to generate Mew config:')
            .then(async folder => {
                if (!folder) {
                    return;
                }
                const folderRootPath = folder.uri.fsPath;
                let commandPath = 'mew';
                const mewPath = await getWorkspaceMewPath(folderRootPath, folderRootPath);
                if (mewPath) {
                    commandPath = path.resolve(path.dirname(mewPath), '../bin/mew');
                }
                const terminal = window.createTerminal({
                    name: 'Mew init',
                    cwd: folderRootPath
                });
                terminal.sendText(`${ commandPath } init`);
                terminal.show();
            });

        return {};
    });

    commands.registerCommand('mew.toWeChatWebDevTools', async () => {
        const appPath = await getAppPath();
        if (!appPath) {
            return;
        }
        const extensionPath = getExtensionPath(appPath);
        if (!extensionPath) {
            return;
        }
        const extensionId = 'vscode-mew.vscode-mew';
        const { extensionLocation, version } = extensions.getExtension(extensionId).packageJSON;
        try {
            const regExp = new RegExp(`^${ extensionId }-*`);
            readdirSync(extensionPath).forEach(fileName => {
                regExp.test(fileName) && removeSync(path.resolve(extensionPath, fileName));
            });
            copySync(
                IS_DEBUG
                    ? path.resolve(homedir(), `.vscode/extensions/${ extensionId }-${ version }`)
                    : extensionLocation?.fsPath,
                `${ extensionPath }/${ extensionId }-${ version }`,
                { overwrite: true }
            );
        }
        catch (e) {
            logger.error(e.message);
            return;
        }

        updateWechatwebdevtoolsConfig(appPath, extensionPath, extensionId)
            ? window.showInformationMessage('Export success, please reload \'微信开发者工具\'.')
            : window.showInformationMessage('Export fail, please install latest \'微信开发者工具\'.');

        return {};
    });

    // register format api
    if (settings.formatEnable) {
        const mewFormatProvider = {
            async provideDocumentFormattingEdits(document: TextDocument): Promise<TextEdit[]> {
                if (settings.formatEnable) {
                    await client.sendRequest(MewCommandIds.applyFixAll, {
                        uri: document.uri.toString()
                    });
                }
                return [];
            }
        };

        languages.registerDocumentFormattingEditProvider('html', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('javascript', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('typescript', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('css', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('less', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('stylus', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('scss', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('javascriptreact', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('typescriptreact', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('markdown', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('md', mewFormatProvider);
        // mini program
        languages.registerDocumentFormattingEditProvider('wxml', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('wxss', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('axml', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('swan', mewFormatProvider);
        languages.registerDocumentFormattingEditProvider('wxs', mewFormatProvider);
    }
}

/**
 * 注册linter处理器
 *
 * @param settings mew设置选项
 * @return 处理器数组
 */
function registerLinter(settings: MewSettings): DocumentFilter[] {
    if (!settings.enable) {
        return [];
    }

    const filters: DocumentFilter[] = [];
    if (settings.lintHtml) {
        filters.push({ scheme: 'file', language: 'html' });
    }

    if (settings.lintCss) {
        filters.push({ scheme: 'file', language: 'css' });
    }

    if (settings.lintLess) {
        filters.push({ scheme: 'file', language: 'less' });
    }

    if (settings.lintStylus) {
        filters.push({ scheme: 'file', language: 'stylus' });
    }

    if (settings.lintJavascript) {
        filters.push({ scheme: 'file', language: 'javascript' });
    }

    if (settings.lintTypescript) {
        filters.push({ scheme: 'file', language: 'typescript' });
    }

    if (settings.lintSass) {
        // filters.push({scheme: 'file', language: 'sass'});
        filters.push({ scheme: 'file', language: 'scss' });
    }

    if (settings.lintVue) {
        filters.push({ scheme: 'file', language: 'vue' });
    }
    if (settings.lintTsx) {
        filters.push({ scheme: 'file', language: 'typescriptreact' });
    }

    if (settings.lintJsx) {
        filters.push({ scheme: 'file', language: 'javascriptreact' });
    }

    if (settings.lintMD) {
        filters.push({ scheme: 'file', language: 'markdown' });
        filters.push({ scheme: 'file', language: 'md' });
    }

    if (settings.lintMiniProgram) {
        filters.push({ scheme: 'file', language: 'wxml' });
        filters.push({ scheme: 'file', language: 'axml' });
        filters.push({ scheme: 'file', language: 'swan' });
        filters.push({ scheme: 'file', language: 'wxs' });
        filters.push({ scheme: 'file', language: 'wxss' });
        filters.push({ scheme: 'file', language: 'json' });
    }

    return filters;
}

let statusBar: StatusBar;
function registerStatusBar(settings: MewSettings, context: ExtensionContext) {
    statusBar = new StatusBar(settings, context);
    context.subscriptions.push(
        ...statusBar.registerDisposables()
    );
}

function startServer(tips = 'Mew server restart finished') {
    client.start();
    const onReady = () => {
        logger.log(tips);
        statusBar.active();
        client.outputChannel.show();
    };
    client.onReady().then(onReady);
}

export function activate(context: ExtensionContext) {
    const serverModule = context.asAbsolutePath(path.join('dist', 'server.js'));
    globalMewSettings = { ...defaultSettings, ...workspace.getConfiguration().get('mew') };

    // format command register
    registerCommands(globalMewSettings);

    registerStatusBar(globalMewSettings, context);

    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: {
                execArgv: ['--nolazy', '--inspect=6688']
            }
        }
    };

    const clientOptions: LanguageClientOptions = {
        // Register the server for plain text documents
        documentSelector: registerLinter(globalMewSettings),
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: [
                workspace.createFileSystemWatcher('**/*eslin{t,trc}{.js,.yaml,.yml,.json}'),
                workspace.createFileSystemWatcher('**/*stylelin{t,trc}{.js,.yaml,.yml,.json}'),
                workspace.createFileSystemWatcher('**/*htmlin{t,trc}{.js,.yaml,.yml,.json}'),
                workspace.createFileSystemWatcher('**/*markdownlin{t,trc}{.js,.yaml,.yml,.json}'),
                workspace.createFileSystemWatcher('**/.eslintignore'),
                workspace.createFileSystemWatcher('**/.stylelintignore'),
                workspace.createFileSystemWatcher('**/.me{w,wrc}{.js,.yaml,.yml,.json}'),
                workspace.createFileSystemWatcher('**/.mewignore'),
                workspace.createFileSystemWatcher('**/package.json')
            ]
        }
    };

    // Create the language client and start the client.
    client = new LanguageClient(
        'languageServerMew',
        'Mew',
        serverOptions,
        clientOptions
    );


    client.start();
    client.onReady().then(() => {
        statusBar.active();

        // register openRuleDoc
        client.onRequest(MewCommandIds.openRuleDoc, (params: { url: string }) => {
            openUrl(params.url);
            return {};
        });

        // restart server
        commands.registerCommand('mew.restart', () => {
            logger.log('Start to restart mew server...');
            client.stop().then(() => startServer());
        });

        // stop server
        commands.registerCommand('mew.toggleServer', () => {
            if (client.needsStop()) {
                logger.log('Start to stop mew server...');
                client.stop().then(() => {
                    logger.log('Mew server has been stopped');
                    statusBar.deactivate();
                    client.outputChannel.hide();
                });
            }
            else {
                logger.log('Starting mew server...');
                startServer('Mew server has been started');
            }
        });

        // show output channel
        commands.registerCommand('mew.openOutputChannel', () => {
            if (client?.needsStart()) {
                logger.log('Mew server is starting...');
                startServer('Mew server has been started');
            }
            else {
                client.outputChannel.show();
            }
        });

        // register format by mew
        commands.registerCommand('mew.fix', () => {
            const { activeTextEditor } = window;
            if (activeTextEditor) {
                client.sendRequest(MewCommandIds.applyFixAll, {
                    uri: activeTextEditor.document.uri.toString()
                });
            }
        });
    });

    // 配置变更需要重启服务
    context.subscriptions.push(workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('mew')) {
            globalMewSettings = { ...globalMewSettings, ...workspace.getConfiguration().get('mew') };
            client.clientOptions.documentSelector = registerLinter(globalMewSettings);
            client.stop().then(() => {
                client.start();
            });
        }
    }));

    taskProvider = new TaskProvider();
    taskProvider.start();
}

export function deactivate(): Thenable<void> | null {
    if (!client) {
        return null;
    }
    if (taskProvider) {
        taskProvider.dispose();
    }
    return client.stop();
}
