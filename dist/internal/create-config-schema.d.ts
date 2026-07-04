import type { Config } from 'eslint/config';
import { z } from 'zod';
type RulesConfig = NonNullable<Config['rules']>;
export declare const typescriptPresetSchema: z.ZodEnum<["recommended", "strict"]>;
export declare const projectServiceSchema: z.ZodUnion<[z.ZodLiteral<true>, z.ZodObject<{
    allowDefaultProject: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    typeChecked: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    allowDefaultProject?: string[] | undefined;
    typeChecked?: boolean | undefined;
}, {
    allowDefaultProject?: string[] | undefined;
    typeChecked?: boolean | undefined;
}>]>;
declare const typescriptOptionsShape: z.ZodObject<{
    files: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    ignores: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    preset: z.ZodOptional<z.ZodEnum<["recommended", "strict"]>>;
    projectService: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<true>, z.ZodObject<{
        allowDefaultProject: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        typeChecked: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        allowDefaultProject?: string[] | undefined;
        typeChecked?: boolean | undefined;
    }, {
        allowDefaultProject?: string[] | undefined;
        typeChecked?: boolean | undefined;
    }>]>>;
    rules: z.ZodOptional<z.ZodType<Partial<import("node_modules/@eslint/core/dist/cjs/types.cjs").RulesConfig>, z.ZodTypeDef, Partial<import("node_modules/@eslint/core/dist/cjs/types.cjs").RulesConfig>>>;
}, "strict", z.ZodTypeAny, {
    files?: string[] | undefined;
    ignores?: string[] | undefined;
    rules?: Partial<import("node_modules/@eslint/core/dist/cjs/types.cjs").RulesConfig> | undefined;
    preset?: "recommended" | "strict" | undefined;
    projectService?: true | {
        allowDefaultProject?: string[] | undefined;
        typeChecked?: boolean | undefined;
    } | undefined;
}, {
    files?: string[] | undefined;
    ignores?: string[] | undefined;
    rules?: Partial<import("node_modules/@eslint/core/dist/cjs/types.cjs").RulesConfig> | undefined;
    preset?: "recommended" | "strict" | undefined;
    projectService?: true | {
        allowDefaultProject?: string[] | undefined;
        typeChecked?: boolean | undefined;
    } | undefined;
}>;
export declare const typescriptOptionsSchema: z.ZodEffects<z.ZodObject<{
    files: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    ignores: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    preset: z.ZodOptional<z.ZodEnum<["recommended", "strict"]>>;
    projectService: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<true>, z.ZodObject<{
        allowDefaultProject: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        typeChecked: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        allowDefaultProject?: string[] | undefined;
        typeChecked?: boolean | undefined;
    }, {
        allowDefaultProject?: string[] | undefined;
        typeChecked?: boolean | undefined;
    }>]>>;
    rules: z.ZodOptional<z.ZodType<Partial<import("node_modules/@eslint/core/dist/cjs/types.cjs").RulesConfig>, z.ZodTypeDef, Partial<import("node_modules/@eslint/core/dist/cjs/types.cjs").RulesConfig>>>;
}, "strict", z.ZodTypeAny, {
    files?: string[] | undefined;
    ignores?: string[] | undefined;
    rules?: Partial<import("node_modules/@eslint/core/dist/cjs/types.cjs").RulesConfig> | undefined;
    preset?: "recommended" | "strict" | undefined;
    projectService?: true | {
        allowDefaultProject?: string[] | undefined;
        typeChecked?: boolean | undefined;
    } | undefined;
}, {
    files?: string[] | undefined;
    ignores?: string[] | undefined;
    rules?: Partial<import("node_modules/@eslint/core/dist/cjs/types.cjs").RulesConfig> | undefined;
    preset?: "recommended" | "strict" | undefined;
    projectService?: true | {
        allowDefaultProject?: string[] | undefined;
        typeChecked?: boolean | undefined;
    } | undefined;
}>, {
    files?: string[] | undefined;
    ignores?: string[] | undefined;
    rules?: Partial<import("node_modules/@eslint/core/dist/cjs/types.cjs").RulesConfig> | undefined;
    preset?: "recommended" | "strict" | undefined;
    projectService?: true | {
        allowDefaultProject?: string[] | undefined;
        typeChecked?: boolean | undefined;
    } | undefined;
}, {
    files?: string[] | undefined;
    ignores?: string[] | undefined;
    rules?: Partial<import("node_modules/@eslint/core/dist/cjs/types.cjs").RulesConfig> | undefined;
    preset?: "recommended" | "strict" | undefined;
    projectService?: true | {
        allowDefaultProject?: string[] | undefined;
        typeChecked?: boolean | undefined;
    } | undefined;
}>;
export type NormalizedTypeScriptOptions = {
    files?: string[];
    ignores?: string[];
    preset: z.infer<typeof typescriptPresetSchema>;
    projectService?: z.infer<typeof projectServiceSchema>;
    rules?: RulesConfig;
};
export type ProjectServiceOptions = z.infer<typeof projectServiceSchema>;
export type TypeScriptOptionsInput = z.input<typeof typescriptOptionsShape>;
export type TypeScriptPreset = z.infer<typeof typescriptPresetSchema>;
export type ParsedCreateConfigOptions = {
    ignores?: string[];
    rootDir?: string;
    typescript?: NormalizedTypeScriptOptions;
};
export declare function parseCreateConfigOptions(options: unknown): ParsedCreateConfigOptions;
export {};
//# sourceMappingURL=create-config-schema.d.ts.map