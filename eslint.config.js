import { createConfig } from './dist/index.js';

export default createConfig({
  ignores: ['dist/**'],
  rootDir: import.meta.dirname,
  typescript: {
    projectService: {
      typeChecked: true,
    },
  },
});
