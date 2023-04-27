import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory
} from '../util';

export default {

    tagName: 'blockquote',

    getCategories(element) {
        return ['flow content', 'sectioning root', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - flow content
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
