# @skepsik/eslint-config

Общая flat-конфигурация ESLint для TypeScript-проектов.

## Установка

peerDependencies (ставятся в проекте-потребителе):

```bash
npm i -D eslint typescript-eslint @skepsik/eslint-config
```

Входит в пакет (`dependencies`, отдельно ставить не нужно):

- `@eslint/js`
- `eslint-config-prettier`
- `eslint-plugin-perfectionist`

Node.js ≥ 22.

## Использование

### `createConfig` (типичный случай)

```ts
// eslint.config.ts
import { createConfig } from '@skepsik/eslint-config';

export default createConfig();
```

Только синтаксис, с `projectService`: парсер знает типы, но без type-checked правил:

```ts
export default createConfig({
  rootDir: import.meta.dirname,
  typescript: true,
});
```

Type-checked правила и `projectService`:

```ts
export default createConfig({
  rootDir: import.meta.dirname,
  typescript: {
    projectService: {
      typeChecked: true,
      allowDefaultProject: ['eslint.config.ts', 'prettier.config.ts'],
    },
  },
});
```

Строгий синтаксический пресет:

```ts
export default createConfig({
  typescript: { preset: 'strict' },
});
```

### Сборка из слоёв

```ts
import { defineConfig } from 'eslint/config';
import {
  base,
  createTypeScriptContext,
  prettier,
  stylistic,
} from '@skepsik/eslint-config';

const ts = createTypeScriptContext({ rootDir: import.meta.dirname });

export default defineConfig([
  ...base({ ignores: ['drizzle/**'] }),
  ...ts.recommended({
    files: ['apps/runtime/src/**', 'packages/core/src/**'],
    projectService: true,
  }),
  ...stylistic(),
  ...prettier(),
]);
```

Слои также доступны из `@skepsik/eslint-config/layers`.

### Monorepo с вложенными `eslint.config.ts`

Передавай **`rootDir`** в **каждом** конфиге:

```ts
// eslint.config.ts (корень репо)
export default createConfig({
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
export default createConfig({
  rootDir: import.meta.dirname,
});
```

Без `rootDir` во вложенных конфигах ESLint может упасть с:

```text
No tsconfigRootDir was set, and multiple candidate TSConfigRootDirs are present
```

Подробнее — [Зачем `rootDir`](#зачем-rootdir).

### Переопределения

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

Возвращает массив flat-конфигурации (через ESLint `defineConfig`).

#### `options`

| Поле         | Тип                             | Описание                                                                                                              |
| ------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `rootDir`    | `string?`                       | Директория этого `eslint.config.ts` — обычно `import.meta.dirname`. **Обязателен в monorepo с вложенными конфигами.** |
| `ignores`    | `string[]?`                     | Дополнительные маски игнора (всегда включает `**/dist/**`). `node_modules` ESLint игнорирует сам.                     |
| `typescript` | `boolean \| TypeScriptOptions?` | См. ниже.                                                                                                             |
| `vue`        | `boolean \| VueOptions?`        | Пока не реализовано.                                                                                                  |
| `react`      | `boolean \| ReactOptions?`      | Пока не реализовано.                                                                                                  |

#### `TypeScriptOptions`

| Поле             | Тип                          | Описание                                             |
| ---------------- | ---------------------------- | ---------------------------------------------------- |
| `preset`         | `'recommended' \| 'strict'?` | Пресет tseslint. По умолчанию: `recommended`.        |
| `projectService` | `ProjectServiceOptions?`     | `projectService` парсера TypeScript.                 |
| `files`          | `string[]?`                  | Ограничить пресет и настройки парсера этими масками. |

`typescript: true` ≡ `{ preset: 'recommended', projectService: true }`.

#### `ProjectServiceOptions`

| Форма                                                         | Пресет                   | `projectService`      |
| ------------------------------------------------------------- | ------------------------ | --------------------- |
| _(нет `typescript`)_                                          | `recommended`            | выкл                  |
| `true` (краткая запись на `typescript`)                       | `recommended`            | вкл, только синтаксис |
| `{ preset: 'strict' }`                                        | `strict`                 | выкл                  |
| `{ projectService: true }`                                    | `recommended`            | вкл                   |
| `{ projectService: { typeChecked: true } }`                   | `recommendedTypeChecked` | вкл                   |
| `{ preset: 'strict', projectService: { typeChecked: true } }` | `strictTypeChecked`      | вкл                   |

Объектная форма:

| Поле                  | Тип         | Описание                                                             |
| --------------------- | ----------- | -------------------------------------------------------------------- |
| `typeChecked`         | `boolean?`  | Пресет `*TypeChecked`. Требует `projectService`.                     |
| `allowDefaultProject` | `string[]?` | Маски TS-файлов вне tsconfig (используется дефолтный проект пакета). |

### Слои

| Функция                                | Возвращает | Роль                                                   |
| -------------------------------------- | ---------- | ------------------------------------------------------ |
| `base({ ignores? })`                   | `Config[]` | игноры, `@eslint/js`, perfectionist                    |
| `createTypeScriptContext({ rootDir })` | контекст   | привязывает `rootDir` для `recommended()` / `strict()` |
| `ts.recommended(scope?)`               | `Config[]` | пресет tseslint + опциональные настройки парсера       |
| `ts.strict(scope?)`                    | `Config[]` | то же с пресетом `strict`                              |
| `stylistic({ files? })`                | `Config[]` | `consistent-type-imports`, `no-unused-vars`            |
| `prettier()`                           | `Config[]` | `eslint-config-prettier` (ставить последним)           |

`TypeScriptScopeOptions`: `{ files?, projectService? }`.

## Что входит в конфиг

1. игнор `**/dist/**` (+ кастомные `ignores`)
2. `@eslint/js` recommended
3. пресет `typescript-eslint` из `typescript.preset` и `typescript.projectService`
4. `eslint-plugin-perfectionist` — `recommended-natural`
5. стилистические правила TypeScript (`consistent-type-imports`, `consistent-type-exports`, `no-unused-vars`)
6. `eslint-config-prettier` (последним)
7. твои переопределения

## Зачем `rootDir`

В публичном API опция называется **`rootDir`**. Внутри передаётся в парсер как `parserOptions.tsconfigRootDir`.

Пресеты вроде `tseslint.configs.recommended` — **геттеры с побочным эффектом**: при чтении регистрируют кандидатов для автоопределения `tsconfigRootDir`. Если в одном запуске ESLint несколько конфигов, явный `rootDir` обходит это автоопределение.

`rootDir` обязателен во вложенных monorepo-конфигах; для одного корневого конфига — опционален.

## TypeScript: `verbatimModuleSyntax`

В этом репозитории включён в `tsconfig.json`; для потребителей — **рекомендуется** в `compilerOptions`:

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
  }
}
```

Проверка: `npm run typecheck` (`tsc --noEmit`).

**Что ловит `tsc` (TS1484):** type-only import без пометки:

```ts
import { Config, defineConfig } from 'eslint/config'; // Config только как тип → error
```

**Что нужно:**

```ts
import type { Config } from 'eslint/config';
import { defineConfig } from 'eslint/config';
```

**Что не ловит:** inline `{ type Config }` и смешанный `import { type Config, defineConfig }` — для TypeScript это валидная type-only форма. ESLint `consistent-type-imports` тоже не требует разносить такие импорты.

Итого: `verbatimModuleSyntax` + `consistent-type-imports` дополняют друг друга на «забыли `type`», но **не заменяют** стиль «всегда `import type` отдельной строкой».

## dependencies и peerDependencies

| Пакет                                                                 | Роль                                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------ |
| `eslint`, `typescript-eslint`                                         | **peerDependencies** — одна общая копия в потребителе. |
| `@eslint/js`, `eslint-config-prettier`, `eslint-plugin-perfectionist` | **dependencies** — идут с пакетом.                     |

## Не реализовано

- `vue` — Vue / `eslint-plugin-vue`
- `react` — React / `eslint-plugin-react`
