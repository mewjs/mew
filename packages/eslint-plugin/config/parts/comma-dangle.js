const base = [
    1,
    {
        arrays: 'only-multiline',
        functions: 'only-multiline',
        objects: 'only-multiline',
        imports: 'only-multiline',
        exports: 'only-multiline'
    }
];

const types = [
    1,
    {
        ...base[1],
        enums: 'only-multiline',
        generics: 'never',
        tuples: 'only-multiline'
    }
];

module.exports = {
    js: base,
    typescript: types
};
