import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    extend,
    getContentModelParent,
    getRule,
    isTag
} from '../util';

export default {

    tagName: 'object',

    getCategories(element) {
        const categories = [
            'flow content',
            'phrasing content',
            'embedded content',
            'listed, submittable, and reassociateable form-associated element',
            'palpable content'
        ];

        // if the element has a usemap attribute: interactive content
        if (element.hasAttribute('usemap')) {
            categories.push('interactive content');
        }

        return categories;
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - embedded content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // content: raw - zero or more param elements, then, transparent
        const contentModelParent = getContentModelParent(element);
        const rule = contentModelParent && getRule(contentModelParent);

        if (rule) {
            const childNodesWithoutStartingParamElements = (childNodes => {
                const firstNonParamTagIndex = childNodes
                    .findIndex(node => !isTag('param', node) && node.nodeType === 1);
                if (firstNonParamTagIndex < 1) {
                    return childNodes;
                }

                return childNodes.slice(firstNonParamTagIndex);
            })([...element.childNodes]);

            result.push(
                ...rule.validateContent(extend(Object.create(element), {
                    childNodes: childNodesWithoutStartingParamElements
                }))
            );
        }

        return result;
    }
} as Rule;
