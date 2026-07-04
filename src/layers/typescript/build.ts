import type { Config } from 'eslint/config';

import tseslint from 'typescript-eslint';

import type {
  FlatConfig,
  TypeScriptPreset,
  TypeScriptScopeOptions,
} from '@/types.js';

import { tsFiles } from '@/internal/constants.js';
import {
  buildParserLanguageOptions,
  type NormalizedProjectService,
  normalizeProjectService,
} from '@/internal/project-service.js';

export function buildDefaultTypeScriptLayer(): FlatConfig {
  return [...tseslint.configs.recommended];
}

export function buildTypeScriptPresetLayer(
  rootDir: string | undefined,
  preset: TypeScriptPreset,
  options: TypeScriptScopeOptions = {},
): FlatConfig {
  return buildSyntaxLayer(rootDir, preset, options);
}

function buildSyntaxLayer(
  rootDir: string | undefined,
  preset: TypeScriptPreset,
  options: TypeScriptScopeOptions,
): FlatConfig {
  const files = options.files ?? tsFiles;
  const projectService =
    options.projectService !== undefined
      ? normalizeProjectService(options.projectService)
      : undefined;

  if (projectService?.typeChecked) {
    return buildTypeCheckedLayer(rootDir, preset, projectService, options);
  }

  const needsParserOverlay =
    rootDir !== undefined || projectService !== undefined;

  if (!needsParserOverlay) {
    return getSyntaxPreset(preset);
  }

  return [
    ...getSyntaxPreset(preset),
    scopeConfig(
      {
        files,
        languageOptions: buildParserLanguageOptions(rootDir, projectService),
      },
      options,
    ),
  ];
}

function buildTypeCheckedLayer(
  rootDir: string | undefined,
  preset: TypeScriptPreset,
  projectService: NormalizedProjectService,
  options: TypeScriptScopeOptions,
): FlatConfig {
  const files = options.files ?? tsFiles;

  return [
    scopeConfig(
      {
        extends: getTypeCheckedPresetConfig(preset),
        files,
        languageOptions: buildParserLanguageOptions(rootDir, projectService),
      } as Config,
      options,
    ),
  ];
}

function getSyntaxPreset(preset: TypeScriptPreset): FlatConfig {
  return preset === 'strict'
    ? [...tseslint.configs.strict]
    : [...tseslint.configs.recommended];
}

function getTypeCheckedPresetConfig(preset: TypeScriptPreset) {
  return preset === 'strict'
    ? tseslint.configs.strictTypeChecked
    : tseslint.configs.recommendedTypeChecked;
}

function scopeConfig(
  config: Config,
  options: TypeScriptScopeOptions,
): Config {
  if (options.ignores === undefined) {
    return config;
  }

  return {
    ...config,
    ignores: options.ignores,
  };
}
