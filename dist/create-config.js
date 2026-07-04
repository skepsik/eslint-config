import { defineConfig } from 'eslint/config';
import { base, buildDefaultTypeScriptLayer, buildTypeScriptPresetLayer, createTypeScriptContext, prettier, stylistic, } from './layers/index.js';
export function assertFrameworksNotImplemented(options) {
    if (options.vue) {
        throw new Error('createConfig({ vue }) is not implemented yet');
    }
    if (options.react) {
        throw new Error('createConfig({ react }) is not implemented yet');
    }
}
export function buildTypeScriptLayers(rootDir, typescript) {
    if (typescript === undefined) {
        if (rootDir === undefined) {
            return buildDefaultTypeScriptLayer();
        }
        return createTypeScriptContext({ rootDir }).recommended();
    }
    const scope = {
        ...(typescript.files !== undefined && { files: typescript.files }),
        ...(typescript.ignores !== undefined && { ignores: typescript.ignores }),
        ...(typescript.projectService !== undefined && {
            projectService: typescript.projectService,
        }),
    };
    if (rootDir !== undefined) {
        const ts = createTypeScriptContext({ rootDir });
        if (typescript.preset === 'strict') {
            return ts.strict(scope);
        }
        return ts.recommended(scope);
    }
    return buildTypeScriptPresetLayer(rootDir, typescript.preset, scope);
}
export function createConfig(options = {}, ...overrides) {
    assertFrameworksNotImplemented(options);
    const typescript = normalizeTypeScriptOptions(options.typescript);
    return defineConfig([
        ...base({ ignores: options.ignores }),
        ...buildTypeScriptLayers(options.rootDir, typescript),
        ...stylistic(),
        ...overrides,
        ...prettier(),
    ]);
}
export function normalizeTypeScriptOptions(typescript) {
    if (typescript === undefined) {
        return undefined;
    }
    if (typescript === true) {
        return {
            preset: 'recommended',
            projectService: true,
        };
    }
    if (typeof typescript !== 'object') {
        throw new Error('createConfig({ typescript: false }) is invalid — omit typescript instead');
    }
    if (Object.keys(typescript).length === 0) {
        throw new Error('createConfig({ typescript: {} }) is invalid — omit typescript or pass preset/projectService');
    }
    return {
        preset: typescript.preset ?? 'recommended',
        ...(typescript.files !== undefined && { files: typescript.files }),
        ...(typescript.ignores !== undefined && { ignores: typescript.ignores }),
        ...(typescript.projectService !== undefined && {
            projectService: typescript.projectService,
        }),
    };
}
