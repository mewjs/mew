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

    tagName: 'thead',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as a child of a table element, after any caption, and colgroup elements and before any tbody, tfoot, and tr elements, but only if there are no other thead elements that are children of the table element

        if (element.parentElement) {
            // as a child of an table element
            if (isNotTag('table', element.parentElement)) {
                result.push({
                    expect: 'as a child of an table element',
                    got: getNodeInfo(element.parentElement),
                    target: element
                } as Result);
            }

            // after any caption, and colgroup elements
            for (let next = element; (next = next.nextElementSibling);) {
                if (isTag('caption|colgroup', next)) {
                    result.push({
                        expect: 'after any caption, and colgroup elements',
                        target: element
                    } as Result);
                    break;
                }
            }

            // before any tbody, tfoot, and tr elements
            for (let prev = element; (prev = prev.previousElementSibling);) {
                if (isTag('tbody|tfoot|tr', prev)) {
                    result.push({
                        expect: ' before any tbody, tfoot, and tr elements',
                        target: element
                    } as Result);
                    break;
                }
            }

            // but only if there are no other thead elements that are children of the table element
            if (element.parentElement.children.filter(isTag('thead')).length > 1) {
                result.push({
                    expect: 'there are no other thead elements that are children of the table element',
                    target: element
                } as Result);
            }
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // content: raw - zero or more tr and script-supporting elements
        result.push(...validateChildrenSequence({
            desc: 'zero or more tr and script-supporting elements',
            sequence: [['tr|category:script-supporting element', '*']]
        }, element));

        return result;
    }
} as Rule;
