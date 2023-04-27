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

    tagName: 'dd',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - after dt or dd elements inside dl elements
        if (element.parentElement) {
            // as a child of an dl element
            if (isNotTag('dl', element.parentElement)) {
                result.push({
                    expect: 'as a child of an dl element',
                    got: getNodeInfo(element.parentElement),
                    target: element
                } as Result);
            }

            // after dt or dd elements
            for (let prev = element; (prev = prev.previousElementSibling);) {
                if (isNotTag('dt|dd', prev)) {
                    result.push({
                        expect: 'after dt or dd elements',
                        target: element
                    } as Result);
                    break;
                }
            }
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
