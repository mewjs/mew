import type { Rule } from '../rules';
import type {
    Result
} from '../util';

export default {

    tagName: 'hr',

    getCategories(element) {
        return ['flow content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - flow content
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
