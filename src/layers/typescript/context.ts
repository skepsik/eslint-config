import type {
  FlatConfig,
  TypeScriptContext,
  TypeScriptContextOptions,
  TypeScriptScopeOptions,
} from '@/types';

import { buildTypeScriptPresetLayer } from './build';

export function createTypeScriptContext(
  options: TypeScriptContextOptions,
): TypeScriptContext {
  const { rootDir } = options;

  return {
    recommended(scope: TypeScriptScopeOptions = {}): FlatConfig {
      return buildTypeScriptPresetLayer(rootDir, 'recommended', scope);
    },
    strict(scope: TypeScriptScopeOptions = {}): FlatConfig {
      return buildTypeScriptPresetLayer(rootDir, 'strict', scope);
    },
  };
}
