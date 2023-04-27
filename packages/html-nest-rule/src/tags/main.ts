import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    getNodeInfo,
    getAncestors,
    isTag
} from '../util';

export default {

    tagName: 'main',

    getCategories(element) {
        return ['flow content', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - where flow content is expected, but with no article, aside, footer, header or nav element ancestors

        // IGNORE: context: is - flow content

        // but with no article, aside, footer, header or nav element ancestors
        getAncestors(element).forEach(ancestor => {
            if (isTag('article|aside|footer|header|nav', ancestor)) {
                result.push({
                    expect: 'with no article, aside, footer, header or nav element ancestors',
                    got: getNodeInfo(ancestor),
                    target: element
                } as Result);
            }
        });

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // is flow content
        result.push(...validateCategory('flow content', children));

        return result;
    }
} as Rule;
