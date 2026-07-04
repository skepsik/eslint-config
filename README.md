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

export default createConfig({
  typed: true,
});
```

Syntax-only (no type-aware rules):

```ts
export default createConfig();
```

Type-aware with extra files outside tsconfig (e.g. root config files):

```ts
export default createConfig({
  typed: {
    allowDefaultProject: ['eslint.config.ts', 'prettier.config.ts'],
  },
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
  typed: {
    allowDefaultProject: ['eslint.config.ts'],
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
  { typed: true },
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
| `typed` | `boolean \| TypedOptions?` | Type-aware linting. `true` or `{}` enables `recommendedTypeChecked` + `projectService`. |
| `ignores` | `string[]?` | Additional ignore globs (always includes `**/dist/**`). |
| `vue` | `boolean?` | Not implemented yet. |

#### `TypedOptions`

| Field | Type | Description |
|-------|------|-------------|
| `allowDefaultProject` | `string[]?` | Globs for TS files **not** in any tsconfig that should use the package default project. Do not match files already covered by tsconfig (e.g. `vite.config.ts`). |

#### `...overrides`

Additional ESLint flat config objects merged after the base stack.

## What the config includes

1. `**/dist/**` ignores (+ custom `ignores`)
2. `@eslint/js` recommended
3. `typescript-eslint` — `recommended` or `recommendedTypeChecked` (if `typed`)
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

- `vue: true` — Vue / `eslint-plugin-vue` integration (planned).
