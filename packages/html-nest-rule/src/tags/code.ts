import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory
} from '../util';

export default {

    tagName: 'code',

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

        // is phrasing content
        result.push(...validateCategory('phrasing content', children));

        return result;
    }
} as Rule;
