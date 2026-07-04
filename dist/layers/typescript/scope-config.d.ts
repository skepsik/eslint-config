import type { ConfigWithExtends } from '@eslint/config-helpers';
import type { Config } from 'eslint/config';
import type { TypeScriptPreset, TypeScriptScopeOptions } from '../../types.js';
export declare function buildScopeConfig(rootDir: string | undefined, options: TypeScriptScopeOptions): Config;
export declare function buildTypeCheckedScopeConfig(rootDir: string | undefined, preset: TypeScriptPreset, options: TypeScriptScopeOptions): ConfigWithExtends;
//# sourceMappingURL=scope-config.d.ts.map