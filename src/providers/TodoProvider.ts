import * as vscode from 'vscode';
import { TodoItem } from '../types/TodoItem';

export class TodoProvider implements vscode.TreeDataProvider<TodoItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TodoItem | undefined | null | void> = new vscode.EventEmitter<TodoItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TodoItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private todoFiles: vscode.Uri[] = [];

    refresh(todoFiles: vscode.Uri[]): void {
        this.todoFiles = todoFiles;
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TodoItem): vscode.TreeItem {
        return {
            label: element.label,
            resourceUri: element.resourceUri,
            command: element.command,
            collapsibleState: element.collapsibleState,
        };
    }

    getChildren(element?: TodoItem): vscode.ProviderResult<TodoItem[]> {
        if (element) {
            return element.children;
        } else {
            return [
                new TodoItem(undefined, "TODOs", vscode.TreeItemCollapsibleState.Collapsed, undefined, this.todoFiles.map(uri => {
                    return new TodoItem(uri, vscode.workspace.asRelativePath(uri), vscode.TreeItemCollapsibleState.None, {
                        command: 'vscode.open',
                        arguments: [uri],
                        title: 'Open File'
                    });
                }))
            ];
        }
    }
}
