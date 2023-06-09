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

    tagName: 'tbody',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as a child of a table element, after any caption, colgroup, and thead elements, but only if there are no tr elements that are children of the table element
        if (element.parentElement) {
            // as a child of an table element
            if (isNotTag('table', element.parentElement)) {
                result.push({
                    expect: 'as a child of an table element',
                    got: getNodeInfo(element.parentElement),
                    target: element
                } as Result);
            }

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

            // but only if there are no tr elements that are children of the table element
            if (element.parentElement.children.filter(isTag('tr')).length > 0) {
                result.push({
                    expect: 'there are no tr elements that are children of the table element',
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
