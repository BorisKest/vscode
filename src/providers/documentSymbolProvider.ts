import * as vscode from 'vscode';
import { parseYamlDocument } from '../utils/yamlUtils';

/**
 * Document Symbol Provider for Helmwave YAML files
 * Provides an outline view with Helmwave-specific sections
 */
export class HelmwaveDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
	provideDocumentSymbols(
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.DocumentSymbol[]> {
		try {
			const text = document.getText();
			if (!text.trim()) {
				return [];
			}

			const lines = text.split('\n');
			const { yamlDoc } = parseYamlDocument(text, lines);
			if (!yamlDoc || typeof yamlDoc !== 'object') {
				return [];
			}

			return this.createSymbolsFromObject(yamlDoc, document);
		} catch (error) {
			// Return empty array on parse errors
			return [];
		}
	}

	private createSymbolsFromObject(obj: any, document: vscode.TextDocument, parentName?: string): vscode.DocumentSymbol[] {
		const symbols: vscode.DocumentSymbol[] = [];

		for (const [key, value] of Object.entries(obj)) {
			const keyPosition = this.findKeyPosition(document, key, parentName);
			if (!keyPosition) {
				continue;
			}

			const symbol = this.createSymbol(key, value, keyPosition, document);
			if (symbol) {
				symbols.push(symbol);
			}
		}

		return symbols;
	}

	private createSymbol(
		key: string, 
		value: any, 
		keyPosition: vscode.Range, 
		document: vscode.TextDocument
	): vscode.DocumentSymbol | undefined {
		const symbolKind = this.getSymbolKind(key, value);
		const detail = this.getSymbolDetail(key, value);
		
		const symbol = new vscode.DocumentSymbol(
			key,
			detail,
			symbolKind,
			keyPosition,
			keyPosition
		);

		// Add children for specific Helmwave sections
		if (this.shouldExpandChildren(key, value)) {
			symbol.children = this.createChildSymbols(key, value, document);
		}

		return symbol;
	}

	private getSymbolKind(key: string, value: any): vscode.SymbolKind {
		// Helmwave-specific symbol kinds
		switch (key) {
			case 'project':
				return vscode.SymbolKind.Package;
			case 'version':
				return vscode.SymbolKind.String;
			case 'repositories':
			case 'registries':
			case 'releases':
			case 'monitors':
				return vscode.SymbolKind.Array;
			case 'lifecycle':
			case 'values':
				return vscode.SymbolKind.Object;
			case 'tags':
				return vscode.SymbolKind.Array;
			default:
				if (Array.isArray(value)) {
					return vscode.SymbolKind.Array;
				} else if (typeof value === 'object' && value !== null) {
					return vscode.SymbolKind.Object;
				} else if (typeof value === 'string') {
					return vscode.SymbolKind.String;
				} else if (typeof value === 'number') {
					return vscode.SymbolKind.Number;
				} else if (typeof value === 'boolean') {
					return vscode.SymbolKind.Boolean;
				}
				return vscode.SymbolKind.Property;
		}
	}

	private getSymbolDetail(key: string, value: any): string {
		switch (key) {
			case 'project':
				return `Project: ${value}`;
			case 'version':
				return `Version: ${value}`;
			case 'repositories':
				return Array.isArray(value) ? `${value.length} repositories` : 'repositories';
			case 'registries':
				return Array.isArray(value) ? `${value.length} registries` : 'registries';
			case 'releases':
				return Array.isArray(value) ? `${value.length} releases` : 'releases';
			case 'monitors':
				return Array.isArray(value) ? `${value.length} monitors` : 'monitors';
			case 'tags':
				return Array.isArray(value) ? `${value.length} tags` : 'tags';
			default:
				if (Array.isArray(value)) {
					return `${value.length} items`;
				} else if (typeof value === 'object' && value !== null) {
					const keys = Object.keys(value);
					return `${keys.length} properties`;
				} else {
					return String(value);
				}
		}
	}

	private shouldExpandChildren(key: string, value: any): boolean {
		// Expand children for arrays and objects in key Helmwave sections
		if (!value || typeof value !== 'object') {
			return false;
		}

		const expandableKeys = [
			'repositories',
			'registries',
			'releases',
			'monitors',
			'lifecycle',
			'values'
		];

		return expandableKeys.includes(key);
	}

	private createChildSymbols(parentKey: string, parentValue: any, document: vscode.TextDocument): vscode.DocumentSymbol[] {
		const children: vscode.DocumentSymbol[] = [];

		if (Array.isArray(parentValue)) {
			// For arrays, create symbols for each item
			for (let i = 0; i < parentValue.length; i++) {
				const item = parentValue[i];
				const itemName = this.getArrayItemName(parentKey, item, i);
				const itemPosition = this.findArrayItemPosition(document, parentKey, i);
				
				if (itemPosition) {
					const symbol = new vscode.DocumentSymbol(
						itemName,
						this.getArrayItemDetail(parentKey, item),
						this.getArrayItemSymbolKind(parentKey),
						itemPosition,
						itemPosition
					);

					// Add nested children for complex items
					if (typeof item === 'object' && item !== null) {
						symbol.children = this.createObjectChildren(item, document, itemName);
					}

					children.push(symbol);
				}
			}
		} else if (typeof parentValue === 'object' && parentValue !== null) {
			// For objects, create symbols for each property
			for (const [key, value] of Object.entries(parentValue)) {
				const keyPosition = this.findKeyPosition(document, key, parentKey);
				if (keyPosition) {
					const symbol = this.createSymbol(key, value, keyPosition, document);
					if (symbol) {
						children.push(symbol);
					}
				}
			}
		}

		return children;
	}

	private createObjectChildren(obj: any, document: vscode.TextDocument, parentName: string): vscode.DocumentSymbol[] {
		const children: vscode.DocumentSymbol[] = [];

		for (const [key, value] of Object.entries(obj)) {
			const keyPosition = this.findKeyPosition(document, key, parentName);
			if (keyPosition) {
				const symbol = this.createSymbol(key, value, keyPosition, document);
				if (symbol) {
					children.push(symbol);
				}
			}
		}

		return children;
	}

	private getArrayItemName(parentKey: string, item: any, index: number): string {
		switch (parentKey) {
			case 'repositories':
				return item?.name || `Repository ${index + 1}`;
			case 'registries':
				return item?.host || `Registry ${index + 1}`;
			case 'releases':
				return item?.name || `Release ${index + 1}`;
			case 'monitors':
				return item?.name || `Monitor ${index + 1}`;
			default:
				return `Item ${index + 1}`;
		}
	}

	private getArrayItemDetail(parentKey: string, item: any): string {
		switch (parentKey) {
			case 'repositories':
				return item?.url || 'Repository';
			case 'registries':
				return item?.host || 'Registry';
			case 'releases':
				return `${item?.chart || 'chart'} in ${item?.namespace || 'namespace'}`;
			case 'monitors':
				return item?.type || 'Monitor';
			default:
				return '';
		}
	}

	private getArrayItemSymbolKind(parentKey: string): vscode.SymbolKind {
		switch (parentKey) {
			case 'repositories':
				return vscode.SymbolKind.Module;
			case 'registries':
				return vscode.SymbolKind.Module;
			case 'releases':
				return vscode.SymbolKind.Class;
			case 'monitors':
				return vscode.SymbolKind.Interface;
			default:
				return vscode.SymbolKind.Object;
		}
	}

	private findKeyPosition(document: vscode.TextDocument, key: string, parentKey?: string): vscode.Range | undefined {
		const text = document.getText();
		const lines = text.split('\n');

		let inParentSection = !parentKey;
		let parentIndent = 0;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmedLine = line.trim();

			if (!inParentSection && parentKey) {
				// Look for parent section
				if (trimmedLine.startsWith(`${parentKey}:`)) {
					inParentSection = true;
					parentIndent = line.length - line.trimStart().length;
					continue;
				}
			}

			if (inParentSection) {
				// Check if we've left the parent section
				if (parentKey && trimmedLine && !line.startsWith(' ') && line.length - line.trimStart().length <= parentIndent) {
					if (!trimmedLine.startsWith(`${parentKey}:`)) {
						break;
					}
				}

				// Look for the key
				const keyPattern = new RegExp(`^(\\s*)${this.escapeRegex(key)}:\\s*`);
				const match = line.match(keyPattern);
				if (match) {
					const startCol = match[1].length;
					const endCol = startCol + key.length;
					return new vscode.Range(i, startCol, i, endCol);
				}
			}
		}

		return undefined;
	}

	private findArrayItemPosition(document: vscode.TextDocument, parentKey: string, itemIndex: number): vscode.Range | undefined {
		const text = document.getText();
		const lines = text.split('\n');

		let inParentSection = false;
		let parentIndent = 0;
		let itemCount = 0;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmedLine = line.trim();

			if (!inParentSection) {
				// Look for parent section
				if (trimmedLine.startsWith(`${parentKey}:`)) {
					inParentSection = true;
					parentIndent = line.length - line.trimStart().length;
					continue;
				}
			} else {
				// Check if we've left the parent section
				if (trimmedLine && !line.startsWith(' ') && line.length - line.trimStart().length <= parentIndent) {
					break;
				}

				// Look for array items (lines starting with -)
				if (trimmedLine.startsWith('- ')) {
					if (itemCount === itemIndex) {
						const startCol = line.indexOf('-');
						return new vscode.Range(i, startCol, i, line.length);
					}
					itemCount++;
				}
			}
		}

		return undefined;
	}

	private escapeRegex(str: string): string {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}
}
