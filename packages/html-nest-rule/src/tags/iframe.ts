import type { Rule } from '../rules';
import type {
    Result
} from '../util';

export default {

    tagName: 'iframe',

    getCategories(element) {
        return ['flow content', 'phrasing content', 'embedded content', 'interactive content', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - embedded content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // TODO: content: raw - text that conforms to the requirements given in the prose
        return result;
    }
} as Rule;
