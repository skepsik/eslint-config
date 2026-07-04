# @skepsik/eslint-config

Shared ESLint flat config for TypeScript projects.

## Install

Peer dependencies (install in the consumer project):

```bash
npm i -D eslint typescript-eslint @skepsik/eslint-config
```

Bundled with the package (`dependencies`, no need to install separately):

- `@eslint/js`
- `eslint-config-prettier`
- `eslint-plugin-perfectionist`

Node.js ≥ 22.

## Usage

### Single config (typical project)

```ts
// eslint.config.ts
import { createConfig } from '@skepsik/eslint-config';

export default createConfig();
```

Syntax-only with optional project service (better parser/type info, no type-checked rules):

```ts
export default createConfig({
  typescript: true,
});
```

Type-checked rules + project service:

```ts
export default createConfig({
  typescript: {
    projectService: {
      typeChecked: true,
      allowDefaultProject: ['eslint.config.ts', 'prettier.config.ts'],
    },
  },
});
```

Strict syntax preset without project service:

```ts
export default createConfig({
  typescript: { level: 'strict' },
});
```

### Monorepo with nested `eslint.config.ts`

When several config files are linted in one run (`eslint .`), pass **`rootDir`** in **each** config:

```ts
// eslint.config.ts (repo root)
import { createConfig } from '@skepsik/eslint-config';

export default createConfig({
  ignores: ['apps/*/dist/**'],
  rootDir: import.meta.dirname,
  typescript: {
    projectService: {
      typeChecked: true,
      allowDefaultProject: ['eslint.config.ts'],
    },
  },
});
```

```ts
// apps/web/eslint.config.ts
import { createConfig } from '@skepsik/eslint-config';

export default createConfig({
  ignores: ['dist/**'],
  rootDir: import.meta.dirname,
});
```

Without `rootDir` in nested configs, ESLint may fail with:

```text
No tsconfigRootDir was set, and multiple candidate TSConfigRootDirs are present
```

See [Why `rootDir`](#why-rootdir) below.

### Overrides

Extra flat config blocks are appended before `eslint-config-prettier`:

```ts
export default createConfig(
  {
    typescript: {
      projectService: { typeChecked: true },
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
);
```

## API

### `createConfig(options?, ...overrides)`

Returns a flat config array (via ESLint `defineConfig`).

#### `options`

| Field | Type | Description |
|-------|------|-------------|
| `rootDir` | `string?` | Directory of this `eslint.config.ts` — usually `import.meta.dirname`. **Required in monorepos with nested configs.** Optional for a single root config. |
| `ignores` | `string[]?` | Additional ignore globs (always includes `**/dist/**`). |
| `typescript` | `boolean \| TypeScriptOptions?` | TypeScript preset and parser options. See below. |
| `vue` | `boolean \| VueOptions?` | Not implemented yet. |
| `react` | `boolean \| ReactOptions?` | Not implemented yet. |

#### `TypeScriptOptions`

| Field | Type | Description |
|-------|------|-------------|
| `level` | `'recommended' \| 'strict'?` | tseslint preset strictness. Default: `recommended`. |
| `projectService` | `ProjectServiceOptions?` | Parser project service. Only under `typescript` — it is a `@typescript-eslint/parser` option. |

`typescript: true` is shorthand for `{ level: 'recommended', projectService: true }`.

`typescript: {}` throws — omit the field or pass `level` / `projectService`.

#### `ProjectServiceOptions`

| Form | Preset | Project service |
|------|--------|-----------------|
| *(omit `typescript`)* | `recommended` | off |
| `true` (on `typescript`) | `recommended` | on, syntax-only |
| `{ level: 'strict' }` | `strict` | off |
| `{ projectService: true }` | `recommended` | on, syntax-only |
| `{ projectService: { typeChecked: true } }` | `recommendedTypeChecked` | on (required) |
| `{ level: 'strict', projectService: { typeChecked: true } }` | `strictTypeChecked` | on (required) |

Object form:

| Field | Type | Description |
|-------|------|-------------|
| `typeChecked` | `boolean?` | Use `*TypeChecked` preset. Requires project service. Default: `false`. |
| `allowDefaultProject` | `string[]?` | Globs for TS files **not** in any tsconfig that should use the package default project. Do not match files already covered by tsconfig (e.g. `vite.config.ts`). |

#### `VueOptions` / `ReactOptions`

Reserved for future integration. Each domain has its own `level` enum (`essential` / `recommended` for Vue, `recommended` / `jsx-runtime` for React). Project service stays under `typescript` only.

#### `...overrides`

Additional ESLint flat config objects merged after the base stack.

## What the config includes

1. `**/dist/**` ignores (+ custom `ignores`)
2. `@eslint/js` recommended
3. `typescript-eslint` — preset from `typescript.level` and `typescript.projectService.typeChecked`
4. `eslint-plugin-perfectionist` — `recommended-natural`
5. Stylistic TypeScript rules (`consistent-type-imports`, `no-unused-vars` with `_` prefix)
6. `eslint-config-prettier` (last)
7. Your `overrides`

## Why `rootDir`

In the public API the option is **`rootDir`**. Internally it is passed to the parser as `parserOptions.tsconfigRootDir` — that is the name `@typescript-eslint/parser` expects.

We set it explicitly on purpose:

- Presets like `tseslint.configs.recommended` are **getters with a side effect**: on read they walk the call stack, find `eslint.config.*`, and register that directory in a **global Set of candidates** for `tsconfigRootDir` inference.
- With **one** config file this usually works (one candidate or `process.cwd()`).
- With **several** nested configs in one ESLint run, each preset read adds another candidate. When the parser later resolves paths without an explicit `tsconfigRootDir`, it sees multiple candidates and throws.

Explicit `rootDir` bypasses that inference — the parser never reads the global Set.

Other shared presets (`eslint.configs.recommended`, perfectionist, prettier) are plain objects; they do not have this behaviour.

Runtime detection of “is this a monorepo?” is unreliable, so `rootDir` stays optional in the API and **documented as required for nested configs**.

## Dependencies vs peers

| Package | Role |
|---------|------|
| `eslint`, `typescript-eslint` | **Peers** — consumer installs; one shared instance (especially important for `typescript-eslint`, see above). |
| `@eslint/js`, `eslint-config-prettier`, `eslint-plugin-perfectionist` | **Dependencies** — pulled in with `@skepsik/eslint-config`. |

App-specific ESLint plugins (e.g. `eslint-config-vuetify` for Vue) stay in the workspace that needs them, not in this package.

## Not implemented

- `vue` — Vue / `eslint-plugin-vue` integration (planned).
- `react` — React / `eslint-plugin-react` integration (planned).
