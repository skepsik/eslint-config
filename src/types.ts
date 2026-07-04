import type { Config } from 'eslint/config';

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

export type ProjectServiceOptions =
  | true
  | {
      allowDefaultProject?: string[];
      typeChecked?: boolean;
    };

export type ReactOptions = {
  preset?: ReactPreset;
};

export type ReactPreset = 'jsx-runtime' | 'recommended';

export type StylisticOptions = {
  files?: string[];
};

export type TypeScriptContext = {
  recommended(options?: TypeScriptScopeOptions): FlatConfig;
  strict(options?: TypeScriptScopeOptions): FlatConfig;
};

export type TypeScriptContextOptions = {
  rootDir: string;
};

export type TypeScriptOptions = {
  files?: string[];
  ignores?: string[];
  /** default: `'recommended'` */
  preset?: TypeScriptPreset;
  projectService?: ProjectServiceOptions;
};

export type TypeScriptPreset = 'recommended' | 'strict';

export type TypeScriptScopeOptions = {
  files?: string[];
  ignores?: string[];
  projectService?: ProjectServiceOptions;
};

export type VueOptions = {
  preset?: VuePreset;
};

export type VuePreset = 'essential' | 'recommended' | 'strongly-recommended';
