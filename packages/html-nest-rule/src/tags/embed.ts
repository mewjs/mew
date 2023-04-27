import type { Rule } from '../rules';
import type {
    Result
} from '../util';

export default {

    tagName: 'embed',

    getCategories(element) {
        return [
            'flow content',
            'phrasing content',
            'embedded content',
            'interactive content',
            'palpable content'
        ];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - embedded content
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
