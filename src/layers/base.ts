import eslint from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';

import type { BaseOptions, FlatConfig } from '@/types';

export function base(options: BaseOptions = {}): FlatConfig {
  const ignores = options.ignores ?? [];

  return [
    {
      ignores: ['**/dist/**', ...ignores],
    },
    eslint.configs.recommended,
    perfectionist.configs['recommended-natural'],
  ];
}
