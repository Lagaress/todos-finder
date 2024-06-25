import * as vscode from 'vscode';
import configureTagCommand from './commands/configureTagCommand';
import ignoreTodoCommand from './commands/ignoreTodo';
import refreshTodosCommand from './commands/refreshTodos';
import { TodoProviderSingleton } from './types/Singleton/TodoProviderSingleton';
import todoService from './services/todoService';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating TODOs Finder');

    console.log('Registering provider');
    const todoProvider = TodoProviderSingleton.getInstance();
    vscode.window.registerTreeDataProvider('todoTreeView', todoProvider);

    console.log('Registering commands');
    vscode.commands.registerCommand('todosfinder.ignoreTodo', ignoreTodoCommand);
    vscode.commands.registerCommand('todosfinder.configureTag', configureTagCommand);

    vscode.window.onDidChangeActiveTextEditor(refreshTodosCommand, null, context.subscriptions);
    vscode.workspace.onDidChangeWorkspaceFolders(refreshTodosCommand, null, context.subscriptions);
    vscode.workspace.onDidSaveTextDocument(async (document) => {
        await todoService.updateTodoCount(document.uri);
    }, null, context.subscriptions);
    
    refreshTodosCommand();
}

export function deactivate() {}
