import type { Rule } from '../rules';
import type {
    Result
} from '../util';

export default {

    tagName: 'keygen',

    getCategories(element) {
        return [
            'flow content',
            'phrasing content',
            'interactive content',
            'listed, labelable, submittable, resettable, and reassociateable form-associated element',
            'palpable content'
        ];
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
