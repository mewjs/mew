import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    getNodeInfo,
    walkDescendants,
    isTag
} from '../util';

export default {

    tagName: 'nav',

    getCategories(element) {
        return ['flow content', 'sectioning content', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - flow content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - flow content, but with no main element descendants

        // flow content
        result.push(...validateCategory('flow content', children));

        // but with no main element descendants
        walkDescendants(element, descendant => {
            if (isTag('main', descendant)) {
                result.push({
                    expect: 'with no main element descendants',
                    got: getNodeInfo(descendant),
                    target: descendant
                } as Result);
            }
        });

        return result;
    }
} as Rule;
