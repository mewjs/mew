import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    walkDescendants,
    isTag
} from '../util';

export default {

    tagName: 'dfn',

    getCategories(element) {
        return ['flow content', 'phrasing content', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - phrasing content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - phrasing content, but there must be no dfn element descendants

        // phrasing content
        result.push(...validateCategory('phrasing content', children));

        // but there must be no dfn element descendants
        walkDescendants(element, descendant => {
            if (isTag('dfn', descendant)) {
                result.push({
                    expect: 'no dfn element descendants',
                    target: descendant
                } as Result);
            }
        });

        return result;
    }
} as Rule;
