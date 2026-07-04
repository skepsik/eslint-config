import type { Config } from 'eslint/config';

import { defineConfig } from 'eslint/config';

import type {
  CreateConfigOptions,
  FlatConfig,
  TypeScriptScopeOptions,
} from '@/types';

import {
  type NormalizedTypeScriptOptions,
  parseCreateConfigOptions,
} from '@/internal/create-config-schema';
import {
  base,
  createTypeScriptContext,
  prettier,
  stylistic,
  stylisticTypeAware,
} from '@/layers/index';

export function createConfig(
  options: CreateConfigOptions = {},
  ...overrides: Config[]
): FlatConfig {
  const { ignores, rootDir, typescript } = parseCreateConfigOptions(options);
  const ts = createTypeScriptContext({ rootDir });

  return defineConfig([
    ...base({ ignores }),
    ...buildTypeScriptLayers(ts, typescript),
    ...overrides,
    ...prettier(),
  ]);
}

function buildSugarTypeScriptScope(
  typescript: NormalizedTypeScriptOptions,
): TypeScriptScopeOptions {
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

function buildTypeScriptLayers(
  ts: ReturnType<typeof createTypeScriptContext>,
  typescript: NormalizedTypeScriptOptions | undefined,
): FlatConfig {
  if (typescript === undefined) {
    return ts.recommended({ rules: stylistic() });
  }

  return ts[typescript.preset](buildSugarTypeScriptScope(typescript));
}
