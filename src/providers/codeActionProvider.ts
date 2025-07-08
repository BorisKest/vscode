import * as vscode from 'vscode';

/**
 * Code Action Provider for Helmwave quick fixes
 * Provides automated fixes for common validation errors
 */
export class HelmwaveCodeActionProvider implements vscode.CodeActionProvider {
	provideCodeActions(
		document: vscode.TextDocument,
		range: vscode.Range | vscode.Selection,
		context: vscode.CodeActionContext,
		token: vscode.CancellationToken
	): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
		const actions: vscode.CodeAction[] = [];

		for (const diagnostic of context.diagnostics) {
			if (diagnostic.source === 'helmwave') {
				const action = this.createQuickFix(document, diagnostic);
				if (action) {
					actions.push(action);
				}
			}
		}

		return actions;
	}

	private createQuickFix(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): vscode.CodeAction | undefined {
		const message = diagnostic.message;

		// Quick fix for missing project field
		if (message.includes('Missing required field: project')) {
			return this.createAddProjectFieldAction(document, diagnostic);
		}

		// Quick fix for missing name field in releases
		if (message.includes('Release missing required field: name')) {
			return this.createAddReleaseFieldAction(document, diagnostic, 'name', '"release-name"');
		}

		// Quick fix for missing chart field in releases
		if (message.includes('Release missing required field: chart')) {
			return this.createAddReleaseFieldAction(document, diagnostic, 'chart', '"chart-name"');
		}

		// Quick fix for missing namespace field in releases
		if (message.includes('Release missing required field: namespace')) {
			return this.createAddReleaseFieldAction(document, diagnostic, 'namespace', '"default"');
		}

		// Quick fix for missing url field in repositories
		if (message.includes('Repository missing required field: url')) {
			return this.createAddRepositoryFieldAction(document, diagnostic, 'url', '"https://charts.helm.sh/stable"');
		}

		// Quick fix for missing name field in repositories
		if (message.includes('Repository missing required field: name')) {
			return this.createAddRepositoryFieldAction(document, diagnostic, 'name', '"repo-name"');
		}

		// Quick fix for missing host field in registries
		if (message.includes('Registry missing required field: host')) {
			return this.createAddRegistryFieldAction(document, diagnostic, 'host', '"registry.example.com"');
		}

		// Quick fix for array type errors
		if (message.includes('must be an array')) {
			return this.createFixArrayTypeAction(document, diagnostic);
		}

		// Quick fix for object type errors
		if (message.includes('must be an object')) {
			return this.createFixObjectTypeAction(document, diagnostic);
		}

		return undefined;
	}

	private createAddProjectFieldAction(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): vscode.CodeAction {
		const action = new vscode.CodeAction('Add missing project field', vscode.CodeActionKind.QuickFix);
		action.edit = new vscode.WorkspaceEdit();
		action.edit.insert(document.uri, new vscode.Position(0, 0), 'project: "my-project"\n');
		action.diagnostics = [diagnostic];
		action.isPreferred = true;
		return action;
	}

	private createAddReleaseFieldAction(
		document: vscode.TextDocument, 
		diagnostic: vscode.Diagnostic, 
		fieldName: string, 
		defaultValue: string
	): vscode.CodeAction {
		const action = new vscode.CodeAction(`Add missing ${fieldName} field`, vscode.CodeActionKind.QuickFix);
		action.edit = new vscode.WorkspaceEdit();
		
		const line = diagnostic.range.start.line;
		const lineText = document.lineAt(line).text;
		const indent = this.getIndentation(lineText);
		
		action.edit.insert(
			document.uri, 
			new vscode.Position(line + 1, 0), 
			`${indent}${fieldName}: ${defaultValue}\n`
		);
		action.diagnostics = [diagnostic];
		action.isPreferred = true;
		return action;
	}

	private createAddRepositoryFieldAction(
		document: vscode.TextDocument, 
		diagnostic: vscode.Diagnostic, 
		fieldName: string, 
		defaultValue: string
	): vscode.CodeAction {
		const action = new vscode.CodeAction(`Add missing ${fieldName} field`, vscode.CodeActionKind.QuickFix);
		action.edit = new vscode.WorkspaceEdit();
		
		const line = diagnostic.range.start.line;
		const lineText = document.lineAt(line).text;
		const indent = this.getIndentation(lineText);
		
		action.edit.insert(
			document.uri, 
			new vscode.Position(line + 1, 0), 
			`${indent}${fieldName}: ${defaultValue}\n`
		);
		action.diagnostics = [diagnostic];
		action.isPreferred = true;
		return action;
	}

	private createAddRegistryFieldAction(
		document: vscode.TextDocument, 
		diagnostic: vscode.Diagnostic, 
		fieldName: string, 
		defaultValue: string
	): vscode.CodeAction {
		const action = new vscode.CodeAction(`Add missing ${fieldName} field`, vscode.CodeActionKind.QuickFix);
		action.edit = new vscode.WorkspaceEdit();
		
		const line = diagnostic.range.start.line;
		const lineText = document.lineAt(line).text;
		const indent = this.getIndentation(lineText);
		
		action.edit.insert(
			document.uri, 
			new vscode.Position(line + 1, 0), 
			`${indent}${fieldName}: ${defaultValue}\n`
		);
		action.diagnostics = [diagnostic];
		action.isPreferred = true;
		return action;
	}

	private createFixArrayTypeAction(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): vscode.CodeAction {
		const action = new vscode.CodeAction('Fix array type', vscode.CodeActionKind.QuickFix);
		action.edit = new vscode.WorkspaceEdit();
		
		const line = diagnostic.range.start.line;
		const lineText = document.lineAt(line).text;
		const colonIndex = lineText.indexOf(':');
		
		if (colonIndex !== -1) {
			const beforeColon = lineText.substring(0, colonIndex + 1);
			action.edit.replace(
				document.uri,
				new vscode.Range(line, 0, line, lineText.length),
				`${beforeColon}\n${this.getIndentation(lineText)}  - # Add array items here`
			);
		}
		
		action.diagnostics = [diagnostic];
		return action;
	}

	private createFixObjectTypeAction(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): vscode.CodeAction {
		const action = new vscode.CodeAction('Fix object type', vscode.CodeActionKind.QuickFix);
		action.edit = new vscode.WorkspaceEdit();
		
		const line = diagnostic.range.start.line;
		const lineText = document.lineAt(line).text;
		const colonIndex = lineText.indexOf(':');
		
		if (colonIndex !== -1) {
			const beforeColon = lineText.substring(0, colonIndex + 1);
			action.edit.replace(
				document.uri,
				new vscode.Range(line, 0, line, lineText.length),
				`${beforeColon}\n${this.getIndentation(lineText)}  # Add object properties here`
			);
		}
		
		action.diagnostics = [diagnostic];
		return action;
	}

	private getIndentation(line: string): string {
		const match = line.match(/^(\s*)/);
		return match ? match[1] : '  ';
	}
}
