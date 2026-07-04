import { fileURLToPath } from 'node:url';

export const defaultProject = fileURLToPath(
  new URL('../tsconfig.default.json', import.meta.url),
);

export const tsFiles = ['**/*.{ts,tsx,mts,cts}'];
