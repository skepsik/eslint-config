import type { ProjectServiceOptions, RulesConfig, TypeScriptOptions, TypeScriptPreset } from '../types.js';
export declare function assertProjectServiceOptions(value: unknown, source?: string): ProjectServiceOptions;
export declare function assertRulesConfig(value: unknown, source?: string): RulesConfig;
export declare function assertStringArray(value: unknown, field: string, source?: string): string[];
export declare function assertTypeScriptPreset(preset: unknown, source?: string): TypeScriptPreset;
export declare function validateTypeScriptOptions(typescript: TypeScriptOptions): TypeScriptOptions;
//# sourceMappingURL=validate-typescript-options.d.ts.map