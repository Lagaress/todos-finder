import * as vscode from 'vscode';
import TodoCountData from '../TodoCountData';

export class TodosSingleton {
  private static instance: TodosSingleton;
  private todoCounts: TodoCountData[];

  private constructor() {
    this.todoCounts = [];
  }

  public static getInstance(): TodosSingleton {
    if (!TodosSingleton.instance) {
      console.log("TodosSingleton: Creating TodosSingleton.");
      TodosSingleton.instance = new TodosSingleton();
    }
    return TodosSingleton.instance;
  }

  public addOrUpdateUri(uri: vscode.Uri, count: number): void {
    const index = this.todoCounts.findIndex(todo => todo.uri.fsPath === uri.fsPath);
    if (index >= 0) {
      if (count === 0) {
        this.todoCounts.splice(index, 1);
      } else {
        this.todoCounts[index].count = count;
      }
    } else {
      this.todoCounts.push({ uri, count });
    }
  }

  public removeUri(uri: vscode.Uri): void {
    this.todoCounts = this.todoCounts.filter(todo => todo.uri.fsPath !== uri.fsPath);
  }

  public getUris(): vscode.Uri[] {
    return this.todoCounts.map(todo => todo.uri);
  }

  public getTodosCount(): number {
    return this.todoCounts.reduce((sum, todo) => sum + todo.count, 0);
  }
}
