import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    getNodeInfo,
    isNotTag
} from '../util';

export default {

    tagName: 'li',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: inside - ol elements
        // context: inside - ul elements
        const parent = element.parentElement;
        if (
            parent
            && isNotTag('ol|ul', parent)
        ) {
            result.push({
                expect: 'inside ol or ul elements',
                got: getNodeInfo(parent),
                target: element
            } as Result);
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // is flow content
        result.push(...validateCategory('flow content', children));

        return result;
    }
} as Rule;
