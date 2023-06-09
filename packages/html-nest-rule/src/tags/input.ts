import type { Rule } from '../rules';
import type {
    Result
} from '../util';

export default {

    tagName: 'input',

    getCategories(element) {
        const categories = ['flow content', 'phrasing content'];

        // if the type attribute is in the hidden state: listed, submittable, resettable, and reassociateable form-associated element
        if (element.getAttribute('type') === 'hidden') {
            categories.push('listed, submittable, resettable, and reassociateable form-associated element');
        }
        // if the type attribute is not in the hidden state: interactive content
        // if the type attribute is not in the hidden state: listed, labelable, submittable, resettable, and reassociateable form-associated element
        // if the type attribute is not in the hidden state: palpable content
        else {
            categories.push('interactive content');
            categories.push('listed, labelable, submittable, resettable, and reassociateable form-associated element');
            categories.push('palpable content');
        }

        return categories;
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
