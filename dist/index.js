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
function normalizeTypedOptions(typed) {
    if (!typed) {
        return undefined;
    }
    if (typed === true) {
        return {};
    }
    return typed;
}
function buildProjectService(typed) {
    const projectService = {
        defaultProject,
    };
    if (typed.allowDefaultProject !== undefined) {
        projectService.allowDefaultProject = typed.allowDefaultProject;
    }
    return projectService;
}
function buildParserLanguageOptions(options) {
    const { rootDir, typed } = options;
    if (!rootDir && !typed) {
        return undefined;
    }
    const parserOptions = {};
    if (rootDir) {
        parserOptions.tsconfigRootDir = rootDir;
    }
    if (typed) {
        parserOptions.projectService = buildProjectService(typed);
    }
    return { parserOptions };
}
export function createConfig(options = {}, ...overrides) {
    if (options.vue) {
        throw new Error('createConfig({ vue: true }) is not implemented yet');
    }
    const typedOptions = normalizeTypedOptions(options.typed);
    const ignores = options.ignores ?? [];
    const parserLanguageOptions = buildParserLanguageOptions({
        rootDir: options.rootDir,
        typed: typedOptions,
    });
    const typescriptConfigs = typedOptions
        ? [
            {
                extends: tseslint.configs.recommendedTypeChecked,
                files: tsFiles,
                ...(parserLanguageOptions && {
                    languageOptions: parserLanguageOptions,
                }),
            },
        ]
        : parserLanguageOptions
            ? [
                ...tseslint.configs.recommended,
                {
                    files: tsFiles,
                    languageOptions: parserLanguageOptions,
                },
            ]
            : tseslint.configs.recommended;
    return defineConfig([
        {
            ignores: ['**/dist/**', ...ignores],
        },
        eslint.configs.recommended,
        ...typescriptConfigs,
        perfectionist.configs['recommended-natural'],
        stylisticRules,
        ...overrides,
        eslintConfigPrettier,
    ]);
}
