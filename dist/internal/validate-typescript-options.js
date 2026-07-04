const typescriptPresets = ['recommended', 'strict'];
export function assertProjectServiceOptions(value, source = 'createConfig({ typescript: { projectService: … } })') {
    if (value === true) {
        return true;
    }
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error(`${source} — \`projectService\` must be \`true\` or an object, got ${formatValue(value)}`);
    }
    const options = value;
    if ('typeChecked' in options &&
        options.typeChecked !== undefined &&
        typeof options.typeChecked !== 'boolean') {
        throw new Error(`${source} — \`projectService.typeChecked\` must be boolean, got ${formatValue(options.typeChecked)}`);
    }
    if ('allowDefaultProject' in options && options.allowDefaultProject !== undefined) {
        assertStringArray(options.allowDefaultProject, 'projectService.allowDefaultProject', source);
    }
    assertNoUnknownKeys(options, ['typeChecked', 'allowDefaultProject'], source);
    return value;
}
export function assertRulesConfig(value, source = 'createConfig({ typescript: { rules: … } })') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error(`${source} — \`rules\` must be a rules object, got ${formatValue(value)}`);
    }
    return value;
}
export function assertStringArray(value, field, source = 'createConfig({ typescript: … })') {
    if (!isStringArray(value)) {
        throw new Error(`${source} — \`${field}\` must be string[], got ${formatValue(value)}`);
    }
    return value;
}
export function assertTypeScriptPreset(preset, source = 'createConfig({ typescript: { preset: … } })') {
    if (typeof preset === 'string' &&
        typescriptPresets.includes(preset)) {
        return preset;
    }
    throw new Error(`${source} — invalid preset ${formatValue(preset)}, expected ${formatAllowed(typescriptPresets)}`);
}
export function validateTypeScriptOptions(typescript) {
    const validated = {};
    if (typescript.preset !== undefined) {
        validated.preset = assertTypeScriptPreset(typescript.preset);
    }
    if (typescript.files !== undefined) {
        validated.files = assertStringArray(typescript.files, 'files');
    }
    if (typescript.ignores !== undefined) {
        validated.ignores = assertStringArray(typescript.ignores, 'ignores');
    }
    if (typescript.projectService !== undefined) {
        validated.projectService = assertProjectServiceOptions(typescript.projectService);
    }
    if (typescript.rules !== undefined) {
        validated.rules = assertRulesConfig(typescript.rules);
    }
    assertNoUnknownKeys(typescript, ['preset', 'files', 'ignores', 'projectService', 'rules'], 'createConfig({ typescript: … })');
    return validated;
}
function assertNoUnknownKeys(value, allowedKeys, source) {
    const unknownKeys = Object.keys(value).filter((key) => !allowedKeys.includes(key));
    if (unknownKeys.length === 0) {
        return;
    }
    throw new Error(`${source} — unknown option${unknownKeys.length > 1 ? 's' : ''}: ${unknownKeys.map((key) => `\`${key}\``).join(', ')}`);
}
function formatAllowed(values) {
    return values.map((value) => `"${value}"`).join(' or ');
}
function formatValue(value) {
    if (typeof value === 'string') {
        return `"${value}"`;
    }
    return String(value);
}
function isStringArray(value) {
    return (Array.isArray(value) &&
        value.every((item) => typeof item === 'string'));
}
