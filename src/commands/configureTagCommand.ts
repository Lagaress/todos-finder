import * as vscode from 'vscode';

export default async function configureTagCommand() {
  const config = vscode.workspace.getConfiguration('todosfinder');
  const currentTag = config.get<string>('tag', '');

  const tag = await vscode.window.showInputBox({
    placeHolder: 'Enter tag to search for TODOs (e.g., BUG)',
    prompt: 'Configure tag for TODOs',
    value: currentTag,
  });

  if (tag !== undefined) {
    await config.update('tag', tag, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`TODO tag configured to: ${tag}`);
  }
}
