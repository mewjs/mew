import type { Rule } from '../rules';
import type {
    Result
} from '../util';


export default {

    tagName: 'svg',

    getCategories(element) {
        return ['embedded content', 'phrasing content', 'flow content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        return result;
    }
} as Rule;
