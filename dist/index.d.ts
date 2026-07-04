import { type Config } from 'eslint/config';
export type ProjectServiceOptions = true | {
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
export declare function createConfig(options?: CreateConfigOptions, ...overrides: Config[]): Config[];
//# sourceMappingURL=index.d.ts.map