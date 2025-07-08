# Helmwave VS Code Extension

Comprehensive syntax highlighting, validation, auto-completion, and language support for Helmwave configuration files in Visual Studio Code.

## Features

This extension provides comprehensive language support for [Helmwave](https://helmwave.github.io/) configuration files:

- **🎨 Enhanced Syntax Highlighting** - Beautiful, colorful syntax highlighting with semantic scoping
- **⚡ Real-time Validation** - Instant error detection and validation feedback  
- **🎯 Auto-completion** - Intelligent IntelliSense for Helmwave structure and properties
- **🔧 Quick Fixes** - Automatic fixes for common configuration errors
- **📋 Document Outline** - Navigate your configuration with structured outline view
- **🎪 File Associations** - Automatic detection of Helmwave files (`helmwave.yml`, `*_helmwave.yml`)

### Enhanced Syntax Highlighting

The extension features advanced syntax highlighting with:

- **Semantic coloring** for different property types (required, auth, config, file)
- **Special formatting** for URLs, chart references, versions, and durations
- **Visual distinction** between root sections, properties, and values
- **Colorful arrays and objects** with enhanced YAML structure highlighting
- **Environment variables** and placeholder highlighting
- **Command and status** recognition with appropriate coloring

### Auto-Completion & IntelliSense

Intelligent auto-completion for:

- 🎯 **Top-level sections**: project, version, repositories, releases, monitors, lifecycle
- 🎯 **Repository configuration**: name, url, username, password, certificates  
- 🎯 **Release configuration**: name, chart, namespace, values, dependencies
- 🎯 **Monitor configuration**: http, prometheus types with proper structure
- 🎯 **Lifecycle hooks**: pre_build, post_build, pre_up, post_up, etc.

### Validation & Error Detection

Real-time validation catches:

- ❌ **Missing required fields** (project, name, chart, url)
- ❌ **Invalid YAML syntax** and structure errors
- ❌ **Malformed URLs** and version constraints  
- ❌ **Type mismatches** (array vs object, incorrect data types)
- ⚠️ **Unknown configuration keys** and deprecated fields
- ⚠️ **Missing recommended fields** for better configuration

### Quick Fixes & Code Actions

Automatic quick fixes for:

- ⚡ **Add missing required fields** with proper structure
- ⚡ **Insert template sections** for releases, repositories, monitors
- ⚡ **Fix common configuration mistakes** and typos

## Supported File Patterns

The extension automatically activates for:

- `helmwave.yml` / `helmwave.yaml`
- `*_helmwave.yml` / `*_helmwave.yaml`
- `*helmwave.yml` / `*helmwave.yaml`

## Commands

- **Helmwave: Validate Configuration** (`helmwave.validate`) - Manual validation

Access via Command Palette (`Ctrl+Shift+P`) or right-click context menu.

## Installation

1. Install from VS Code Extensions Marketplace(TBD)
2. Open any Helmwave configuration file
3. Enjoy enhanced syntax highlighting and validation!

## Usage

### Automatic Features

The extension automatically:
- **Validates on file open and save** with real-time feedback
- **Provides auto-completion** as you type
- **Highlights syntax** with beautiful, semantic coloring
- **Shows document outline** in the Explorer panel

### Manual Validation

1. Open a Helmwave configuration file
2. Press `Ctrl+Shift+P` → "Helmwave: Validate Configuration"
3. View errors in the Problems panel

## Development

### Building from Source

```bash
npm install
npm run compile
```

### Testing

The extension includes comprehensive test files:
- `test_enhanced_syntax.yml` - Showcases syntax highlighting features
- `test_fixes.yml` - Tests for syntax parsing edge cases

## Architecture

The extension uses a modular architecture:

- **Syntax highlighting**: TextMate grammar with enhanced semantic scoping
- **Validation**: Real-time YAML and Helmwave schema validation
- **Providers**: Completion, code actions, and document symbols
- **Utilities**: File detection, position mapping, and YAML parsing

See `REFACTORING_SUMMARY.md` and `ENHANCED_SYNTAX_HIGHLIGHTING.md` for detailed information.

## Requirements

No additional dependencies required. Works out of the box with VS Code.

## Release Notes

### 0.1.0

- ✨ Enhanced syntax highlighting with semantic coloring
- ✨ Modular architecture with improved maintainability  
- ✨ Real-time validation with precise error positioning
- ✨ Auto-completion for all Helmwave configuration elements
- ✨ Quick fixes and code actions
- ✨ Document outline and symbol navigation
- 🐛 Fixed string parsing issues with colons in values
- 🐛 Fixed URL and chart reference color consistency
- 🐛 Improved array item property highlighting

---

**Enjoy enhanced Helmwave development with VS Code!** 🎉
