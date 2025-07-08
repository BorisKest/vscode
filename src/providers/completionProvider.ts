import * as vscode from 'vscode';
import { isAtRootLevel, getCurrentSection } from '../utils/positionUtils';

/**
 * Provides auto-completion for Helmwave configuration files
 */
export class HelmwaveCompletionProvider implements vscode.CompletionItemProvider {
    
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        // Provide top-level completions
        if (isAtRootLevel(document, position)) {
            return this.getTopLevelCompletions();
        }

        // Provide section-specific completions
        const section = getCurrentSection(document, position);
        switch (section) {
            case 'repositories':
                return this.getRepositoryCompletions();
            case 'releases':
                return this.getReleaseCompletions();
            case 'registries':
                return this.getRegistryCompletions();
            case 'monitors':
                return this.getMonitorCompletions();
            case 'lifecycle':
                return this.getLifecycleCompletions();
            default:
                return [];
        }
    }

    private getTopLevelCompletions(): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];

        const project = new vscode.CompletionItem('project', vscode.CompletionItemKind.Property);
        project.detail = 'Project name (required)';
        project.insertText = new vscode.SnippetString('project: "${1:my-project}"');
        items.push(project);

        const version = new vscode.CompletionItem('version', vscode.CompletionItemKind.Property);
        version.detail = 'Helmwave version constraint';
        version.insertText = new vscode.SnippetString('version: "${1:>=0.30.0}"');
        items.push(version);

        const repositories = new vscode.CompletionItem('repositories', vscode.CompletionItemKind.Property);
        repositories.detail = 'Helm chart repositories';
        repositories.insertText = new vscode.SnippetString(`repositories:\n  - name: \${1:stable}\n    url: \${2:https://charts.helm.sh/stable}`);
        items.push(repositories);

        const releases = new vscode.CompletionItem('releases', vscode.CompletionItemKind.Property);
        releases.detail = 'Helm releases configuration';
        releases.insertText = new vscode.SnippetString(`releases:\n  - name: \${1:my-release}\n    chart: \${2:chart-name}\n    namespace: \${3:default}`);
        items.push(releases);

        const registries = new vscode.CompletionItem('registries', vscode.CompletionItemKind.Property);
        registries.detail = 'OCI registries';
        registries.insertText = new vscode.SnippetString(`registries:\n  - host: \${1:registry.example.com}`);
        items.push(registries);

        const monitors = new vscode.CompletionItem('monitors', vscode.CompletionItemKind.Property);
        monitors.detail = 'Monitoring configurations';
        monitors.insertText = new vscode.SnippetString(`monitors:\n  - name: \${1:health-check}\n    type: http\n    http:\n      url: \${2:https://example.com/health}`);
        items.push(monitors);

        const lifecycle = new vscode.CompletionItem('lifecycle', vscode.CompletionItemKind.Property);
        lifecycle.detail = 'Hook configurations';
        lifecycle.insertText = new vscode.SnippetString(`lifecycle:\n  pre_build:\n    - \${1:echo "Starting build"}`);
        items.push(lifecycle);

        return items;
    }

    private getRepositoryCompletions(): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];

        const name = new vscode.CompletionItem('name', vscode.CompletionItemKind.Property);
        name.detail = 'Repository name (required)';
        name.insertText = new vscode.SnippetString('name: "${1:repo-name}"');
        items.push(name);

        const url = new vscode.CompletionItem('url', vscode.CompletionItemKind.Property);
        url.detail = 'Repository URL (required)';
        url.insertText = new vscode.SnippetString('url: "${1:https://charts.helm.sh/stable}"');
        items.push(url);

        const username = new vscode.CompletionItem('username', vscode.CompletionItemKind.Property);
        username.detail = 'Repository username';
        username.insertText = new vscode.SnippetString('username: "${1:username}"');
        items.push(username);

        const password = new vscode.CompletionItem('password', vscode.CompletionItemKind.Property);
        password.detail = 'Repository password';
        password.insertText = new vscode.SnippetString('password: "${1:password}"');
        items.push(password);

        return items;
    }

    private getReleaseCompletions(): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];

        const name = new vscode.CompletionItem('name', vscode.CompletionItemKind.Property);
        name.detail = 'Release name (required)';
        name.insertText = new vscode.SnippetString('name: "${1:release-name}"');
        items.push(name);

        const chart = new vscode.CompletionItem('chart', vscode.CompletionItemKind.Property);
        chart.detail = 'Helm chart (required)';
        chart.insertText = new vscode.SnippetString('chart: "${1:chart-name}"');
        items.push(chart);

        const namespace = new vscode.CompletionItem('namespace', vscode.CompletionItemKind.Property);
        namespace.detail = 'Kubernetes namespace (required)';
        namespace.insertText = new vscode.SnippetString('namespace: "${1:default}"');
        items.push(namespace);

        const values = new vscode.CompletionItem('values', vscode.CompletionItemKind.Property);
        values.detail = 'Helm values files';
        values.insertText = new vscode.SnippetString(`values:\n  - \${1:values.yaml}`);
        items.push(values);

        return items;
    }

    private getRegistryCompletions(): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];

        const host = new vscode.CompletionItem('host', vscode.CompletionItemKind.Property);
        host.detail = 'Registry host (required)';
        host.insertText = new vscode.SnippetString('host: "${1:registry.example.com}"');
        items.push(host);

        const username = new vscode.CompletionItem('username', vscode.CompletionItemKind.Property);
        username.detail = 'Registry username';
        username.insertText = new vscode.SnippetString('username: "${1:username}"');
        items.push(username);

        const password = new vscode.CompletionItem('password', vscode.CompletionItemKind.Property);
        password.detail = 'Registry password';
        password.insertText = new vscode.SnippetString('password: "${1:password}"');
        items.push(password);

        return items;
    }

    private getMonitorCompletions(): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];

        const name = new vscode.CompletionItem('name', vscode.CompletionItemKind.Property);
        name.detail = 'Monitor name (required)';
        name.insertText = new vscode.SnippetString('name: "${1:monitor-name}"');
        items.push(name);

        const type = new vscode.CompletionItem('type', vscode.CompletionItemKind.Property);
        type.detail = 'Monitor type (required)';
        type.insertText = new vscode.SnippetString('type: ${1|http,prometheus|}');
        items.push(type);

        const http = new vscode.CompletionItem('http', vscode.CompletionItemKind.Property);
        http.detail = 'HTTP monitor configuration';
        http.insertText = new vscode.SnippetString(`http:\n  url: \${1:https://example.com/health}\n  method: \${2|GET,POST,PUT,DELETE|}\n  expected_codes: [\${3:200}]`);
        items.push(http);

        const prometheus = new vscode.CompletionItem('prometheus', vscode.CompletionItemKind.Property);
        prometheus.detail = 'Prometheus monitor configuration';
        prometheus.insertText = new vscode.SnippetString(`prometheus:\n  url: \${1:http://prometheus:9090}\n  expr: \${2:up{job="web"} == 1}`);
        items.push(prometheus);

        return items;
    }

    private getLifecycleCompletions(): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];

        const preBuild = new vscode.CompletionItem('pre_build', vscode.CompletionItemKind.Property);
        preBuild.detail = 'Pre-build hooks';
        preBuild.insertText = new vscode.SnippetString(`pre_build:\n  - \${1:echo "Pre-build hook"}`);
        items.push(preBuild);

        const postBuild = new vscode.CompletionItem('post_build', vscode.CompletionItemKind.Property);
        postBuild.detail = 'Post-build hooks';
        postBuild.insertText = new vscode.SnippetString(`post_build:\n  - \${1:echo "Post-build hook"}`);
        items.push(postBuild);

        const preDeploy = new vscode.CompletionItem('pre_deploy', vscode.CompletionItemKind.Property);
        preDeploy.detail = 'Pre-deploy hooks';
        preDeploy.insertText = new vscode.SnippetString(`pre_deploy:\n  - \${1:echo "Pre-deploy hook"}`);
        items.push(preDeploy);

        const postDeploy = new vscode.CompletionItem('post_deploy', vscode.CompletionItemKind.Property);
        postDeploy.detail = 'Post-deploy hooks';
        postDeploy.insertText = new vscode.SnippetString(`post_deploy:\n  - \${1:echo "Post-deploy hook"}`);
        items.push(postDeploy);

        return items;
    }
}
