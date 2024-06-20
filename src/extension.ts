import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "todoFinder" is now active!');

    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = 'TODOs: 0';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    const updateTodoCount = () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const todoCount = (text.match(/TODO/g) || []).length;
            statusBarItem.text = `TODOs: ${todoCount}`;
        } else {
            statusBarItem.text = 'TODOs: 0';
        }
    };

    // Actualizar el contador al abrir un documento
    vscode.window.onDidChangeActiveTextEditor(updateTodoCount, null, context.subscriptions);

    // Actualizar el contador al guardar un documento
    vscode.workspace.onDidSaveTextDocument(updateTodoCount, null, context.subscriptions);

    // Actualizar el contador al cambiar el contenido de un documento
    vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
            updateTodoCount();
        }
    });

    // Inicializar el contador cuando se activa la extensión
    updateTodoCount();
}

export function deactivate() {}
