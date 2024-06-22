import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "todoFinder" is now active!');

    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    statusBarItem.text = 'TODOs: 0';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    const countTodosInFile = async (uri: vscode.Uri): Promise<number> => {
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const text = document.getText();
            const matches = text.match(/TODO/g);
            return matches ? matches.length : 0;
        } catch (error) {
            console.error(`Failed to read file ${uri.fsPath}:`, error);
            return 0;
        }
    };

    const updateTodoCount = async () => {
        if (!vscode.workspace.workspaceFolders) {
            statusBarItem.text = 'TODOs: 0';
            return;
        }

        let totalTodos = 0;
        const uris = await vscode.workspace.findFiles('**/*.{ts,js}', '**/node_modules/**');
        const todoFiles: vscode.Uri[] = [];

        for (const uri of uris) {
            const todoCount = await countTodosInFile(uri);
            if (todoCount > 0) {
                todoFiles.push(uri);
                totalTodos += todoCount;
            }
        }

        statusBarItem.text = `TODOs: ${totalTodos}`;
        todoProvider.refresh(todoFiles);
    };

    const todoProvider = new TodoProvider();
    vscode.window.registerTreeDataProvider('todoTreeView', todoProvider);

    vscode.commands.registerCommand('todoView.refresh', updateTodoCount);

    vscode.window.onDidChangeActiveTextEditor(updateTodoCount, null, context.subscriptions);
    vscode.workspace.onDidSaveTextDocument(updateTodoCount, null, context.subscriptions);
    updateTodoCount();
}

export function deactivate() {}

class TodoProvider implements vscode.TreeDataProvider<vscode.Uri> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.Uri | undefined | null | void> = new vscode.EventEmitter<vscode.Uri | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<vscode.Uri | undefined | null | void> = this._onDidChangeTreeData.event;

    private todoFiles: vscode.Uri[] = [];

    refresh(todoFiles: vscode.Uri[]): void {
        this.todoFiles = todoFiles;
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: vscode.Uri): vscode.TreeItem {
        return {
            resourceUri: element,
            command: {
                command: 'vscode.open',
                arguments: [element],
                title: 'Open File'
            },
            collapsibleState: vscode.TreeItemCollapsibleState.None
        };
    }

    getChildren(element?: vscode.Uri): vscode.ProviderResult<vscode.Uri[]> {
        if (element) {
            return [];
        } else {
            return this.todoFiles;
        }
    }
}
