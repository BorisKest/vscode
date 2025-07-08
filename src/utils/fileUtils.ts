import * as vscode from 'vscode';
import { FILE_PATTERNS } from '../constants/helmwaveSchema';

/**
 * Check if a document is a Helmwave configuration file
 */
export function isHelmwaveFile(document: vscode.TextDocument): boolean {
    const fileName = document.fileName.toLowerCase();
    const languageId = document.languageId;
    
    // Check language ID first
    if (languageId === 'helmwave') {
        return true;
    }
    
    // Check filename patterns
    return fileName.includes('helmwave.yml') || 
           fileName.includes('helmwave.yaml') ||
           fileName.endsWith('_helmwave.yml') ||
           fileName.endsWith('_helmwave.yaml') ||
           fileName.endsWith('-helmwave.yml') ||
           fileName.endsWith('-helmwave.yaml');
}

/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
