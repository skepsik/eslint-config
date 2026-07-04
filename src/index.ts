export { createConfig } from '@/create-config';

export {
  base,
  buildDefaultTypeScriptLayer,
  buildTypeScriptPresetLayer,
  prettier,
  stylistic,
  stylisticTypeAware,
} from '@/layers/index';
export { createTypeScriptContext } from '@/layers/typescript/context';

export type {
  BaseOptions,
  CreateConfigOptions,
  FlatConfig,
  ProjectServiceOptions,
  ReactOptions,
  ReactPreset,
  RulesConfig,
  TypeScriptContext,
  TypeScriptContextOptions,
  TypeScriptOptions,
  TypeScriptPreset,
  TypeScriptScopeOptions,
  VueOptions,
  VuePreset,
} from '@/types';

export type { Config } from '@/types';
