import * as yaml from 'js-yaml';
import * as vscode from 'vscode';
import { HelmwaveDocument } from '../types/helmwaveTypes';
import { createDiagnostic } from './positionUtils';

/**
 * Parse YAML document and handle errors
 */
export function parseYamlDocument(
    text: string, 
    lines: string[]
): { yamlDoc: HelmwaveDocument | null; diagnostics: vscode.Diagnostic[] } {
    const diagnostics: vscode.Diagnostic[] = [];
    
    try {
        const yamlDoc = yaml.load(text) as HelmwaveDocument;
        
        if (!yamlDoc || typeof yamlDoc !== 'object') {
            diagnostics.push(createDiagnostic(
                new vscode.Range(0, 0, 0, lines[0]?.length || 0),
                'Invalid YAML document',
                vscode.DiagnosticSeverity.Error
            ));
            return { yamlDoc: null, diagnostics };
        }
        
        return { yamlDoc, diagnostics };
    } catch (error) {
        // YAML parsing error
        const yamlError = error as yaml.YAMLException;
        let line = 0;
        let column = 0;
        
        if (yamlError.mark) {
            line = yamlError.mark.line;
            column = yamlError.mark.column;
        }
        
        const lineText = lines[line] || '';
        const endColumn = Math.min(column + 10, lineText.length);
        
        diagnostics.push(createDiagnostic(
            new vscode.Range(line, column, line, endColumn),
            `YAML syntax error: ${yamlError.message}`,
            vscode.DiagnosticSeverity.Error
        ));
        
        return { yamlDoc: null, diagnostics };
    }
}
