import type { Rule } from '../rules';
import type {
    Result
} from '../util';

export default {

    tagName: 'script',

    getCategories(element) {
        return ['metadata content', 'flow content', 'phrasing content', 'script-supporting element'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - metadata content
        // IGNORE: context: is - phrasing content
        // IGNORE: context: is - script-supporting elements
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // IGNORE: content: raw - if there is no src attribute, depends on the value of the type attribute, but must match script content restrictions
        // IGNORE: content: raw - if there is a src attribute, the element must be either empty or contain only script documentation that also matches script content restrictions
        return result;
    }
} as Rule;
