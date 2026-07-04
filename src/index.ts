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

export type TypedOptions = {
  allowDefaultProject?: string[];
};

export type CreateConfigOptions = {
  /**
   * Directory of this eslint.config.ts (`import.meta.dirname`).
   * Required in monorepos with nested eslint.config.* files.
   */
  rootDir?: string;
  typed?: boolean | TypedOptions;
  /** eslint-plugin-vue — not implemented yet */
  vue?: boolean;
  ignores?: string[];
};

type ParserOptions = {
  projectService?: {
    allowDefaultProject?: string[];
    defaultProject: string;
  };
  tsconfigRootDir?: string;
};

function normalizeTypedOptions(
  typed: CreateConfigOptions['typed'],
): TypedOptions | undefined {
  if (!typed) {
    return undefined;
  }

  if (typed === true) {
    return {};
  }

  return typed;
}

function buildProjectService(typed: TypedOptions) {
  const projectService: NonNullable<ParserOptions['projectService']> = {
    defaultProject,
  };

  if (typed.allowDefaultProject !== undefined) {
    projectService.allowDefaultProject = typed.allowDefaultProject;
  }

  return projectService;
}

function buildParserLanguageOptions(
  rootDir?: string,
  typed?: TypedOptions,
): NonNullable<Config['languageOptions']> {
  const parserOptions: ParserOptions = {};

  if (rootDir !== undefined) {
    parserOptions.tsconfigRootDir = rootDir;
  }

  if (typed !== undefined) {
    parserOptions.projectService = buildProjectService(typed);
  }

  return { parserOptions };
}

function buildTypedTypeScriptConfigs(
  rootDir: string | undefined,
  typed: TypedOptions,
) {
  return [
    {
      extends: tseslint.configs.recommendedTypeChecked,
      files: tsFiles,
      languageOptions: buildParserLanguageOptions(rootDir, typed),
    },
  ];
}

function buildSyntaxTypeScriptConfigs(rootDir: string | undefined) {
  if (rootDir === undefined) {
    return [...tseslint.configs.recommended];
  }

  return [
    ...tseslint.configs.recommended,
    {
      files: tsFiles,
      languageOptions: buildParserLanguageOptions(rootDir),
    },
  ];
}

function buildTypeScriptConfigs(
  rootDir: string | undefined,
  typed: TypedOptions | undefined,
) {
  if (typed !== undefined) {
    return buildTypedTypeScriptConfigs(rootDir, typed);
  }

  return buildSyntaxTypeScriptConfigs(rootDir);
}

export function createConfig(
  options: CreateConfigOptions = {},
  ...overrides: Config[]
): Config[] {
  if (options.vue) {
    throw new Error(
      'createConfig({ vue: true }) is not implemented yet',
    );
  }

  const typedOptions = normalizeTypedOptions(options.typed);
  const ignores = options.ignores ?? [];

  return defineConfig([
    {
      ignores: ['**/dist/**', ...ignores],
    },
    eslint.configs.recommended,
    ...buildTypeScriptConfigs(options.rootDir, typedOptions),
    perfectionist.configs['recommended-natural'],
    stylisticRules,
    ...overrides,
    eslintConfigPrettier,
  ]);
}
