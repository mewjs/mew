import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    getNodeInfo,
    walkDescendants,
    isTag
} from '../util';

export default {

    tagName: 'meter',

    getCategories(element) {
        return ['flow content', 'phrasing content', 'labelable element', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - phrasing content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - phrasing content, but there must be no meter element descendants

        // phrasing content
        result.push(...validateCategory('phrasing content', children));

        // but there must be no meter element descendants
        walkDescendants(element, descendant => {
            // no meter element descendants
            if (isTag('meter', descendant)) {
                result.push({
                    expect: 'with no meter element descendants',
                    got: getNodeInfo(descendant),
                    target: descendant
                } as Result);
            }
        });

        return result;
    }
} as Rule;
