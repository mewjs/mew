import type { Rule } from '../rules';
import type {
    Result
} from '../util';

export default {

    tagName: 'style',

    getCategories(element) {
        return ['metadata content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - metadata content
        // IGNORE: context: raw - in a noscript element that is a child of a head element
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // content: raw - depends on the value of the type attribute, but must match requirements described in prose below
        return result;
    }
} as Rule;
