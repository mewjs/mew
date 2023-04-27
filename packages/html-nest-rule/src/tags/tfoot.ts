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

    tagName: 'tfoot',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as a child of a table element, after any caption, colgroup, and thead elements and before any tbody and tr elements, but only if there are no other tfoot elements that are children of the table element
        // context: raw - as a child of a table element, after any caption, colgroup, thead, tbody, and tr elements, but only if there are no other tfoot elements that are children of the table element

        if (element.parentElement) {
            // as a child of an table element
            if (isNotTag('table', element.parentElement)) {
                result.push({
                    expect: 'as a child of an table element',
                    got: getNodeInfo(element.parentElement),
                    target: element
                } as Result);
            }

            // after caption, colgroup, and thead elements
            for (let next = element; (next = next.nextElementSibling);) {
                if (isTag('caption|colgroup|thead', next)) {
                    result.push({
                        expect: 'after caption, colgroup, and thead elements',
                        target: element
                    } as Result);
                    break;
                }
            }

            // either before any tbody and tr elements, or after any tbody and tr elements
            let prev = element;
            let hasPrevTbodyTrElements = false;
            for (prev = element; (prev = prev.previousElementSibling);) {
                if (isTag('tbody|tr', prev)) {
                    hasPrevTbodyTrElements = true;
                    break;
                }
            }
            let hasNextTbodyTrElements = false;
            for (prev = element; (prev = prev.nextElementSibling);) {
                if (isTag('tbody|tr', prev)) {
                    hasNextTbodyTrElements = true;
                    break;
                }
            }
            if (hasPrevTbodyTrElements && hasNextTbodyTrElements) {
                result.push({
                    expect: 'either before any tbody and tr elements, or after any tbody and tr elements',
                    target: element
                } as Result);
            }

            // but only if there are no other tfoot elements that are children of the table element
            if (element.parentElement.children.filter(isTag('tfoot')).length > 1) {
                result.push({
                    expect: 'there are no other tfoot elements that are children of the table element',
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
