import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    getNodeInfo,
    isTag,
    isNotTag,
    isNotCategory
} from '../util';

export default {

    tagName: 'ol',

    getCategories(element) {
        const categories = ['flow content'];

        // if the element's children include at least one li element: palpable content
        if (element.children.some(isTag('li'))) {
            categories.push('palpable content');
        }

        return categories;
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - flow content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - zero or more li and script-supporting elements
        children.forEach(child => {
            if (
                isNotTag('li', child)
                && isNotCategory('script-supporting element', child)
            ) {
                result.push({
                    expect: 'li and script-supporting elements',
                    got: getNodeInfo(child),
                    target: child
                } as Result);
            }
        });

        return result;
    }
} as Rule;
