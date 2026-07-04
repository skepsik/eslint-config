import type { Config } from 'eslint/config';

import type { ProjectServiceOptions } from '@/types';

import { defaultProject } from '@/internal/constants';

export type NormalizedProjectService = {
  allowDefaultProject?: string[];
  typeChecked: boolean;
};

type ParserOptions = {
  projectService?: {
    allowDefaultProject?: string[];
    defaultProject: string;
  };
  tsconfigRootDir?: string;
};

export function buildParserLanguageOptions(
  rootDir: string | undefined,
  projectService?: NormalizedProjectService,
): NonNullable<Config['languageOptions']> {
  const parserOptions: ParserOptions = {};

  if (rootDir !== undefined) {
    parserOptions.tsconfigRootDir = rootDir;
  }

  if (projectService !== undefined) {
    parserOptions.projectService = buildProjectService(projectService);
  }

  return { parserOptions };
}

export function normalizeProjectService(
  projectService: ProjectServiceOptions,
): NormalizedProjectService {
  if (projectService === true) {
    return { typeChecked: false };
  }

  return {
    typeChecked: projectService.typeChecked ?? false,
    ...(projectService.allowDefaultProject !== undefined && {
      allowDefaultProject: projectService.allowDefaultProject,
    }),
  };
}

function buildProjectService(projectService: NormalizedProjectService) {
  const service: NonNullable<ParserOptions['projectService']> = {
    defaultProject,
  };

  if (projectService.allowDefaultProject !== undefined) {
    service.allowDefaultProject = projectService.allowDefaultProject;
  }

  return service;
}
