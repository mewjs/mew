import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateChildrenSequence
} from '../util';

export default {

    tagName: 'select',

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
        // content: raw - zero or more option, optgroup, and script-supporting elements
        result.push(...validateChildrenSequence({
            desc: 'zero or more option, optgroup, and script-supporting elements',
            sequence: [['option|optgroup|category:script-supporting element', '*']]
        }, element));

        return result;
    }
} as Rule;
