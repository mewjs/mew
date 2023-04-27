const rules = [
    require('./rules/strict-values').default,
    require('./rules/stylus-colon').default,
    require('./rules/stylus-trailing-semicolon').default,
    require('./rules/use-hex-color').default,
    require('./rules/white-space-between-values').default
];

export default rules;
