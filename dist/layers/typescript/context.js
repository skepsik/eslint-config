import { buildTypeScriptPresetLayer } from './build.js';
export function createTypeScriptContext(options) {
    const { rootDir } = options;
    return {
        recommended(scope = {}) {
            return buildTypeScriptPresetLayer(rootDir, 'recommended', scope);
        },
        strict(scope = {}) {
            return buildTypeScriptPresetLayer(rootDir, 'strict', scope);
        },
    };
}
