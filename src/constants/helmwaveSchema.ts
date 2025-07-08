export const HELMWAVE_SCHEMA = {
    VALID_TOP_LEVEL_KEYS: [
        'project', 
        'version', 
        'repositories', 
        'registries', 
        'releases', 
        'monitors', 
        'lifecycle'
    ],
    
    VALID_LIFECYCLE_HOOKS: [
        'pre_up', 
        'post_up', 
        'pre_down', 
        'post_down', 
        'pre_build', 
        'post_build', 
        'pre_rollback', 
        'post_rollback'
    ],
    
    VALID_MONITOR_TYPES: ['http', 'prometheus'],
    
    VALID_HTTP_METHODS: ['GET', 'POST', 'PUT', 'DELETE'],
    
    VALID_PENDING_RELEASE_STRATEGIES: ['rollback', 'uninstall'],
    
    VALID_DELETION_PROPAGATIONS: ['background', 'foreground', 'orphan'],
    
    VERSION_PATTERN: /^(>=|>|<=|<|=)?\s*\d+\.\d+(\.\d+)?/
} as const;

export const FILE_PATTERNS = {
    HELMWAVE_FILES: [
        'helmwave.yml',
        'helmwave.yaml',
        '*_helmwave.yml',
        '*_helmwave.yaml',
        '*-helmwave.yml',
        '*-helmwave.yaml'
    ]
} as const;

export const DIAGNOSTIC_SOURCE = 'helmwave' as const;
