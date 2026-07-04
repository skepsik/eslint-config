import type { Config } from 'eslint/config';

import type { FlatConfig, StylisticOptions } from '@/types.js';

import { tsFiles } from '@/internal/constants.js';

const stylisticRules: Config = {
  files: tsFiles,
  rules: {
    '@typescript-eslint/consistent-type-exports': 'error',
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

export function stylistic(options: StylisticOptions = {}): FlatConfig {
  const files = options.files ?? tsFiles;

  if (files === tsFiles) {
    return [stylisticRules];
  }

  return [
    {
      ...stylisticRules,
      files,
    },
  ];
}
