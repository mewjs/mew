import type {
    Disposable,
    ExtensionContext,
    StatusBarItem,
    TextEditor
} from 'vscode';
import {
    StatusBarAlignment,
    ThemeColor,
    window
} from 'vscode';

import type { MewSettings } from './settings';
import { isLanguageLintEnable } from './settings';


export default class StatusBar {

    private statusBarItem: StatusBarItem;

    constructor(private settings: MewSettings, private context: ExtensionContext) {
        // Setup the statusBarItem
        this.statusBarItem = window.createStatusBarItem(
            StatusBarAlignment.Right,
            -1
        );
        this.statusBarItem.text = '{ Mew }';
        this.statusBarItem.command = 'mew.toggleServer';
        this.toggle(window.activeTextEditor);
    }

    active(): void {
        this.update(true);
    }

    deactivate(): void {
        this.update(false);
    }

    registerDisposables(): Disposable[] {
        return [
            // 检查是否需要显示/隐藏 在状态栏
            window.onDidChangeActiveTextEditor(editor => {
                this.toggle(editor);
            })
        ];
    }

    private update(isActivated: boolean): void {
        this.statusBarItem.tooltip = `${ isActivated ? 'Deactivate' : 'Activate' } Mew`;
        this.statusBarItem.color = new ThemeColor(
            isActivated ? 'statusBarItem.foreground' : 'statusBarItem.warningForeground'
        );
        this.statusBarItem.backgroundColor = new ThemeColor(
            isActivated ? 'statusBarItem.background' : 'statusBarItem.warningBackground'
        );
    }

    private toggle(editor: TextEditor | null): void {
        if (!editor) {
            return;
        }
        // debug or output ignore
        if (editor.document.uri.scheme === 'debug' || editor.document.uri.scheme === 'output') {
            return;
        }

        const languageId = editor.document.isUntitled
            ? null
            : editor.document.languageId;
        if (languageId && isLanguageLintEnable(languageId, this.settings)) {
            this.statusBarItem.show();
        }
        else {
            this.statusBarItem.hide();
        }
    }
}
