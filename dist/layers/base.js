import eslint from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
export function base(options = {}) {
    const ignores = options.ignores ?? [];
    return [
        {
            ignores: ['**/dist/**', ...ignores],
        },
        eslint.configs.recommended,
        perfectionist.configs['recommended-natural'],
    ];
}
