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

    tagName: 'form',

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

        // content: raw - flow content, but with no form element descendants

        // flow content
        result.push(...validateCategory('flow content', children));

        // but with no form element descendants
        walkDescendants(element, descendant => {
            // no form element descendants
            if (isTag('form', descendant)) {
                result.push({
                    expect: 'with no form element descendants',
                    got: getNodeInfo(descendant),
                    target: descendant
                } as Result);
            }
        });

        return result;
    }
} as Rule;
