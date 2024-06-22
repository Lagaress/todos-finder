import * as vscode from 'vscode';

function getConfiguredTag(): string {
    const config = vscode.workspace.getConfiguration('todosfinder');
    return config.get<string>('tag', '');
};

export default getConfiguredTag;