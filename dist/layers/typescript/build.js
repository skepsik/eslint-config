import tseslint from 'typescript-eslint';
import { tsFiles } from '../../internal/constants.js';
import { buildParserLanguageOptions, normalizeProjectService, } from '../../internal/project-service.js';
export function buildDefaultTypeScriptLayer() {
    return [...tseslint.configs.recommended];
}
export function buildTypeScriptPresetLayer(rootDir, preset, options = {}) {
    return buildSyntaxLayer(rootDir, preset, options);
}
function buildSyntaxLayer(rootDir, preset, options) {
    const files = options.files ?? tsFiles;
    const projectService = options.projectService !== undefined
        ? normalizeProjectService(options.projectService)
        : undefined;
    if (projectService?.typeChecked) {
        return buildTypeCheckedLayer(rootDir, preset, projectService, files);
    }
    const needsParserOverlay = rootDir !== undefined || projectService !== undefined;
    if (!needsParserOverlay) {
        return getSyntaxPreset(preset);
    }
    return [
        ...getSyntaxPreset(preset),
        {
            files,
            languageOptions: buildParserLanguageOptions(rootDir, projectService),
        },
    ];
}
function buildTypeCheckedLayer(rootDir, preset, projectService, files) {
    return [
        {
            extends: getTypeCheckedPresetConfig(preset),
            files,
            languageOptions: buildParserLanguageOptions(rootDir, projectService),
        },
    ];
}
function getSyntaxPreset(preset) {
    return preset === 'strict'
        ? [...tseslint.configs.strict]
        : [...tseslint.configs.recommended];
}
function getTypeCheckedPresetConfig(preset) {
    return preset === 'strict'
        ? tseslint.configs.strictTypeChecked
        : tseslint.configs.recommendedTypeChecked;
}
