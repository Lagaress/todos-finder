import * as vscode from "vscode";
import config from "../config/config";
import { StatusBarSingleton } from "../types/Singleton/StatusBarSingleton";
import { TodoProviderSingleton } from "../types/Singleton/TodoProviderSingleton";
import TodoCountData from "../types/TodoCountData";
import { isNotNull } from "../types/typeGuards";
import getUserConfiguredTag from "../utils/getUserConfiguredTag";

const IGNORE_REGEX = /^\/\/ignore-todo$/;
function createTodoFinderRegex(): RegExp {
  const tag = getUserConfiguredTag();
  return tag
    ? new RegExp(`TODO\\[${tag}\\]`, "g")
    : new RegExp("TODO", "g");
}

async function countTodosInFileByUri(uri: vscode.Uri): Promise<number> {
  console.log(`countTodosInFile: Counting TODOs in file ${uri.fsPath}`)
  const TODO_FINDER_REGEX = createTodoFinderRegex();

  try {
    console.log(`countTodosInFile: Getting lines from document`)
    const document = await vscode.workspace.openTextDocument(uri);
    const text = document.getText();
    const lines = text.split("\n");

    console.log(`countTodosInFile: Finding valid TODOs in file`)
    const validTodoLines = lines.filter((line, index) => {
      if (!TODO_FINDER_REGEX.test(line)) {
        return false;
      }
      const previousLine = index > 0 ? document.lineAt(index - 1).text : "";
      return !IGNORE_REGEX.test(previousLine);
    });

    console.log(`countTodosInFile: Found ${validTodoLines.length} TODOs in file`)
    return validTodoLines.length;
  } catch (error) {
    console.error(`Failed to read file ${uri.fsPath}:`, error);
    throw error;
  }
}

async function getTodoCountDataByUri(uri: vscode.Uri): Promise<TodoCountData | null> {
  console.log('getTodoCountDataByUri: Getting TODO count data for file')
  const count = await countTodosInFileByUri(uri);
    if (count > 0) {
      return { uri, count } as TodoCountData;
    }
  return null;
}


export default {
  async updateTodoCount(): Promise<void> {
    console.log("updateTodoCount: Updating TODO count.");
    const statusBarItem = StatusBarSingleton.getInstance();
    const todoProvider = TodoProviderSingleton.getInstance();  

    if (!vscode.workspace.workspaceFolders && !vscode.window.activeTextEditor) {
      console.log("updateTodoCount: No active workspace or editor found.")
      return;
    }

    console.log("updateTodoCount: Getting file uris to find TODOs.")
    const filesUris = vscode.window.activeTextEditor
      ? [vscode.window.activeTextEditor.document.uri]
      : await vscode.workspace.findFiles(
          config.FILES_TO_INCLUDE_IN_SEARCH,
          config.FILES_TO_EXCLUDE_FROM_SEARCH
        );
    
    console.log(`updateTodoCount: Processing ${filesUris.length} files to find TODOs.`);
    const todosData = await Promise.all(filesUris.map(uri => getTodoCountDataByUri(uri)));
    const filteredTodosData: TodoCountData[] = todosData.filter(isNotNull);
            
    const todoFiles = Array.from(new Set(filteredTodosData.map(data => data.uri)));
    const totalTodos = filteredTodosData.reduce((sum, data) => sum + data.count, 0);

    console.log("updateTodoCount: Updating status bar item.")
    statusBarItem.text = `TODOs: ${totalTodos}`;

    console.log("updateTodoCount: Refresing TODOs files.")
    todoProvider.refresh(todoFiles);  

    console.log("updateTodoCount: TODO count updated successfully.")
  },
};
