import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    isNotTag
} from '../util';

export default {

    tagName: 'legend',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as the first child of a fieldset element
        if (
            element.parentElement
            && (
                isNotTag('fieldset', element.parentElement)
                || element.parentElement.children.indexOf(element) !== 0
            )
        ) {
            result.push({
                expect: 'as the first element in an fieldset element',
                target: element
            } as Result);
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // is phrasing content
        result.push(...validateCategory('phrasing content', children));

        return result;
    }
} as Rule;
