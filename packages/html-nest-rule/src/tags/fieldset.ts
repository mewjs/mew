import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    getNodeCategoriesInfo,
    isTag,
    isCategory
} from '../util';

export default {

    tagName: 'fieldset',

    getCategories(element) {
        return [
            'flow content',
            'sectioning root',
            'listed and reassociateable form-associated element',
            'palpable content'
        ];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - flow content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - optionally a legend element, followed by flow content
        children.forEach((child, index) => {
            if (index === 0 && isTag('legend', children[0])) {
                return;
            }

            if (!isCategory('flow content', child)) {
                result.push({
                    expect: 'optionally a legend element, followed by flow content',
                    got: getNodeCategoriesInfo(child),
                    target: child
                } as Result);
            }
        });

        return result;
    }
} as Rule;
