import { defineConfig } from 'eslint/config';
import { parseCreateConfigOptions, } from './internal/create-config-schema.js';
import { base, createTypeScriptContext, prettier, stylistic, stylisticTypeAware, } from './layers/index.js';
export function createConfig(options = {}, ...overrides) {
    const { ignores, rootDir, typescript } = parseCreateConfigOptions(options);
    const ts = createTypeScriptContext({ rootDir });
    return defineConfig([
        ...base({ ignores }),
        ...buildTypeScriptLayers(ts, typescript),
        ...overrides,
        ...prettier(),
    ]);
}
function buildSugarTypeScriptScope(typescript) {
    const hasTypeInfo = typescript.projectService !== undefined;
    return {
        ...(typescript.files !== undefined && { files: typescript.files }),
        ...(typescript.ignores !== undefined && { ignores: typescript.ignores }),
        ...(typescript.projectService !== undefined && {
            projectService: typescript.projectService,
        }),
        rules: {
            ...stylistic(),
            ...(hasTypeInfo ? stylisticTypeAware() : {}),
            ...typescript.rules,
        },
    };
}
function buildTypeScriptLayers(ts, typescript) {
    if (typescript === undefined) {
        return ts.recommended({ rules: stylistic() });
    }
    return ts[typescript.preset](buildSugarTypeScriptScope(typescript));
}
