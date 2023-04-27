import type { Rule } from '../rules';
import type {
    Result
} from '../util';

export default {

    tagName: 'ruby',

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
        // TODO: content: raw - see prose
        return result;
    }
} as Rule;
