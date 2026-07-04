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
    return buildTypeCheckedLayer(rootDir, preset, projectService, files);
  }

  const needsParserOverlay =
    rootDir !== undefined || projectService !== undefined;

  if (!needsParserOverlay) {
    return getSyntaxPreset(preset);
  }

  return [
    ...getSyntaxPreset(preset),
    {
      files,
      languageOptions: buildParserLanguageOptions(rootDir, projectService),
    },
  ];
}

function buildTypeCheckedLayer(
  rootDir: string | undefined,
  preset: TypeScriptPreset,
  projectService: NormalizedProjectService,
  files: string[],
): FlatConfig {
  return [
    {
      extends: getTypeCheckedPresetConfig(preset),
      files,
      languageOptions: buildParserLanguageOptions(rootDir, projectService),
    } as Config,
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
