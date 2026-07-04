import type { ConfigWithExtends } from '@eslint/config-helpers';
import type { Config } from 'eslint/config';

import tseslint from 'typescript-eslint';

import type {
  FlatConfig,
  TypeScriptPreset,
  TypeScriptScopeOptions,
} from '@/types';

import { tsFiles } from '@/internal/constants';
import {
  buildParserLanguageOptions,
  normalizeProjectService,
} from '@/internal/project-service';

const typeCheckedPresetName = {
  recommended: 'recommendedTypeChecked',
  strict: 'strictTypeChecked',
} as const satisfies Record<TypeScriptPreset, keyof typeof tseslint.configs>;

export function buildDefaultTypeScriptLayer(): FlatConfig {
  return [...tseslint.configs.recommended];
}

export function buildTypeScriptPresetLayer(
  rootDir: string | undefined,
  preset: TypeScriptPreset,
  options: TypeScriptScopeOptions = {},
): FlatConfig {
  const projectService =
    options.projectService !== undefined
      ? normalizeProjectService(options.projectService)
      : undefined;

  if (projectService?.typeChecked) {
    return [buildTypeCheckedScopeConfig(rootDir, preset, options)];
  }

  const needsScopeOverlay =
    rootDir !== undefined ||
    projectService !== undefined ||
    options.rules !== undefined ||
    options.ignores !== undefined ||
    options.files !== undefined;

  return needsScopeOverlay
    ? [...tseslint.configs[preset], buildScopeConfig(rootDir, options)]
    : [...tseslint.configs[preset]];
}

function buildScopeConfig(
  rootDir: string | undefined,
  options: TypeScriptScopeOptions,
): Config {
  const files = options.files ?? tsFiles;
  const projectService =
    options.projectService !== undefined
      ? normalizeProjectService(options.projectService)
      : undefined;

  const config: Config = {
    files,
  };

  if (rootDir !== undefined || projectService !== undefined) {
    config.languageOptions = buildParserLanguageOptions(
      rootDir,
      projectService,
    );
  }

  if (options.ignores !== undefined) {
    config.ignores = options.ignores;
  }

  if (options.rules !== undefined) {
    config.rules = options.rules;
  }

  return config;
}

function buildTypeCheckedScopeConfig(
  rootDir: string | undefined,
  preset: TypeScriptPreset,
  options: TypeScriptScopeOptions,
): ConfigWithExtends {
  return {
    extends: tseslint.configs[typeCheckedPresetName[preset]],
    ...buildScopeConfig(rootDir, options),
  };
}
