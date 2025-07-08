import * as vscode from 'vscode';

export interface HelmwaveDocument {
    project?: string;
    version?: string;
    repositories?: Repository[];
    registries?: Registry[];
    releases?: Release[];
    monitors?: Monitor[];
    lifecycle?: Lifecycle;
    [key: string]: any;
}

export interface Repository {
    name: string;
    url: string;
    username?: string;
    password?: string;
}

export interface Registry {
    host: string;
    username?: string;
    password?: string;
}

export interface Release {
    name: string;
    chart: string | ChartObject;
    namespace: string;
    values?: (string | ValuesObject)[];
    depends_on?: DependencyObject[];
    tags?: string[];
    monitors?: ReleaseMonitor[];
    pending_release_strategy?: 'rollback' | 'uninstall';
    deletion_propagation?: 'background' | 'foreground' | 'orphan';
}

export interface ChartObject {
    name: string;
    version?: string;
    repository?: string;
}

export interface ValuesObject {
    src: string;
    dst?: string;
}

export interface DependencyObject {
    name?: string;
    tag?: string;
}

export interface ReleaseMonitor {
    name: string;
}

export interface Monitor {
    name: string;
    type: 'http' | 'prometheus';
    http?: HttpMonitor;
    prometheus?: PrometheusMonitor;
}

export interface HttpMonitor {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    expected_codes: number[];
}

export interface PrometheusMonitor {
    url: string;
    expr: string;
}

export interface Lifecycle {
    pre_up?: (string | LifecycleCommand)[];
    post_up?: (string | LifecycleCommand)[];
    pre_down?: (string | LifecycleCommand)[];
    post_down?: (string | LifecycleCommand)[];
    pre_build?: (string | LifecycleCommand)[];
    post_build?: (string | LifecycleCommand)[];
    pre_rollback?: (string | LifecycleCommand)[];
    post_rollback?: (string | LifecycleCommand)[];
}

export interface LifecycleCommand {
    cmd: string;
    args?: string[];
    show?: boolean;
}

export interface KeyPosition {
    line: number;
    keyStart: number;
    keyEnd: number;
    valueStart: number;
    valueEnd: number;
}

export interface ValidationContext {
    document: vscode.TextDocument;
    yamlDoc: HelmwaveDocument;
    lines: string[];
    diagnostics: vscode.Diagnostic[];
}
