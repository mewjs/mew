/**
 * @file program app config check
 */
// @ts-ignore
const path = require('path');

const defaultFields = [
    'pages',
    'window',
];

module.exports = {
    meta: {
        docs: {
            description: 'mini program app config check',
            categories: ['essential'],
            url: 'app-config-acceptable'
        },
        fixable: null,
        schema: []
    },

    /**
     * @param {RuleContext} context
     */
    create(context) {
        const filename = context.getFilename();
        if (path.basename(filename) !== 'app.json' || context.parserServices.defineTemplateBodyVisitor == null) {
            return {};
        }

        const requireFields = defaultFields;

        return context.parserServices.defineTemplateBodyVisitor({

            /**
             * @param {ObjectExpression} params
             */
            'XJson > ObjectExpression'(appJson) {
                const [firstProperty] = appJson.properties;
                if (!firstProperty) {
                    context.report({
                        node: appJson,
                        message: 'empty app config'
                    });
                    return;
                }

                const propertyMap = appJson.properties.reduce((map, property) => {
                    // @ts-ignore
                    map[property.key.value] = property;
                    return map;
                }, {});

                for (const fieldName of requireFields) {
                    // @ts-ignore
                    if (!propertyMap[fieldName]) {
                        context.report({
                            // @ts-ignore
                            node: firstProperty.key,
                            message: `require field '${fieldName}' in app config`
                        });
                    }
                }
            }
        });
    }
};
