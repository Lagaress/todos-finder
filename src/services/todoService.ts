import * as vscode from "vscode";
import { TodoProvider } from "../providers/TodoProvider";
import getUserConfiguredTag from "../utils/getUserConfiguredTag";

const todoProvider = new TodoProvider();

async function countTodosInFile(uri: vscode.Uri): Promise<number> {
  const tag = getUserConfiguredTag();
  const regex = tag
    ? new RegExp(`TODO\\[${tag}\\]`, "g")
    : new RegExp("TODO", "g");
  const ignoreRegex = /^\/\/ignore-todo$/;

  try {
    const document = await vscode.workspace.openTextDocument(uri);
    const text = document.getText();
    const lines = text.split("\n");
    let todoCount = 0;

    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        const previousLine = lines[i - 1] || "";
        if (!ignoreRegex.test(previousLine)) {
          todoCount++;
        }
      }
    }

    return todoCount;
  } catch (error) {
    console.error(`Failed to read file ${uri.fsPath}:`, error);
    return 0;
  }
}

export default {
  countTodosInFile,

  async updateTodoCount(): Promise<void> {
    let statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      1
    );
    statusBarItem.text = "TODOs: 0";
    statusBarItem.show();

    if (!vscode.workspace.workspaceFolders) {
      statusBarItem.text = "TODOs: 0";
      return;
    }

    let totalTodos = 0;
    const uris = await vscode.workspace.findFiles(
      "**/*.{ts,js}",
      "**/node_modules/**"
    );
    const todoFiles: vscode.Uri[] = [];

    for (const uri of uris) {
      const todoCount = await countTodosInFile(uri);
      if (todoCount > 0) {
        todoFiles.push(uri);
        totalTodos += todoCount;
      }
    }

    statusBarItem.text = `TODOs: ${totalTodos}`;
    todoProvider.refresh(todoFiles);
  },
};
