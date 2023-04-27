import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    getNodeInfo,
    walkDescendants,
    getAncestors,
    isTag
} from '../util';

export default {

    tagName: 'header',

    getCategories(element) {
        return ['flow content', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // with no header or footer element ancestors
        getAncestors(element).forEach(ancestor => {
            if (isTag('header|footer', ancestor)) {
                result.push({
                    expect: 'with no footer or header element ancestors',
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

        // content: raw - flow content, but with no header, footer, or main element descendants

        // flow content
        result.push(...validateCategory('flow content', children));

        // but with no header, footer, or main element descendants
        walkDescendants(element, descendant => {
            if (isTag('header|footer|main', descendant)) {
                result.push({
                    expect: 'with no header, footer, or main element descendants',
                    got: getNodeInfo(descendant),
                    target: descendant
                } as Result);
            }
        });

        return result;
    }
} as Rule;
