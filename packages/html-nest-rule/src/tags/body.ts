import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    isNotTag
} from '../util';

export default {

    tagName: 'body',

    getCategories(element) {
        return ['sectioning root'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as the second element in an html element
        if (
            element.parentElement
            && (
                isNotTag('html', element.parentElement)
                || element.parentElement.children.filter(node => node.nodeType === 1).indexOf(element) !== 1
            )
        ) {
            result.push({
                expect: 'as the second element in an html element',
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
