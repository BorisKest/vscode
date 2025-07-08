/**
 * Helmwave VS Code Extension - Main Entry Point
 * 
 * This extension provides syntax highlighting, validation, code completion,
 * and other language features for Helmwave YAML configuration files.
 */
import * as vscode from 'vscode';
import { DiagnosticManager } from './validation/diagnosticManager';
import { HelmwaveCompletionProvider } from './providers/completionProvider';
import { HelmwaveCodeActionProvider } from './providers/codeActionProvider';
import { HelmwaveDocumentSymbolProvider } from './providers/documentSymbolProvider';
import { isHelmwaveFile } from './utils/fileUtils';

/**
 * This method is called when the extension is activated
 * The extension is activated the very first time a Helmwave file is opened
 */
export function activate(context: vscode.ExtensionContext): void {
	console.log('Helmwave extension is now active!');

	// Initialize diagnostic manager for validation
	const diagnosticManager = new DiagnosticManager();
	diagnosticManager.registerHandlers(context);

	// Register completion provider for Helmwave structure
	const completionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'helmwave' },
		new HelmwaveCompletionProvider(),
		':', // Trigger completion after colon
		' ', // Trigger completion after space
		'-'  // Trigger completion after dash (for array items)
	);
	context.subscriptions.push(completionProvider);

	// Register code action provider for quick fixes
	const codeActionProvider = vscode.languages.registerCodeActionsProvider(
		{ language: 'helmwave' },
		new HelmwaveCodeActionProvider(),
		{
			providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
		}
	);
	context.subscriptions.push(codeActionProvider);

	// Register document symbol provider for outline view
	const documentSymbolProvider = vscode.languages.registerDocumentSymbolProvider(
		{ language: 'helmwave' },
		new HelmwaveDocumentSymbolProvider()
	);
	context.subscriptions.push(documentSymbolProvider);

	// Register manual validation command
	const validateCommand = vscode.commands.registerCommand('helmwave.validate', () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor && isHelmwaveFile(activeEditor.document)) {
			diagnosticManager.validateDocument(activeEditor.document);
			vscode.window.showInformationMessage('Helmwave validation completed!');
		} else {
			vscode.window.showWarningMessage('Please open a Helmwave configuration file to validate.');
		}
	});
	context.subscriptions.push(validateCommand);

	// Validate all currently open Helmwave documents
	vscode.workspace.textDocuments.forEach(document => {
		if (isHelmwaveFile(document)) {
			diagnosticManager.validateDocument(document);
		}
	});

	console.log('Helmwave extension initialization completed');
}

/**
 * This method is called when the extension is deactivated
 */
export function deactivate(): void {
	console.log('Helmwave extension deactivated');
}
