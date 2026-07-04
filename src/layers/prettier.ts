import eslintConfigPrettier from 'eslint-config-prettier';

import type { FlatConfig } from '@/types.js';

export function prettier(): FlatConfig {
  return [eslintConfigPrettier];
}
