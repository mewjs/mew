import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateChildrenSequence
} from '../util';

export default {

    tagName: 'html',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as the root element of a document
        // context: raw - wherever a sub document fragment is allowed in a compound document
        if (element.ownerDocument !== element.parentNode) {
            result.push({
                expect: 'as the root element of a document',
                target: element
            } as Result);
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // content: raw - a head element followed by a body element
        result.push(...validateChildrenSequence({
            desc: 'a head element followed by a body element',
            filter(node) {
                return node.nodeType === 1;
            },
            sequence: [
                ['head', 1],
                ['body', 1]
            ]
        }, element));

        return result;
    }
} as Rule;
