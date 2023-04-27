import type { Rule } from '../rules';
import type {
    Result
} from '../util';

export default {

    tagName: 'rtc',

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
        // TODO: content: raw - phrasing content or rt elements
        return result;
    }
} as Rule;
