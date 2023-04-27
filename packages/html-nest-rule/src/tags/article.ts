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

    tagName: 'article',

    getCategories(element) {
        const categories = ['sectioning content', 'palpable content'];

        let hasMainElementDescendants = false;
        walkDescendants(element, descendant => {
            if (isTag('main', descendant)) {
                hasMainElementDescendants = true;
            }
        });

        if (!hasMainElementDescendants) {
            categories.unshift('flow content');
        }

        return categories;
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
