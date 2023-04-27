import utils from '../utils';

type XExpression = NonNullable<XExpressionContainer['expression']>;

interface OrOperands {
    node: XExpression;
    operands: AndOperands[];
}
interface AndOperands {
    node: XExpression;
    operands: XExpression[];
}

/**
 * Splits the given node by the given logical operator.
 * @param {string} operator Logical operator `||` or `&&`.
 * @param {XExpression} node The node to split.
 * @returns {XExpression[]} Array of conditions that makes the node when joined by the operator.
 */
function splitByLogicalOperator(operator: string, node: XExpression): XExpression[] {
    if (node.type === 'LogicalExpression' && node.operator === operator) {
        return [
            ...splitByLogicalOperator(operator, node.left),
            ...splitByLogicalOperator(operator, node.right)
        ];
    }
    return [node];
}

/**
 * @param {XExpression} node
 */
function splitByOr(node: XExpression) {
    return splitByLogicalOperator('||', node);
}

/**
 * @param {XExpression} node
 */
function splitByAnd(node: XExpression) {
    return splitByLogicalOperator('&&', node);
}

/**
 * @param {XExpression} node
 * @returns {OrOperands}
 */
function buildOrOperands(node: XExpression): OrOperands {
    const orOperands = splitByOr(node);
    return {
        node,
        operands: orOperands.map(orOperand => {
            const andOperands = splitByAnd(orOperand);
            return {
                node: orOperand,
                operands: andOperands
            };
        })
    };
}


export default {
    meta: {
        type: 'problem',
        docs: {
            description:
        'disallow duplicate conditions in `wx:if` / `wx:elif` chains',
            categories: ['recommended'],
            url: utils.getRuleUrl('no-duplicate-else-if')
        },
        schema: [],
        messages: {
            unexpected: ''
                + 'This branch can never execute. '
                + 'Its condition is a duplicate or covered by previous conditions in the `wx:if` / `wx:elif` chain.'
        }
    },

    create(context) {
        const tokenStore = context.parserServices?.getTemplateBodyTokenStore();

        /**
         * Determines whether the two given nodes are considered to be equal. In particular, given that the nodes
         * represent expressions in a boolean context, `||` and `&&` can be considered as commutative operators.
         * @param {XExpression} a First node.
         * @param {XExpression} b Second node.
         * @returns {boolean} `true` if the nodes are considered to be equal.
         */
        function equal(a: XExpression, b: XExpression): boolean {
            if (a.type !== b.type) {
                return false;
            }

            if (
                a.type === 'LogicalExpression'
                && b.type === 'LogicalExpression'
                && (a.operator === '||' || a.operator === '&&')
                && a.operator === b.operator
            ) {
                return (
                    (equal(a.left, b.left) && equal(a.right, b.right))
                    || (equal(a.left, b.right) && equal(a.right, b.left))
                );
            }

            return utils.equalTokens(a as XNode, b as XNode, tokenStore);
        }

        /**
         * Determines whether the first given AndOperands is a subset of the second given AndOperands.
         *
         * e.g. A: (a && b), B: (a && b && c): B is a subset of A.
         *
         * @param {AndOperands} operandsA The AndOperands to compare from.
         * @param {AndOperands} operandsB The AndOperands to compare against.
         * @returns {boolean} `true` if the `andOperandsA` is a subset of the `andOperandsB`.
         */
        function isSubset(operandsA: AndOperands, operandsB: AndOperands): boolean {
            return operandsA.operands.every(operandA =>
                operandsB.operands.some(operandB => equal(operandA, operandB)));
        }

        return utils.defineTemplateBodyVisitor(context, {
            'XAttribute[directive=true][key.name.name="elif"]'(node: XDirective) {
                if (!node.value[0] || !('expression' in node.value[0]) || !node.value[0].expression) {
                    return;
                }
                const test = node.value[0].expression;
                const conditionsToCheck = test?.type === 'LogicalExpression' && test.operator === '&&'
                    ? [...splitByAnd(test), test]
                    : [test];
                const listToCheck = conditionsToCheck.map(buildOrOperands);

                let current: XElement | null = node.parent.parent;
                while (current && (current = utils.prevSibling(current))) {
                    const xIf = utils.getDirective(current, 'if');
                    const currentTestDir = xIf || utils.getDirective(current, 'elif');
                    if (!currentTestDir) {
                        return;
                    }
                    // @ts-expect-error
                    if (currentTestDir.value[0]?.expression) {
                        const currentOrOperands = buildOrOperands(
                            // @ts-expect-error
                            currentTestDir.value[0].expression
                        );

                        for (const condition of listToCheck) {
                            const operands = (condition.operands = condition.operands.filter(
                                orOperand => !currentOrOperands.operands.some(currentOrOperand =>
                                    isSubset(currentOrOperand, orOperand))
                            ));
                            if (!operands.length) {
                                context.report({
                                    // @ts-expect-error
                                    node: condition.node,
                                    messageId: 'unexpected'
                                });
                                return;
                            }
                        }
                    }

                    if (xIf) {
                        return;
                    }
                }
            }
        });
    }
} as RuleModule;
