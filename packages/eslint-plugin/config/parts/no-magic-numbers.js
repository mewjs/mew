const ignores = [
    -1,
    0,
    1,
    2,
    3,
    4,
    10,
    12,
    24,
    36,
    60,
    100,
    1000
];

const base = [
    1,
    {
        ignore: ignores,
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        detectObjects: false
    }
];

const types = [
    1,
    {
        ...base[1],
        ignoreEnums: true,
        ignoreNumericLiteralTypes: true,
        ignoreReadonlyClassProperties: true
    }
];

module.exports = {
    js: base,
    typescript: types
};
