import * as vscode from "vscode";
import config from "../config/config";
import { StatusBarSingleton } from "../types/Singleton/StatusBarSingleton";
import { TodoProviderSingleton } from "../types/Singleton/TodoProviderSingleton";
import { TodosSingleton } from "../types/Singleton/TodosSingleton";
import TodoCountData from "../types/TodoCountData";
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
    console.error(`Failed to read file ${uri.fsPath}:`);
    return 0;
  }
}

async function getTodoCountDataByUri(uri: vscode.Uri): Promise<TodoCountData> {
  console.log('getTodoCountDataByUri: Getting TODO count data for file')
  const count = await countTodosInFileByUri(uri);
  return { uri, count } as TodoCountData;
}

async function getFilesUris(): Promise<vscode.Uri[]> {
  console.log("getFilesUris: Getting files uris.");
  const vsCodeConfig = vscode.workspace.getConfiguration('todosfinder');
  const filesToInclude = vsCodeConfig.get<string>('filesToInclude', config.DEFAULT_VALUES.FILES_TO_INCLUDE);
  const filesToExclude = vsCodeConfig.get<string>('filesToExclude', config.DEFAULT_VALUES.FILES_TO_EXCLUDE);

  if (vscode.workspace.workspaceFolders) {
    const filesUris = await vscode.workspace.findFiles(filesToInclude, filesToExclude);
    console.log(`getFilesUris: Retrieved ${filesUris.length} files uris successfully.`);
    return filesUris;
  }
  
  if (vscode.window.activeTextEditor) {
    const filesUris = [vscode.window.activeTextEditor.document.uri];
    console.log(`getFilesUris: Active text editor URI retrieved successfully`);
    return filesUris;
  }

  return [];
}

export default {
  async updateTodoCount(uri?: vscode.Uri): Promise<void> {
    console.log("updateTodoCount: Updating TODO count.");
    const statusBarItem = StatusBarSingleton.getInstance();
    const todoProvider = TodoProviderSingleton.getInstance();  
    const todosSingleton = TodosSingleton.getInstance();  

    if (!vscode.workspace.workspaceFolders && !vscode.window.activeTextEditor) {
      console.log("updateTodoCount: No active workspace or editor found.")
      return;
    }

    const filesUris = uri ? [uri] : await getFilesUris();
    
    console.log(`updateTodoCount: Processing ${filesUris.length} files to find TODOs.`);
    const todosData = await Promise.all(filesUris.map(uri => getTodoCountDataByUri(uri)));
    todosData.forEach(data => todosSingleton.addOrUpdateUri(data.uri, data.count));

    const todoFiles = todosSingleton.getUris();
    const totalData = todosSingleton.getTodosCount();

    console.log("updateTodoCount: Updating status bar item.")
    statusBarItem.text = `TODOs: ${totalData}`;

    console.log("updateTodoCount: Refresing TODOs files.")
    todoProvider.refresh(todoFiles);  

    console.log("updateTodoCount: TODO count updated successfully.")
  },
};
