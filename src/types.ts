import type { Config } from 'eslint/config';

import type {
  ProjectServiceOptions,
  TypeScriptOptionsInput,
  TypeScriptPreset,
} from '@/internal/create-config-schema';

export type { ProjectServiceOptions, TypeScriptPreset };

export type BaseOptions = {
  ignores?: string[];
};
export type { Config };

export type CreateConfigOptions = {
  ignores?: string[];
  /** eslint-plugin-react — not implemented yet */
  react?: boolean | ReactOptions;
  /**
   * Directory of this eslint.config.ts (`import.meta.dirname`).
   * Required in monorepos with nested eslint.config.* files.
   */
  rootDir?: string;
  /** `true` ≡ `{ preset: 'recommended', projectService: true }` */
  typescript?: boolean | TypeScriptOptions;
  /** eslint-plugin-vue — not implemented yet */
  vue?: boolean | VueOptions;
};

export type FlatConfig = Config[];

export type ReactOptions = {
  preset?: ReactPreset;
};

export type ReactPreset = 'jsx-runtime' | 'recommended';

export type RulesConfig = NonNullable<Config['rules']>;

export type TypeScriptContext = Record<
  TypeScriptPreset,
  (options?: TypeScriptScopeOptions) => FlatConfig
>;

export type TypeScriptContextOptions = {
  rootDir?: string;
};

export type TypeScriptOptions = TypeScriptOptionsInput;

export type TypeScriptScopeOptions = {
  files?: string[];
  ignores?: string[];
  projectService?: ProjectServiceOptions;
  rules?: RulesConfig;
};

export type VueOptions = {
  preset?: VuePreset;
};

export type VuePreset = 'essential' | 'recommended' | 'strongly-recommended';
