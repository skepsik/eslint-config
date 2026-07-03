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

export type CreateConfigOptions = {
  typed?: {
    tsconfigRootDir: string;
    /**
     * Globs for TS files outside tsconfig that use defaultProject.
     * Must not match files already included in any tsconfig (e.g. vite.config.ts).
     */
    allowDefaultProject?: string[];
  };
  /** eslint-plugin-vue — not implemented yet */
  vue?: boolean;
  ignores?: string[];
};

export function createConfig(
  options: CreateConfigOptions = {},
  ...overrides: Config[]
): Config[] {
  if (options.vue) {
    throw new Error(
      'createConfig({ vue: true }) is not implemented yet',
    );
  }

  const { typed, ignores = [] } = options;

  const typedLanguageOptions = typed
    ? {
        languageOptions: {
          parserOptions: {
            projectService: {
              ...(typed.allowDefaultProject && {
                allowDefaultProject: typed.allowDefaultProject,
              }),
              defaultProject,
            },
            tsconfigRootDir: typed.tsconfigRootDir,
          },
        },
      }
    : {};

  return defineConfig([
    {
      ignores: ['**/dist/**', ...ignores],
    },
    eslint.configs.recommended,
    ...(typed
      ? [
          {
            files: tsFiles,
            extends: tseslint.configs.recommendedTypeChecked,
            ...typedLanguageOptions,
          },
        ]
      : tseslint.configs.recommended),
    perfectionist.configs['recommended-natural'],
    stylisticRules,
    ...overrides,
    eslintConfigPrettier,
  ]);
}
