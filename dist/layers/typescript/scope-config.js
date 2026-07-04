import tseslint from 'typescript-eslint';
import { tsFiles } from '../../internal/constants.js';
import { buildParserLanguageOptions, normalizeProjectService, } from '../../internal/project-service.js';
const typeCheckedPresetName = {
    recommended: 'recommendedTypeChecked',
    strict: 'strictTypeChecked',
};
export function buildScopeConfig(rootDir, options) {
    const files = options.files ?? tsFiles;
    const projectService = options.projectService !== undefined
        ? normalizeProjectService(options.projectService)
        : undefined;
    const config = {
        files,
    };
    if (rootDir !== undefined || projectService !== undefined) {
        config.languageOptions = buildParserLanguageOptions(rootDir, projectService);
    }
    if (options.ignores !== undefined) {
        config.ignores = options.ignores;
    }
    if (options.rules !== undefined) {
        config.rules = options.rules;
    }
    return config;
}
export function buildTypeCheckedScopeConfig(rootDir, preset, options) {
    return {
        extends: tseslint.configs[typeCheckedPresetName[preset]],
        ...buildScopeConfig(rootDir, options),
    };
}
