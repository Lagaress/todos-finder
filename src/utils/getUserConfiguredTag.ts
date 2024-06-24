import * as vscode from 'vscode';
import config from '../config/config';

function getUserConfiguredTag(): string {
    console.log("getUserConfiguredTag: Getting tag from configuration.")
    const vsCodeConfig = vscode.workspace.getConfiguration('todosfinder');
    console.log("getUserConfiguredTag: Tag retrieved from configuration successfully.")
    return vsCodeConfig.get<string>('tag', config.DEFAULT_TAG_VALUE);
};

export default getUserConfiguredTag;