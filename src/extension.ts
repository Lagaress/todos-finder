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
        
        for (const uri of uris) {
            totalTodos += await countTodosInFile(uri);
        }

        statusBarItem.text = `TODOs: ${totalTodos}`;
    };

    vscode.window.onDidChangeActiveTextEditor(updateTodoCount, null, context.subscriptions);
    vscode.workspace.onDidSaveTextDocument(updateTodoCount, null, context.subscriptions);

    updateTodoCount();
}

export function deactivate() {}
