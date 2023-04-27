import { isTag as isElement } from '@mewjs/dom';
import type { Rule } from '../rules';
import type {
    Result
} from '../util';


export default {

    tagName: 'textarea',

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
        const { children } = element;

        // text
        if (children.filter(isElement).length) {
            result.push({ expect: 'text' } as Result);
        }

        return result;
    }
} as Rule;
