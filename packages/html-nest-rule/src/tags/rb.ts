import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory
} from '../util';

export default {

    tagName: 'rb',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // TODO: context: raw - as a child of a ruby element
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
