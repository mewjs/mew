import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    validateChildrenSequence,
    getSequenceInfo
} from '../util';

export default {

    tagName: 'datalist',

    getCategories(element) {
        return ['flow content', 'phrasing content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - phrasing content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - either: phrasing content (with zero or more option elements descendants)
        // content: raw - or: zero or more option elements
        if (
            validateCategory('phrasing content', children).length
            && validateChildrenSequence({
                desc: 'zero or more option elements',
                sequence: [['option', '*']]
            }, element).length
        ) {
            result.push({
                expect: 'either phrasing content, or zero or more option elements',
                got: getSequenceInfo(element.children),
                target: element
            } as Result);
        }

        return result;
    }
} as Rule;
