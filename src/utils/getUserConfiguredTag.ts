import * as vscode from 'vscode';

function getUserConfiguredTag(): string {
    console.log("getUserConfiguredTag: Getting tag from configuration.")
    const config = vscode.workspace.getConfiguration('todosfinder');
    console.log("getUserConfiguredTag: Tag retrieved from configuration successfully.")
    return config.get<string>('tag', '');
};

export default getUserConfiguredTag;