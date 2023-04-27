import utils from '../utils';

export default {
    meta: {
        type: 'layout',
        docs: {
            description: 'enforce the maximum number of attributes per line',
            categories: ['recommended'],
            url: utils.getRuleUrl('max-attributes-per-line')
        },
        // "code" | "whitespace"
        fixable: 'whitespace',
        schema: [
            {
                type: 'object',
                properties: {
                    singleline: {
                        anyOf: [
                            {
                                type: 'number',
                                minimum: 1
                            },
                            {
                                type: 'object',
                                properties: {
                                    max: {
                                        type: 'number',
                                        minimum: 1
                                    }
                                },
                                additionalProperties: false
                            }
                        ]
                    },
                    multiline: {
                        anyOf: [
                            {
                                type: 'number',
                                minimum: 1
                            },
                            {
                                type: 'object',
                                properties: {
                                    max: {
                                        type: 'number',
                                        minimum: 1
                                    },
                                    allowFirstLine: {
                                        type: 'boolean'
                                    }
                                },
                                additionalProperties: false
                            }
                        ]
                    }
                }
            }
        ]
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const configuration = parseOptions(context.options[0]);
        const multilineMaximum = configuration.multiline;
        const singlelineMaximum = configuration.singleline;
        const canHaveFirstLine = configuration.allowFirstLine;
        const template = context.parserServices.getTemplateBodyTokenStore?.();


        function parseOptions(options: JSONSchema4) {
            const defaults = {
                singleline: 1,
                multiline: 1,
                allowFirstLine: false
            };

            if (options) {
                if (typeof options.singleline === 'number') {
                    defaults.singleline = options.singleline;
                }
                else if (options.singleline?.max) {
                    defaults.singleline = options.singleline.max;
                }

                if (options.multiline) {
                    if (typeof options.multiline === 'number') {
                        defaults.multiline = options.multiline;
                    }
                    else if (typeof options.multiline === 'object') {
                        if (options.multiline.max) {
                            defaults.multiline = options.multiline.max;
                        }

                        if (options.multiline.allowFirstLine) {
                            defaults.allowFirstLine = options.multiline.allowFirstLine;
                        }
                    }
                }
            }

            return defaults;
        }

        function showErrors(attributes: (XDirective | XAttribute)[]) {
            attributes.forEach((prop, i) => {
                context.report({
                    node: prop,
                    loc: prop.loc,
                    message: '\'{{name}}\' should be on a new line.',
                    // @ts-expect-error
                    data: { name: sourceCode.getText(prop.key) },
                    fix(fixer) {
                        if (i !== 0) {
                            return null;
                        }
                        // Find the closest token before the current prop
                        // that is not a white space
                        const prevToken = template.getTokenBefore(
                            prop,
                            {

                                /** @param {Token} token */
                                filter: token => token.type !== 'HTMLWhitespace'
                            }
                        ) as Token;

                        // HACK: 取上一个非空 token 位置
                        const range: Range = [
                            prevToken.value === '}}' ? prevToken.range[1] + 1 : prevToken.range[1],
                            prop.range[0]
                        ];
                        return fixer.replaceTextRange(range, '\n');
                    }
                });
            });
        }

        function groupAttrsByLine(attributes: (XDirective | XAttribute)[]) {
            const propsPerLine = [[attributes[0]]];

            attributes.reduce((previous, current) => {
                if (previous.loc.end.line === current.loc.start.line) {
                    propsPerLine[propsPerLine.length - 1].push(current);
                }
                else {
                    propsPerLine.push([current]);
                }
                return current;
            });

            return propsPerLine;
        }

        return utils.defineTemplateBodyVisitor(context, {
            XStartTag(node) {
                const numberOfAttributes = node.attributes.length;

                if (!numberOfAttributes) {
                    return;
                }

                if (
                    utils.isSingleLine(node) && numberOfAttributes > singlelineMaximum
                ) {
                    showErrors(node.attributes.slice(singlelineMaximum));
                }

                if (!utils.isSingleLine(node)) {
                    if (
                        !canHaveFirstLine && node.attributes[0].loc.start.line === node.loc.start.line
                    ) {
                        showErrors([node.attributes[0]]);
                    }

                    groupAttrsByLine(node.attributes)
                        .filter(attrs => attrs.length > multilineMaximum)
                        .forEach(attrs => showErrors(attrs.splice(multilineMaximum)));
                }
            }
        });
    }
} as RuleModule;
