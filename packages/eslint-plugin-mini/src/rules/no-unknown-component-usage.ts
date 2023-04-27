import type { JsonObject } from 'type-fest';
import { componentAttributes } from '../schema/component-attributes';

import utils from '../utils';


/**
 * get config of custom component from json file.
 * @param {string} filePath path of wxml file
 * @returns {object}
 */
function getCustomComponent(filePath: string): JsonObject {
    const configPath = filePath?.replace(/\.wxml$/, '.json');

    if (filePath === configPath) {
        return {};
    }

    try {
        return require(configPath);
    }
    catch (e) {
        return {};
    }
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'disallow unknown component',
            categories: ['essential'],
            url: utils.getRuleUrl('no-unknown-component-usage')
        },
        schema: []
    },

    create(context) {
        const tokenStore = context.parserServices.getTemplateBodyTokenStore?.();

        return utils.defineTemplateBodyVisitor(context, {

            XElement(node) {

                const { usingComponents } = getCustomComponent(context.getFilename());
                if (!usingComponents) {
                    return;
                }
                const customComponents = Object.keys(usingComponents);

                const openTag = tokenStore.getFirstToken(node) as Token;
                if (node.rawName
                    && !componentAttributes[node.rawName]
                    && !customComponents.includes(node.rawName)
                ) {

                    context.report({
                        node,
                        loc: openTag.loc,
                        message: `Unknown tag '${ openTag.value }'.`
                    });
                }
            }
        });
    }
} as RuleModule;
