import * as vscode from 'vscode';
import { isHelmwaveFile } from '../utils/fileUtils';
import { parseYamlDocument } from '../utils/yamlUtils';
import { HelmwaveValidator } from './helmwaveValidator';
import { ValidationContext } from '../types/helmwaveTypes';

/**
 * Manages diagnostics for Helmwave files
 */
export class DiagnosticManager {
    private diagnosticCollection: vscode.DiagnosticCollection;
    private validator: HelmwaveValidator;

    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('helmwave');
        this.validator = new HelmwaveValidator();
    }

    /**
     * Register event handlers for validation
     */
    registerHandlers(context: vscode.ExtensionContext): void {
        // Register the diagnostic collection for cleanup
        context.subscriptions.push(this.diagnosticCollection);

        // Validate on document save
        context.subscriptions.push(
            vscode.workspace.onDidSaveTextDocument(this.validateDocument.bind(this))
        );

        // Validate on document change (with debouncing)
        let timeout: NodeJS.Timeout | undefined;
        context.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument((event) => {
                if (timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(() => {
                    this.validateDocument(event.document);
                }, 500); // 500ms debounce
            })
        );

        // Validate on document open
        context.subscriptions.push(
            vscode.workspace.onDidOpenTextDocument(this.validateDocument.bind(this))
        );

        // Validate all currently open documents
        vscode.workspace.textDocuments.forEach(this.validateDocument.bind(this));
    }

    /**
     * Validate a single document
     */
    validateDocument(document: vscode.TextDocument): void {
        if (!isHelmwaveFile(document)) {
            return;
        }

        const text = document.getText();
        const lines = text.split('\n');
        const diagnostics: vscode.Diagnostic[] = [];

        // Parse YAML
        const { yamlDoc, diagnostics: parseErrors } = parseYamlDocument(text, lines);
        diagnostics.push(...parseErrors);

        // If parsing succeeded, validate Helmwave structure
        if (yamlDoc) {
            const context: ValidationContext = {
                document,
                yamlDoc,
                lines,
                diagnostics
            };
            
            this.validator.validate(context);
        }

        // Set diagnostics for the document
        this.diagnosticCollection.set(document.uri, diagnostics);
    }

    /**
     * Manually validate the active document
     */
    validateActiveDocument(): void {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && isHelmwaveFile(activeEditor.document)) {
            this.validateDocument(activeEditor.document);
            vscode.window.showInformationMessage('Helmwave validation completed!');
        } else {
            vscode.window.showWarningMessage('Please open a Helmwave configuration file to validate.');
        }
    }

    /**
     * Dispose of resources
     */
    dispose(): void {
        this.diagnosticCollection.dispose();
    }
}
