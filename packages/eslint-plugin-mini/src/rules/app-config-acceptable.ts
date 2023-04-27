import path from 'path';
import { Validator } from 'jsonschema';
import utils from '../utils';
import jsonSchema from '../schema/json';

export default {
    meta: {
        docs: {
            description: 'mini program app config check',
            categories: ['essential'],
            url: utils.getRuleUrl('app-config-acceptable')
        },
        schema: []
    },

    create(context) {
        const filename = context.getFilename();
        if (path.basename(filename) !== 'app.json' || context.parserServices.defineTemplateBodyVisitor == null) {
            return {};
        }

        const sourceCode = context.getSourceCode();
        const appJsonSchema = jsonSchema['app.json'];
        const validator = new Validator();
        const { parserServices } = context;
        return parserServices.defineTemplateBodyVisitor({

            'XJson > ObjectExpression'(node: ObjectExpression) {
                const [firstProperty] = node.properties;
                if (!firstProperty) {
                    context.report({
                        node,
                        message: 'empty app config'
                    });
                    return;
                }

                let appJson = null;
                try {
                    appJson = JSON.parse(sourceCode.text);
                }
                catch (e) {
                    context.report({
                        node,
                        message: `parse app config error: '${ (e as Error).message }'`
                    });
                    return;
                }

                // @ts-expect-error
                const { errors = [] } = validator.validate(appJson, appJsonSchema);
                for (const error of errors) {
                    let currentNode: Expression = node;
                    for (const nodeName of error.path) {
                        if (currentNode.type === 'ArrayExpression') {
                            if (!(currentNode as ArrayExpression).elements[nodeName as number]) {
                                break;
                            }
                            currentNode = (currentNode as ArrayExpression).elements[nodeName as number] as Expression;
                        }
                        else {
                            const childNode = currentNode.properties.find(n => n.key.value === nodeName);
                            if (!childNode) {
                                break;
                            }
                            currentNode = childNode.value;
                        }
                    }

                    context.report({
                        node: currentNode,
                        message: error.message
                    });
                }
            }
        });
    }
} as RuleModule;
