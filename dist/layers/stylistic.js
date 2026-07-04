const syntaxRules = {
    '@typescript-eslint/consistent-type-imports': [
        'error',
        {
            disallowTypeAnnotations: true,
            fixStyle: 'separate-type-imports',
            prefer: 'type-imports',
        },
    ],
    '@typescript-eslint/no-unused-vars': [
        'error',
        {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
        },
    ],
};
const typeAwareRules = {
    '@typescript-eslint/consistent-type-exports': 'error',
};
export function stylistic() {
    return syntaxRules;
}
export function stylisticTypeAware() {
    return typeAwareRules;
}
