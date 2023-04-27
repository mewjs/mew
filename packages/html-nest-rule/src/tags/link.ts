import type { Rule } from '../rules';
import type {
    Result
} from '../util';

export default {

    tagName: 'link',

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
        // empty
        if (element.childNodes.length) {
            result.push({ expect: 'empty' } as Result);
        }

        return result;
    }
} as Rule;
