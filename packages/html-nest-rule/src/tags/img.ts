import type { Rule } from '../rules';
import type {
    Result
} from '../util';

export default {

    tagName: 'img',

    getCategories(element) {
        const categories = [
            'flow content',
            'phrasing content',
            'embedded content',
            'form-associated element',
            'palpable content'
        ];

        // if the element has a usemap attribute: interactive content
        if (element.hasAttribute('usemap')) {
            categories.push('interactive content');
        }

        return categories;
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
