import { Validator } from 'jsonschema';
import {
    commonAttributes,
    componentAttributes,
    ariaAttributes
} from '../schema/component-attributes';
import utils from '../utils';


function formatValue(value: number | boolean | string, schema: JSONSchema4) {
    if (schema.type === 'number') {
        return Number(value);
    }

    if (schema.type === 'boolean') {
        return Boolean(value);
    }

    if (schema.oneOf?.some(i => i.type === 'number')
        || schema.anyOf?.some(i => i.type === 'number')) {
        return isNaN(Number(value)) ? value : Number(value);
    }

    return value;
}

interface SingleType {
    type: string;
}

interface SingleEnum {
    enum: unknown[];
}

interface FullType extends SingleType, SingleEnum {
}

function getAttrSchema(attrName: string, tagName: string): SingleType | SingleEnum | FullType {
    const commonType = attrName as keyof typeof commonAttributes;
    if (commonAttributes[commonType]) {
        return commonAttributes[commonType];
    }

    const attrType = attrName as keyof typeof ariaAttributes;
    if (attrName.startsWith('aria-') && ariaAttributes[attrType]) {
        return ariaAttributes[attrType];
    }

    return componentAttributes[tagName]?.properties[attrName];
}


export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'validate component attributes',
            categories: ['essential'],
            url: utils.getRuleUrl('component-attributes')
        },
        schema: [
            {
                type: 'object',
                properties: {
                    allowEmpty: {
                        type: 'boolean'
                    },
                    allowUnknown: {
                        type: 'boolean'
                    }
                }
            }
        ]
    },

    create(context) {
        const options = context.options[0] || {};
        const allowEmpty = options.allowEmpty === true;
        const allowUnknown = options.allowUnknown !== false;
        const validator = new Validator();

        return utils.defineTemplateBodyVisitor(context, {

            'XAttribute[directive=false]'(attr: XAttribute) {
                const tagName = attr.parent.parent.name;
                // directive
                // expression value wouldn't validate
                if (attr.directive || utils.getValueType(attr) !== 'literal') {
                    return;
                }

                // empty property value
                if (!allowEmpty && utils.isEmptyValueLiteral(attr)) {
                    context.report({
                        node: attr,
                        loc: attr.loc,
                        message: `'${ attr.key.rawName }' value shouldn't be empty.`
                    });
                    return;
                }

                const schema = getAttrSchema(attr.key.name, tagName);

                if (schema) {
                    // @ts-expect-error
                    if (!validator.validate(formatValue(attr.value[0].value, schema), schema).valid) {
                        context.report({
                            node: attr,
                            loc: attr.loc,
                            message: `invalid '${ attr.key.rawName }' value.`
                        });
                    }
                }
                else if (!allowUnknown && componentAttributes[tagName]) {
                    context.report({
                        node: attr.key,
                        loc: attr.key.loc,
                        message: `unknown attribute '${ attr.key.rawName }'.`
                    });
                }
            }
        });
    }
} as RuleModule;
