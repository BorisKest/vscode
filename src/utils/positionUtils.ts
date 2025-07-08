import * as vscode from 'vscode';
import { KeyPosition } from '../types/helmwaveTypes';
import { DIAGNOSTIC_SOURCE } from '../constants/helmwaveSchema';

/**
 * Find the position of a key in the document lines with precise locations
 */
export function findKeyPosition(lines: string[], key: string): KeyPosition {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        if (trimmed.startsWith(`${key}:`)) {
            const keyStart = line.indexOf(key);
            const keyEnd = keyStart + key.length;
            const colonIndex = line.indexOf(':', keyStart);
            
            // Find value start (after colon and any whitespace)
            let valueStart = colonIndex + 1;
            while (valueStart < line.length && /\s/.test(line[valueStart])) {
                valueStart++;
            }
            
            // Find value end (end of line or start of comment)
            let valueEnd = line.length;
            const commentIndex = line.indexOf('#', valueStart);
            if (commentIndex !== -1) {
                valueEnd = commentIndex;
            }
            
            // Trim trailing whitespace from valueEnd
            while (valueEnd > valueStart && /\s/.test(line[valueEnd - 1])) {
                valueEnd--;
            }
            
            return { line: i, keyStart, keyEnd, valueStart, valueEnd };
        }
    }
    return { line: -1, keyStart: 0, keyEnd: 0, valueStart: 0, valueEnd: 0 };
}

/**
 * Create a diagnostic with the helmwave source
 */
export function createDiagnostic(
    range: vscode.Range, 
    message: string, 
    severity: vscode.DiagnosticSeverity
): vscode.Diagnostic {
    return {
        range,
        message,
        severity,
        source: DIAGNOSTIC_SOURCE
    };
}

/**
 * Get the current Helmwave section context from cursor position
 */
export function getCurrentSection(document: vscode.TextDocument, position: vscode.Position): string | null {
    for (let i = position.line; i >= 0; i--) {
        const line = document.lineAt(i).text;
        if (line.match(/^(repositories|releases|registries|monitors|lifecycle):/)) {
            return line.split(':')[0].trim();
        }
    }
    return null;
}

/**
 * Check if cursor is at root level (not indented)
 */
export function isAtRootLevel(document: vscode.TextDocument, position: vscode.Position): boolean {
    const line = document.lineAt(position.line);
    return !line.text.startsWith('  ') && !line.text.startsWith('\t');
}
