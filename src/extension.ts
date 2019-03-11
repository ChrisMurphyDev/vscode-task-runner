import * as vscode from 'vscode';
import { TasksTreeProvider } from './tasks-tree-provider';

export function activate(context: vscode.ExtensionContext) {
    const tasksTreeProvider = new TasksTreeProvider();

    const disposables = [
        vscode.window.registerTreeDataProvider('taskRunner', tasksTreeProvider),
        vscode.commands.registerCommand('taskRunner.refreshTasks', () => tasksTreeProvider.refresh()),
        vscode.commands.registerCommand('taskRunner.executeTask', task => vscode.tasks.executeTask(task)),
    ];

    context.subscriptions.push(...disposables);
}

export function deactivate() {}
