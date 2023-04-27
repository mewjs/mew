/* eslint-disable class-methods-use-this */
import * as vscode from 'vscode';
import logger from './lib/logger';
import findExecutable from './lib/findExecutable';

class FolderTaskProvider {

    private innerWorkspaceFolder: vscode.WorkspaceFolder = null;

    constructor(workspaceFolder: vscode.WorkspaceFolder) {
        this.innerWorkspaceFolder = workspaceFolder;
    }

    get workspaceFolder(): vscode.WorkspaceFolder {
        return this.innerWorkspaceFolder;
    }

    isEnabled(): boolean {
        const config = vscode.workspace.getConfiguration('mew', this.innerWorkspaceFolder.uri);
        return config.get<boolean>('lintTask.enable', false)
            || config.get<boolean>('fixTask.enable', false);
    }

    start(): void {
        // TODO;
    }

    dispose(): void {
        // TODO;
    }

    getTasks(): vscode.Task[] {
        const rootPath = this.innerWorkspaceFolder.uri.scheme === 'file'
            ? this.innerWorkspaceFolder.uri.fsPath
            : void 0;

        if (!rootPath) {
            return [];
        }

        const config = vscode.workspace.getConfiguration('mew', this.innerWorkspaceFolder.uri);
        const lintTaskEnable = config.get<boolean>('lintTask.enable', false);
        const fixTaskEnable = config.get<boolean>('fixTask.enable', false);
        const tasks: vscode.Task[] = [];

        try {
            const commandPath = findExecutable('mew', rootPath);
            const options: vscode.ShellExecutionOptions = { cwd: this.workspaceFolder.uri.fsPath };

            if (lintTaskEnable) {
                const lintTaskOptions = config.get('lintTask.options', ' . --rule');
                const lintTask = new vscode.Task(
                    {
                        type: 'mew'
                    },
                    this.workspaceFolder,
                    'Lint whole workspace',
                    'mew',
                    new vscode.ShellExecution(`${ commandPath } ${ lintTaskOptions }`, options),
                    '$mew-reporter'
                );
                tasks.push(lintTask);
            }

            if (fixTaskEnable) {
                const fixTaskOptions = config.get('fixTask.options', ' fix . --replace');
                const fixTask = new vscode.Task(
                    {
                        type: 'mew-fix'
                    },
                    this.workspaceFolder,
                    'Fix whole workspace files',
                    'mew',
                    new vscode.ShellExecution(`${ commandPath } ${ fixTaskOptions }`, options),
                    '$mew-reporter'
                );
                tasks.push(fixTask);
            }

        }
        catch (e) {
            logger.error(e.message);
        }

        return tasks;
    }
}

export default class TaskProvider {
    private taskProvider: vscode.Disposable | undefined;

    private providers: Map<string, FolderTaskProvider> = new Map();

    start(): void {
        const folders = vscode.workspace.workspaceFolders;
        if (folders) {
            this.updateWorkspaceFolders(folders, []);
        }
        vscode.workspace.onDidChangeWorkspaceFolders(event => this.updateWorkspaceFolders(event.added, event.removed));
        vscode.workspace.onDidChangeConfiguration(this.updateConfiguration, this);
    }

    dispose(): void {
        if (this.taskProvider) {
            this.taskProvider.dispose();
            this.taskProvider = void 0;
        }
        this.providers.clear();
    }

    private updateWorkspaceFolders(
        added: readonly vscode.WorkspaceFolder[],
        removed: readonly vscode.WorkspaceFolder[]
    ): void {
        for (const remove of removed) {
            const provider = this.providers.get(remove.uri.toString());
            if (provider) {
                provider.dispose();
                this.providers.delete(remove.uri.toString());
            }
        }
        for (const add of added) {
            const provider = new FolderTaskProvider(add);
            if (provider.isEnabled()) {
                this.providers.set(add.uri.toString(), provider);
                provider.start();
            }
        }
        this.updateProvider();
    }

    private updateConfiguration(): void {
        for (const detector of this.providers.values()) {
            if (!detector.isEnabled()) {
                detector.dispose();
                this.providers.delete(detector.workspaceFolder.uri.toString());
            }
        }
        const folders = vscode.workspace.workspaceFolders;
        if (folders) {
            for (const folder of folders) {
                if (!this.providers.has(folder.uri.toString())) {
                    const provider = new FolderTaskProvider(folder);
                    if (provider.isEnabled()) {
                        this.providers.set(folder.uri.toString(), provider);
                        provider.start();
                    }
                }
            }
        }
        this.updateProvider();
    }

    private updateProvider(): void {
        if (!this.taskProvider && this.providers.size > 0) {
            this.taskProvider = vscode.workspace.registerTaskProvider('mew', {
                provideTasks: () => this.getTasks(),
                resolveTask(): vscode.Task | undefined {
                    return void 0;
                }
            });
        }
        else if (this.taskProvider && this.providers.size === 0) {
            this.taskProvider.dispose();
            this.taskProvider = void 0;
        }
    }

    private getTasks(): vscode.Task[] {
        if (this.providers.size === 0) {
            return [];
        }

        const tasks: vscode.Task[] = [];
        for (const provider of this.providers.values()) {
            tasks.push(...provider.getTasks());
        }
        return tasks.filter(task => task != null);
    }
}
