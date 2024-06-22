import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "todoFinder" is now active!');

    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    statusBarItem.text = 'TODOs: 0';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    const getConfiguredTag = (): string => {
        const config = vscode.workspace.getConfiguration('todosfinder');
        return config.get<string>('tag', '');
    };

    const countTodosInFile = async (uri: vscode.Uri): Promise<number> => {
        const tag = getConfiguredTag();
        const regex = tag ? new RegExp(`TODO\\[${tag}\\]`, 'g') : new RegExp('TODO', 'g');
        const ignoreRegex = /^\/\/ignore-todo$/;

        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const text = document.getText();
            const lines = text.split('\n');
            let todoCount = 0;

            for (let i = 0; i < lines.length; i++) {
                if (regex.test(lines[i])) {
                    const previousLine = lines[i - 1] || '';
                    if (!ignoreRegex.test(previousLine)) {
                        todoCount++;
                    }
                }
            }

            return todoCount;
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

class TodoProvider implements vscode.TreeDataProvider<TodoItem> {
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

class TodoItem extends vscode.TreeItem {
    constructor(
        public resourceUri: vscode.Uri | undefined,
        public label: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public command?: vscode.Command,
        public children?: TodoItem[]
    ) {
        super(label, collapsibleState);
        this.resourceUri = resourceUri;
        this.command = command;
        this.children = children;
    }
}
