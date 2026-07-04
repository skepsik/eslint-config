import { fileURLToPath } from 'node:url';

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, type Config } from 'eslint/config';
import perfectionist from 'eslint-plugin-perfectionist';
import tseslint from 'typescript-eslint';

const defaultProject = fileURLToPath(
  new URL('./tsconfig.default.json', import.meta.url),
);

const tsFiles = ['**/*.{ts,tsx,mts,cts}'];

const stylisticRules: Config = {
  files: tsFiles,
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
};

export type ProjectServiceOptions =
  | true
  | {
      typeChecked?: boolean;
      allowDefaultProject?: string[];
    };

export type TypeScriptLevel = 'recommended' | 'strict';

export type TypeScriptOptions = {
  level?: TypeScriptLevel;
  projectService?: ProjectServiceOptions;
};

export type VueLevel = 'essential' | 'strongly-recommended' | 'recommended';

export type VueOptions = {
  level?: VueLevel;
};

export type ReactLevel = 'recommended' | 'jsx-runtime';

export type ReactOptions = {
  level?: ReactLevel;
};

export type CreateConfigOptions = {
  /**
   * Directory of this eslint.config.ts (`import.meta.dirname`).
   * Required in monorepos with nested eslint.config.* files.
   */
  rootDir?: string;
  ignores?: string[];
  /** `true` ≡ `{ level: 'recommended', projectService: true }` */
  typescript?: boolean | TypeScriptOptions;
  /** eslint-plugin-vue — not implemented yet */
  vue?: boolean | VueOptions;
  /** eslint-plugin-react — not implemented yet */
  react?: boolean | ReactOptions;
};

type ParserOptions = {
  projectService?: {
    allowDefaultProject?: string[];
    defaultProject: string;
  };
  tsconfigRootDir?: string;
};

type NormalizedProjectService = {
  typeChecked: boolean;
  allowDefaultProject?: string[];
};

type NormalizedTypeScriptOptions = {
  level: TypeScriptLevel;
  projectService?: NormalizedProjectService;
};

function normalizeProjectService(
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

function normalizeTypeScriptOptions(
  typescript: CreateConfigOptions['typescript'],
): NormalizedTypeScriptOptions | undefined {
  if (typescript === undefined) {
    return undefined;
  }

  if (typescript === true) {
    return {
      level: 'recommended',
      projectService: { typeChecked: false },
    };
  }

  if (typeof typescript !== 'object') {
    throw new Error(
      'createConfig({ typescript: false }) is invalid — omit typescript instead',
    );
  }

  if (Object.keys(typescript).length === 0) {
    throw new Error(
      'createConfig({ typescript: {} }) is invalid — omit typescript or pass level/projectService',
    );
  }

  const projectService =
    typescript.projectService !== undefined
      ? normalizeProjectService(typescript.projectService)
      : undefined;

  return {
    level: typescript.level ?? 'recommended',
    ...(projectService !== undefined && { projectService }),
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

function buildParserLanguageOptions(
  rootDir?: string,
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

function getTypeScriptPreset(
  level: TypeScriptLevel,
  typeChecked: boolean,
): Config[] {
  if (typeChecked) {
    return level === 'strict'
      ? [...tseslint.configs.strictTypeChecked]
      : [...tseslint.configs.recommendedTypeChecked];
  }

  return level === 'strict'
    ? [...tseslint.configs.strict]
    : [...tseslint.configs.recommended];
}

function buildTypeCheckedTypeScriptConfigs(
  rootDir: string | undefined,
  level: TypeScriptLevel,
  projectService: NormalizedProjectService,
) {
  const preset =
    level === 'strict'
      ? tseslint.configs.strictTypeChecked
      : tseslint.configs.recommendedTypeChecked;

  return [
    {
      extends: preset,
      files: tsFiles,
      languageOptions: buildParserLanguageOptions(rootDir, projectService),
    },
  ];
}

function buildSyntaxTypeScriptConfigs(
  rootDir: string | undefined,
  level: TypeScriptLevel,
  projectService?: NormalizedProjectService,
) {
  const preset = getTypeScriptPreset(level, false);

  if (rootDir === undefined && projectService === undefined) {
    return preset;
  }

  return [
    ...preset,
    {
      files: tsFiles,
      languageOptions: buildParserLanguageOptions(rootDir, projectService),
    },
  ];
}

function buildTypeScriptConfigs(
  rootDir: string | undefined,
  typescript: NormalizedTypeScriptOptions | undefined,
) {
  const level = typescript?.level ?? 'recommended';
  const projectService = typescript?.projectService;

  if (projectService?.typeChecked) {
    return buildTypeCheckedTypeScriptConfigs(rootDir, level, projectService);
  }

  return buildSyntaxTypeScriptConfigs(rootDir, level, projectService);
}

function assertNotImplemented(options: CreateConfigOptions) {
  if (options.vue) {
    throw new Error('createConfig({ vue }) is not implemented yet');
  }

  if (options.react) {
    throw new Error('createConfig({ react }) is not implemented yet');
  }
}

export function createConfig(
  options: CreateConfigOptions = {},
  ...overrides: Config[]
): Config[] {
  assertNotImplemented(options);

  const typescriptOptions = normalizeTypeScriptOptions(options.typescript);
  const ignores = options.ignores ?? [];

  return defineConfig([
    {
      ignores: ['**/dist/**', ...ignores],
    },
    eslint.configs.recommended,
    ...buildTypeScriptConfigs(options.rootDir, typescriptOptions),
    perfectionist.configs['recommended-natural'],
    stylisticRules,
    ...overrides,
    eslintConfigPrettier,
  ]);
}
