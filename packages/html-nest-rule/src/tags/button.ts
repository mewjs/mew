import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    getNodeInfo,
    walkDescendants,
    isCategory
} from '../util';

export default {

    tagName: 'button',

    getCategories(element) {
        return [
            'flow content',
            'phrasing content',
            'interactive content',
            'listed, labelable, submittable, and reassociateable form-associated element',
            'palpable content'
        ];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - phrasing content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - phrasing content, but there must be no interactive content descendant

        // phrasing content
        result.push(...validateCategory('phrasing content', children));

        // but there must be no interactive content descendant
        walkDescendants(element, descendant => {
            // no interactive content descendant
            if (isCategory('interactive content', descendant)) {
                result.push({
                    expect: 'with no interactive content descendant',
                    got: getNodeInfo(descendant),
                    target: descendant
                } as Result);
            }
        });

        return result;
    }
} as Rule;
