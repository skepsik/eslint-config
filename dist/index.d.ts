import { type Config } from 'eslint/config';
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
export declare function createConfig(options?: CreateConfigOptions, ...overrides: Config[]): Config[];
//# sourceMappingURL=index.d.ts.map