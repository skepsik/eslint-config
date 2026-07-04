import type { Config } from 'eslint/config';
import type { CreateConfigOptions, FlatConfig, TypeScriptOptions, TypeScriptPreset } from './types.js';
export type NormalizedTypeScriptOptions = {
    files?: string[];
    ignores?: string[];
    preset: TypeScriptPreset;
    projectService?: TypeScriptOptions['projectService'];
};
export declare function assertFrameworksNotImplemented(options: CreateConfigOptions): void;
export declare function buildTypeScriptLayers(rootDir: string | undefined, typescript: NormalizedTypeScriptOptions | undefined): FlatConfig;
export declare function createConfig(options?: CreateConfigOptions, ...overrides: Config[]): FlatConfig;
export declare function normalizeTypeScriptOptions(typescript: CreateConfigOptions['typescript']): NormalizedTypeScriptOptions | undefined;
//# sourceMappingURL=create-config.d.ts.map