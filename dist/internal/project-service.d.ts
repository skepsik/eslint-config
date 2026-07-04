import type { Config } from 'eslint/config';
import type { ProjectServiceOptions } from '../types.js';
export type NormalizedProjectService = {
    allowDefaultProject?: string[];
    typeChecked: boolean;
};
export declare function buildParserLanguageOptions(rootDir: string | undefined, projectService?: NormalizedProjectService): NonNullable<Config['languageOptions']>;
export declare function normalizeProjectService(projectService: ProjectServiceOptions): NormalizedProjectService;
//# sourceMappingURL=project-service.d.ts.map