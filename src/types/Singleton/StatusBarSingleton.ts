import * as vscode from 'vscode';
import config from '../../config/config';

export class StatusBarSingleton {
  private static instance: vscode.StatusBarItem;

  private constructor() {}

  public static getInstance(): vscode.StatusBarItem {
    if (!StatusBarSingleton.instance) {
      console.log("StatusBarSingleton: Creating status bar item.");
      StatusBarSingleton.instance = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        config.STATUS_BAR_ELEMENT_PRIORITY
      );
      StatusBarSingleton.instance.text = "TODOs: 0";
      StatusBarSingleton.instance.show();
      console.log("StatusBarSingleton: Status bar item created successfully.");    
    }
    return StatusBarSingleton.instance;
  }
}