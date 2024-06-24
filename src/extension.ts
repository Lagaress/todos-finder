import * as vscode from 'vscode';
import ignoreTodoCommand from './commands/ignoreTodo';
import refreshTodosCommand from './commands/refreshTodos';
import { TodoProviderSingleton } from './types/Singleton/TodoProviderSingleton';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating TODOs Finder');

    console.log('Registering provider');
    const todoProvider = TodoProviderSingleton.getInstance();
    vscode.window.registerTreeDataProvider('todoTreeView', todoProvider);

    console.log('Registering commands');
    vscode.commands.registerCommand('todoView.refresh', refreshTodosCommand);
    vscode.commands.registerCommand('todosfinder.ignoreTodo', ignoreTodoCommand);

    vscode.window.onDidChangeActiveTextEditor(refreshTodosCommand, null, context.subscriptions);
    vscode.workspace.onDidSaveTextDocument(refreshTodosCommand, null, context.subscriptions);
    
    refreshTodosCommand();
}

export function deactivate() {}
