import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    getNodeCategoriesInfo,
    getNodeInfo,
    walkDescendants,
    isCategory,
    isTag,
    isNotTag
} from '../util';

export default {

    tagName: 'dt',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - before dd or dt elements inside dl elements
        if (element.parentElement) {
            // as a child of an dl element
            if (isNotTag('dl', element.parentElement)) {
                result.push({
                    expect: 'as a child of an dl element',
                    got: getNodeInfo(element.parentElement),
                    target: element
                } as Result);
            }

            // before dd or dt elements
            for (let next = element; (next = next.nextElementSibling);) {
                if (isNotTag('dd|dt', next)) {
                    result.push({
                        expect: 'before dd or dt elements',
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
        const { children } = element;

        // content: raw - flow content, but with no header, footer, sectioning content, or heading content descendants

        // flow content
        result.push(...validateCategory('flow content', children));

        // but with no header, footer, sectioning content, or heading content descendants
        walkDescendants(element, descendant => {
            // no header, footer element descendants
            if (isTag('header|footer', descendant)) {
                result.push({
                    expect: 'with no header, footer element descendants',
                    got: getNodeInfo(descendant),
                    target: descendant
                } as Result);
            }

            // no sectioning content or heading content descendants
            if (isCategory('sectioning content|heading content', descendant)) {
                result.push({
                    expect: 'with no sectioning content or heading content descendants',
                    got: getNodeCategoriesInfo(descendant),
                    target: descendant
                } as Result);
            }
        });

        return result;
    }
} as Rule;
