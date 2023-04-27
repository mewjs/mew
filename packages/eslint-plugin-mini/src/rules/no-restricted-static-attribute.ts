import utils from '../utils';
import regexp from '../utils/regexp';

interface ParsedOption {
    test: (key: XAttribute) => boolean;
    useValue?: boolean;
    useElement?: boolean;
    message?: string;
}

function buildMatcher(source: string): (string: string) => boolean {
    if (regexp.isRegExp(source)) {
        const re = regexp.toRegExp(source);
        return s => {
            re.lastIndex = 0;
            return re.test(s);
        };
    }
    return s => s === source;
}

// TODO: node.value[0].value, remove ts-ignore

function parseOption(
    option: string | { key: string; value: boolean | string; element?: string; message?: string }
): ParsedOption {
    if (typeof option === 'string') {
        const matcher = buildMatcher(option);

        return {
            test({ key }) {
                return matcher(key.rawName);
            }
        };
    }
    const parsed = parseOption(option.key);
    if (option.value) {
        const keyTest = parsed.test;
        if (option.value === true) {
            parsed.test = node => {
                if (!keyTest(node)) {
                    return false;
                }
                // @ts-expect-error
                return node.value[0] == null || node.value[0].value === node.key.rawName;
            };
        }
        else {
            const valueMatcher = buildMatcher(option.value);
            parsed.test = node => {
                if (!keyTest(node)) {
                    return false;
                }
                // @ts-expect-error
                return node.value[0] != null && valueMatcher(node.value[0].value);
            };
        }
        parsed.useValue = true;
    }
    if (option.element) {
        const argTest = parsed.test;
        const tagMatcher = buildMatcher(option.element);
        parsed.test = node => {
            if (!argTest(node)) {
                return false;
            }
            const element = node.parent.parent;
            return tagMatcher(element.rawName);
        };
        parsed.useElement = true;
    }
    parsed.message = option.message;
    return parsed;
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'disallow specific attribute',
            categories: ['recommended'],
            url: utils.getRuleUrl('no-restricted-static-attribute')
        },
        schema: {
            type: 'array',
            items: {
                oneOf: [
                    { type: 'string' },
                    {
                        type: 'object',
                        properties: {
                            key: { type: 'string' },
                            value: { anyOf: [{ type: 'string' }, { enum: [true] }] },
                            element: { type: 'string' },
                            message: { type: 'string', minLength: 1 }
                        },
                        required: ['key'],
                        additionalProperties: false
                    }
                ]
            },
            uniqueItems: true,
            minItems: 0
        },

        messages: {
            restrictedAttr: '{{message}}'
        }
    },

    create(context) {
        if (!context.options.length) {
            return {};
        }

        const options: ParsedOption[] = context.options.map(parseOption);

        return utils.defineTemplateBodyVisitor(context, {
            'XAttribute[directive=false]'(node: XAttribute) {
                for (const option of options) {
                    if (option.test(node)) {
                        const message = option.message || defaultMessage(node, option);
                        context.report({
                            node,
                            messageId: 'restrictedAttr',
                            data: { message }
                        });
                        return;
                    }
                }
            }
        });

        function defaultMessage(node: XAttribute, option: ParsedOption) {
            const key = node.key.rawName;
            const value = option.useValue
                ? node.value[0] == null
                    ? '` set to `true'
                    // @ts-expect-error
                    : `="${ node.value[0].value }"`
                : '';

            let on = '';
            if (option.useElement) {
                on = ` on \`<${ node.parent.parent.rawName }>\``;
            }
            return `Using \`${ key + value }\`${ on } is not allowed.`;
        }
    }
} as RuleModule;
