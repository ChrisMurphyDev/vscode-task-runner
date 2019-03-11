import * as vscode from 'vscode';

interface TreeEntry {
    label: string;
    task?: vscode.Task;
}

export class TasksTreeProvider implements vscode.TreeDataProvider<TreeEntry> {
	private _onDidChangeTreeData: vscode.EventEmitter<TreeEntry> = new vscode.EventEmitter<TreeEntry>();
    get onDidChangeTreeData(): vscode.Event<TreeEntry> {
        return this._onDidChangeTreeData.event;
    }
    
    async getChildren(element?: TreeEntry): Promise<TreeEntry[]> {
        if (element) {
            return this._getTasksByType(element.label)
                .map(task => ({ label: task.name, task }));
        }

        this._tasks = await vscode.tasks.fetchTasks(); // We only need to fetch the task list at the root level
        return this._getTaskTypes()
            .map(type => ({ label: type }));
    }

    getTreeItem(element: TreeEntry): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(element.label);

        if (element.task) {
            treeItem.command = { command: 'taskRunner.executeTask', title: 'Execute task', arguments: [element.task] };
        } else {
            treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        }
        
        return treeItem;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    private _tasks: vscode.Task[] = [];

    private _getTaskTypes(): string[] {
        return this._tasks
            .map(x => x.definition.type)
            .filter((value, index, self) => self.indexOf(value) === index);
    }

    private _getTasksByType(type: string): vscode.Task[] {
        return this._tasks
            .filter(x => x.definition.type === type);
    }
}