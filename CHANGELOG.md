# Change Log

All notable changes to the "helmwave" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.1.0] - 2025-07-07

### Added - New Features

- **Enhanced Auto-Completion & IntelliSense**: Comprehensive auto-completion for Helmwave configuration structure
  - Intelligent context-aware completions for all major sections (repositories, releases, registries, monitors, lifecycle)
  - Snippet-based completions with placeholders for efficient configuration authoring
  - Top-level section completions with proper indentation and structure
  - Section-specific field completions with detailed descriptions

- **Quick Fixes & Code Actions**: Automated quick fixes for common configuration errors
  - Add missing required fields (project, name, chart, url, etc.)
  - Automatic insertion of proper field structure with appropriate defaults
  - Context-aware error resolution suggestions
  - Integration with VS Code's Quick Fix system (Ctrl+. or Cmd+.)

- **Document Outline & Navigation**: Enhanced navigation and document structure
  - Structured outline view showing all Helmwave sections and their items
  - Symbol-based navigation with Ctrl+Shift+O (Cmd+Shift+O on Mac)
  - Hierarchical view of repositories, releases, registries, monitors, and lifecycle hooks
  - Quick navigation to specific configuration items
  - Breadcrumb navigation support

### Enhanced Features

- **Improved Completion Provider**: Smarter context detection and completion suggestions
- **Enhanced Error Messages**: More descriptive validation messages with better positioning
- **Better Integration**: Improved VS Code integration with native Quick Fixes and Outline view

## [0.0.1] - 2025-07-07 - Initial Release

### Added
- Initial release of Helmwave VS Code Extension
- **Syntax highlighting** for Helmwave YAML configuration files
- **Real-time syntax checking and validation** with comprehensive error detection
- Language configuration with bracket matching, commenting, and code folding
- File associations for `helmwave.yml`, `*_helmwave.yml`, and related patterns
- TextMate grammar with specialized highlighting for Helmwave keywords:
  - `project`: Project name configuration  
  - `version`: Helmwave version constraints
  - `repositories`: Helm chart repositories
  - `registries`: OCI registries
  - `releases`: Helm releases configuration
  - `monitors`: Monitoring configurations
  - `lifecycle`: Hook configurations
  - `tags`: Tag filtering
  - `values`: Helm values
- **Validation features**:
  - YAML syntax validation
  - Schema validation for Helmwave structure
  - Required field validation (project, name, chart, etc.)
  - Format validation (version format, URLs)
  - Unknown field detection with warnings
  - Type checking (arrays vs objects)
- **Command palette integration**:
  - `Helmwave: Validate Configuration` command for manual validation
- **Automatic validation**:
  - On file open, save, and during editing (with debouncing)
  - Real-time error display in Problems panel and editor
- Support for both `.yml` and `.yaml` extensions
- Complete YAML syntax support with enhanced Helmwave-specific features

### Dependencies
- Added `js-yaml` for YAML parsing and validation
- Added `@types/js-yaml` for TypeScript support