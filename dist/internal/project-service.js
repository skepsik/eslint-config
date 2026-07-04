import { defaultProject } from '../internal/constants.js';
export function buildParserLanguageOptions(rootDir, projectService) {
    const parserOptions = {};
    if (rootDir !== undefined) {
        parserOptions.tsconfigRootDir = rootDir;
    }
    if (projectService !== undefined) {
        parserOptions.projectService = buildProjectService(projectService);
    }
    return { parserOptions };
}
export function normalizeProjectService(projectService) {
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
function buildProjectService(projectService) {
    const service = {
        defaultProject,
    };
    if (projectService.allowDefaultProject !== undefined) {
        service.allowDefaultProject = projectService.allowDefaultProject;
    }
    return service;
}
