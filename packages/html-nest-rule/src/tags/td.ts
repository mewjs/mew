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

    tagName: 'td',

    getCategories(element) {
        return ['sectioning root'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as a child of a tr element
        if (
            element.parentElement
            && isNotTag('tr', element.parentElement)
        ) {
            result.push({
                expect: 'as a child of an tr element',
                got: getNodeInfo(element.parentElement),
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
