import { type Config } from 'eslint/config';
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
export declare function createConfig(options?: CreateConfigOptions, ...overrides: Config[]): Config[];
//# sourceMappingURL=index.d.ts.map