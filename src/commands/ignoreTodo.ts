import * as vscode from 'vscode';
import todoService from '../services/todoService';

function ignoreTodoCommand() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const position = editor.selection.active;
        const line = editor.document.lineAt(position.line);

        editor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(line.lineNumber, 0), '//ignore-todo\n');
        }).then(() => {
            todoService.updateTodoCount();
        });
    }
};

export default ignoreTodoCommand;