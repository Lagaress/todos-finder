import * as vscode from 'vscode';

type TodoCountData = {
  uri: vscode.Uri;
  count: number;
}

export default TodoCountData;