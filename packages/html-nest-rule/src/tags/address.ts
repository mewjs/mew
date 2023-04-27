import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    isTag,
    getNodeInfo,
    getNodeCategoriesInfo,
    walkDescendants,
    isCategory
} from '../util';

export default {

    tagName: 'address',

    getCategories(element) {
        return ['flow content', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - flow content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - flow content, but with no heading content descendants, no sectioning content descendants, and no header, footer, or address element descendants

        // flow content
        result.push(...validateCategory('flow content', children));

        // but with no heading content descendants, no sectioning content descendants, and no header, footer, or address element descendants
        walkDescendants(element, descendant => {
            // no heading content descendants, no sectioning content descendants
            if (isCategory('heading content|sectioning content', descendant)) {
                result.push({
                    expect: 'with no heading content descendants, no sectioning content descendants',
                    got: getNodeCategoriesInfo(descendant),
                    target: descendant
                } as Result);
            }

            // no header, footer, or address element descendants
            if (isTag('header|footer|address', descendant)) {
                result.push({
                    expect: 'with no header, footer, or address element descendants',
                    got: getNodeInfo(descendant),
                    target: descendant
                } as Result);
            }
        });

        return result;
    }
} as Rule;
