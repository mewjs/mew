import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateChildrenSequence,
    getNodeInfo,
    isNotTag
} from '../util';

export default {

    tagName: 'optgroup',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as a child of a select element
        if (
            element.parentElement
            && isNotTag('select', element.parentElement)
        ) {
            result.push({
                expect: 'as a child of an select element',
                got: getNodeInfo(element.parentElement),
                target: element
            } as Result);
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // content: raw - zero or more option and script-supporting elements
        result.push(...validateChildrenSequence({
            desc: 'zero or more option and script-supporting elements',
            sequence: [['option|category:script-supporting element', '*']]
        }, element));

        return result;
    }
} as Rule;
