import * as vscode from 'vscode';
import config from '../config/config';

export default async function configureTagCommand() {
  console.log("configureTagCommand: Command execution started.");
  const vsCodeConfig = vscode.workspace.getConfiguration('todosfinder');
  const currentTag = vsCodeConfig.get<string>('tag', config.DEFAULT_TAG_VALUE);

  const tag = await vscode.window.showInputBox({
    placeHolder: 'Enter tag to search for TODOs (e.g., BUG)',
    prompt: 'Configure tag for TODOs',
    value: currentTag,
  });

  if (!tag) {
    console.log("configureTagCommand: No value inserted, returning configured tag to default value.");
    await vsCodeConfig.update('tag', config.DEFAULT_TAG_VALUE, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage("TODO tag reset to default. Finding for: TODO");
  } else {
    console.log("configureTagCommand: New value inserted, updating configured tag.");
    await vsCodeConfig.update('tag', tag, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`New TODO tag configured. Finding for: TODO[${tag}]`);  
  }
}
