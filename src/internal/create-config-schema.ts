import type { Config } from 'eslint/config';

import { z } from 'zod';

type RulesConfig = NonNullable<Config['rules']>;

export const typescriptPresetSchema = z.enum(['recommended', 'strict']);

export const projectServiceSchema = z.union([
  z.literal(true),
  z
    .object({
      allowDefaultProject: z.array(z.string()).optional(),
      typeChecked: z.boolean().optional(),
    })
    .strict(),
]);

const rulesSchema = z.custom<RulesConfig>(
  (value) =>
    typeof value === 'object' && value !== null && !Array.isArray(value),
  { message: 'must be a rules object' },
);

const typescriptOptionsShape = z
  .object({
    files: z.array(z.string()).optional(),
    ignores: z.array(z.string()).optional(),
    preset: typescriptPresetSchema.optional(),
    projectService: projectServiceSchema.optional(),
    rules: rulesSchema.optional(),
  })
  .strict();

export const typescriptOptionsSchema = typescriptOptionsShape.refine(
  (value) => Object.keys(value).length > 0,
  {
    message: 'omit typescript or pass preset/projectService',
  },
);

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

const createConfigSource = 'createConfig(…)';
const typescriptSource = 'createConfig({ typescript: … })';

const createConfigOptionsSchema = z
  .object({
    ignores: z.array(z.string()).optional(),
    react: z.unknown().optional(),
    rootDir: z.string().optional(),
    typescript: z.unknown().optional(),
    vue: z.unknown().optional(),
  })
  .strict();

export type ParsedCreateConfigOptions = {
  ignores?: string[];
  rootDir?: string;
  typescript?: NormalizedTypeScriptOptions;
};

export function parseCreateConfigOptions(
  options: unknown,
): ParsedCreateConfigOptions {
  const result = createConfigOptionsSchema.safeParse(options ?? {});

  if (!result.success) {
    throw new Error(formatZodError(result.error, createConfigSource));
  }

  const { ignores, react, rootDir, typescript, vue } = result.data;

  if (vue) {
    throw new Error('createConfig({ vue }) is not implemented yet');
  }

  if (react) {
    throw new Error('createConfig({ react }) is not implemented yet');
  }

  const normalizedTypeScript = normalizeTypeScriptOptions(typescript);

  return {
    ...(ignores !== undefined && { ignores }),
    ...(rootDir !== undefined && { rootDir }),
    ...(normalizedTypeScript !== undefined && {
      typescript: normalizedTypeScript,
    }),
  };
}

function formatZodError(error: z.ZodError, source: string): string {
  return error.issues
    .map((issue) => {
      const path =
        issue.path.length > 0
          ? `\`${issue.path.map(String).join('.')}\`: `
          : '';

      return `${source} — ${path}${issue.message}`;
    })
    .join('; ');
}

function normalizeTypeScriptOptions(
  typescript: unknown,
): NormalizedTypeScriptOptions | undefined {
  if (typescript === undefined) {
    return undefined;
  }

  if (typescript === false) {
    throw new Error(
      'createConfig({ typescript: false }) is invalid — omit typescript instead',
    );
  }

  if (typescript === true) {
    return {
      preset: 'recommended',
      projectService: true,
    };
  }

  const result = typescriptOptionsSchema.safeParse(typescript);

  if (!result.success) {
    throw new Error(formatZodError(result.error, typescriptSource));
  }

  const { files, ignores, preset, projectService, rules } = result.data;

  return {
    ...(files !== undefined && { files }),
    ...(ignores !== undefined && { ignores }),
    preset: preset ?? 'recommended',
    ...(projectService !== undefined && { projectService }),
    ...(rules !== undefined && { rules }),
  };
}
