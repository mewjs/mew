import path from 'path';
import { Validator } from 'jsonschema';

import utils from '../utils';
import jsonSchema from '../schema/json';

export default {
    meta: {
        docs: {
            description: 'mini program sitemap.json check',
            categories: ['recommended'],
            url: utils.getRuleUrl('sitemap-acceptable')
        },
        schema: []
    },


    create(context) {
        const filename = context.getFilename();
        if (path.basename(filename) !== 'sitemap.json' || context.parserServices.defineTemplateBodyVisitor == null) {
            return {};
        }

        const sourceCode = context.getSourceCode();
        const sitemapJsonSchema = jsonSchema['sitemap.json'];
        const validator = new Validator();
        return context.parserServices.defineTemplateBodyVisitor({

            'XJson > ObjectExpression'(node: ObjectExpression | ArrayExpression) {
                const [firstProperty] = (node as ObjectExpression).properties || [];
                if (!firstProperty) {
                    return;
                }

                let sitemapJson: JSONSchema4;
                try {
                    sitemapJson = JSON.parse(sourceCode.text);
                }
                catch (e) {
                    context.report({
                        node,
                        message: `parse sitemap config error: '${ (e as Error).message }'`
                    });
                    return;
                }

                const {
                    errors = []
                } = validator.validate(sitemapJson, sitemapJsonSchema);

                for (const error of errors) {
                    let currentNode: Node | Expression | RestElement | null = node;
                    for (const nodeName of error.path) {
                        if (currentNode!.type === 'ArrayExpression') {
                            if (!currentNode.elements[nodeName as number]) {
                                break;
                            }

                            currentNode = currentNode.elements[nodeName as number];
                        }
                        else {
                            // TODO: performance
                            const childNode = (currentNode as ObjectExpression).properties
                                .find(
                                    n => (n as Property).key.value === nodeName
                                );
                            if (!childNode) {
                                break;
                            }
                            currentNode = childNode.value;
                        }
                    }

                    context.report({
                        node: currentNode!,
                        message: error.message
                    });
                }
            }
        });
    }
} as RuleModule;
