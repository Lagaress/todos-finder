import * as vscode from 'vscode';

export class TodoItem extends vscode.TreeItem {
    constructor(
        public resourceUri: vscode.Uri | undefined,
        public label: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public command?: vscode.Command,
        public children?: TodoItem[]
    ) {
        super(label, collapsibleState);
        this.resourceUri = resourceUri;
        this.command = command;
        this.children = children;
    }
}
