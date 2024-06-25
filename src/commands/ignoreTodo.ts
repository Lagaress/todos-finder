import * as vscode from "vscode";
import config from "../config/config";

async function ignoreTodoCommand() {
  console.log("ignoreTodoCommand: Command execution started.");
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    console.error("ignoreTodoCommand: Active editor not found.");
    return;
  }

  const currentPosition = activeTextEditor.selection.active;
  const currentLine = activeTextEditor.document.lineAt(currentPosition.line);
  const ignoreTodoComment = config.IGNORE_TODO_COMMENT;

  console.log(`ignoreTodoCommand: Inserting ${ignoreTodoComment} at line ${currentLine.lineNumber}.`);
  try {
    await activeTextEditor.edit((editBuilder) => {
      const insertPosition = new vscode.Position(currentLine.lineNumber, 0);
      editBuilder.insert(insertPosition, `${ignoreTodoComment}\n`);
    });

    console.log("ignoreTodoCommand: Command execution finished.");
  } catch (error) {
    console.error(`ignoreTodoCommand: Error occurred while inserting ${ignoreTodoComment}:`, error);
  }
}

export default ignoreTodoCommand;
