import type { Rule } from '../rules';
import type {
    Result
} from '../util';

export default {

    tagName: 'br',

    getCategories(element) {
        return ['flow content', 'phrasing content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - phrasing content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // empty
        if (element.childNodes.length) {
            result.push({ expect: 'empty' } as Result);
        }

        return result;
    }
} as Rule;
