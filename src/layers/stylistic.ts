import type { RulesConfig } from '@/types';

const syntaxRules = {
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
} satisfies RulesConfig;

const typeAwareRules = {
  '@typescript-eslint/consistent-type-exports': 'error',
} satisfies RulesConfig;

export function stylistic(): RulesConfig {
  return syntaxRules;
}

export function stylisticTypeAware(): RulesConfig {
  return typeAwareRules;
}
