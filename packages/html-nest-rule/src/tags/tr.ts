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

    tagName: 'tr',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as a child of a thead element
        // context: raw - as a child of a tbody element
        // context: raw - as a child of a tfoot element
        // context: raw - as a child of a table element, after any caption, colgroup, and thead elements, but only if there are no tbody elements that are children of the table element

        // as a child of a thead element
        // as a child of a tbody element
        // as a child of a tfoot element
        // as a child of a table element
        if (
            element.parentElement
            && isNotTag('thead|tbody|tfoot|table', element.parentElement)
        ) {
            result.push({
                expect: 'as a child of a thead element, a tbody element, a tfoot element or a table element',
                got: getNodeInfo(element.parentElement),
                target: element
            } as Result);
        }

        if (isTag('table', element.parentElement)) {
            // after any caption, colgroup, and thead elements
            for (let next = element; (next = next.nextElementSibling);) {
                if (isTag('caption|colgroup|thead', next)) {
                    result.push({
                        expect: 'after any caption, colgroup, and thead elements',
                        target: element
                    } as Result);
                    break;
                }
            }

            // but only if there are no tbody elements that are children of the table element
            if (element.parentElement.children.filter(isTag('tbody')).length > 0) {
                result.push({
                    expect: 'there are no tbody elements that are children of the table element',
                    target: element
                } as Result);
            }
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // content: raw - zero or more td, th, and script-supporting elements
        result.push(...validateChildrenSequence({
            desc: 'zero or more td, th, and script-supporting elements',
            sequence: [['td|th|category:script-supporting element', '*']]
        }, element));

        return result;
    }
} as Rule;
