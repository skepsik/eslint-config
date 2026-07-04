import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import perfectionist from 'eslint-plugin-perfectionist';
import tseslint from 'typescript-eslint';
const defaultProject = fileURLToPath(new URL('./tsconfig.default.json', import.meta.url));
const tsFiles = ['**/*.{ts,tsx,mts,cts}'];
const stylisticRules = {
    files: tsFiles,
    rules: {
        '@typescript-eslint/consistent-type-imports': [
            'error',
            {
                disallowTypeAnnotations: true,
                fixStyle: 'separate-type-imports',
                prefer: 'type-imports',
            },
        ],
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            },
        ],
    },
};
function normalizeProjectService(projectService) {
    if (projectService === true) {
        return { typeChecked: false };
    }
    return {
        typeChecked: projectService.typeChecked ?? false,
        ...(projectService.allowDefaultProject !== undefined && {
            allowDefaultProject: projectService.allowDefaultProject,
        }),
    };
}
function normalizeTypeScriptOptions(typescript) {
    if (typescript === undefined) {
        return undefined;
    }
    if (typescript === true) {
        return {
            level: 'recommended',
            projectService: { typeChecked: false },
        };
    }
    if (typeof typescript !== 'object') {
        throw new Error('createConfig({ typescript: false }) is invalid — omit typescript instead');
    }
    if (Object.keys(typescript).length === 0) {
        throw new Error('createConfig({ typescript: {} }) is invalid — omit typescript or pass level/projectService');
    }
    const projectService = typescript.projectService !== undefined
        ? normalizeProjectService(typescript.projectService)
        : undefined;
    return {
        level: typescript.level ?? 'recommended',
        ...(projectService !== undefined && { projectService }),
    };
}
function buildProjectService(projectService) {
    const service = {
        defaultProject,
    };
    if (projectService.allowDefaultProject !== undefined) {
        service.allowDefaultProject = projectService.allowDefaultProject;
    }
    return service;
}
function buildParserLanguageOptions(rootDir, projectService) {
    const parserOptions = {};
    if (rootDir !== undefined) {
        parserOptions.tsconfigRootDir = rootDir;
    }
    if (projectService !== undefined) {
        parserOptions.projectService = buildProjectService(projectService);
    }
    return { parserOptions };
}
function getTypeScriptPreset(level, typeChecked) {
    if (typeChecked) {
        return level === 'strict'
            ? [...tseslint.configs.strictTypeChecked]
            : [...tseslint.configs.recommendedTypeChecked];
    }
    return level === 'strict'
        ? [...tseslint.configs.strict]
        : [...tseslint.configs.recommended];
}
function buildTypeCheckedTypeScriptConfigs(rootDir, level, projectService) {
    const preset = level === 'strict'
        ? tseslint.configs.strictTypeChecked
        : tseslint.configs.recommendedTypeChecked;
    return [
        {
            extends: preset,
            files: tsFiles,
            languageOptions: buildParserLanguageOptions(rootDir, projectService),
        },
    ];
}
function buildSyntaxTypeScriptConfigs(rootDir, level, projectService) {
    const preset = getTypeScriptPreset(level, false);
    if (rootDir === undefined && projectService === undefined) {
        return preset;
    }
    return [
        ...preset,
        {
            files: tsFiles,
            languageOptions: buildParserLanguageOptions(rootDir, projectService),
        },
    ];
}
function buildTypeScriptConfigs(rootDir, typescript) {
    const level = typescript?.level ?? 'recommended';
    const projectService = typescript?.projectService;
    if (projectService?.typeChecked) {
        return buildTypeCheckedTypeScriptConfigs(rootDir, level, projectService);
    }
    return buildSyntaxTypeScriptConfigs(rootDir, level, projectService);
}
function assertNotImplemented(options) {
    if (options.vue) {
        throw new Error('createConfig({ vue }) is not implemented yet');
    }
    if (options.react) {
        throw new Error('createConfig({ react }) is not implemented yet');
    }
}
export function createConfig(options = {}, ...overrides) {
    assertNotImplemented(options);
    const typescriptOptions = normalizeTypeScriptOptions(options.typescript);
    const ignores = options.ignores ?? [];
    return defineConfig([
        {
            ignores: ['**/dist/**', ...ignores],
        },
        eslint.configs.recommended,
        ...buildTypeScriptConfigs(options.rootDir, typescriptOptions),
        perfectionist.configs['recommended-natural'],
        stylisticRules,
        ...overrides,
        eslintConfigPrettier,
    ]);
}
