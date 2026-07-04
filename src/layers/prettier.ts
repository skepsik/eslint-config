import eslintConfigPrettier from 'eslint-config-prettier';

import type { FlatConfig } from '@/types';

export function prettier(): FlatConfig {
  return [eslintConfigPrettier];
}
