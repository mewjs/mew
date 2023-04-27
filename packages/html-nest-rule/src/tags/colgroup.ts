import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateChildrenSequence,
    getNodeInfo,
    isTag,
    isNotTag
} from '../util';

export default {

    tagName: 'colgroup',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as a child of a table element, after any caption elements and before any thead, tbody, tfoot, and tr elements
        if (element.parentElement) {
            // as a child of an table element
            if (isNotTag('table', element.parentElement)) {
                result.push({
                    expect: 'as a child of an table element',
                    got: getNodeInfo(element.parentElement),
                    target: element
                } as Result);
            }

            // after any caption elements
            for (let next = element; (next = next.nextElementSibling);) {
                if (isTag('caption', next)) {
                    result.push({
                        expect: 'after any caption elements',
                        target: element
                    } as Result);
                    break;
                }
            }

            // before any thead, tbody, tfoot, and tr elements
            for (let prev = element; (prev = prev.previousElementSibling);) {
                if (isTag('thead|tbody|tfoot|tr', prev)) {
                    result.push({
                        expect: 'before any thead, tbody, tfoot, and tr elements',
                        target: element
                    } as Result);
                    break;
                }
            }
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // content: raw - if the span attribute is present: empty
        if (element.hasAttribute('span')) {
            if (element.childNodes.length) {
                result.push({ expect: 'empty' } as Result);
            }
        }
        // content: raw - if the span attribute is absent: zero or more col and template elements
        else {
            result.push(...validateChildrenSequence({
                desc: 'zero or more col and template elements',
                sequence: [['col|template', '*']]
            }, element));
        }

        return result;
    }
} as Rule;
