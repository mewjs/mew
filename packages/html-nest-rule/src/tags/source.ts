import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    getNodeInfo,
    isTag,
    isCategory,
    isNot
} from '../util';

export default {

    tagName: 'source',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as a child of a media element, before any flow content or track elements
        if (element.parentElement) {
            // as a child of a media element
            if (isNot('media element', element.parentElement)) {
                result.push({
                    expect: 'as a child of a media element',
                    got: getNodeInfo(element.parentElement),
                    target: element
                } as Result);
            }

            // before any flow content or track elements
            for (let prev = element; (prev = prev.previousElementSibling);) {
                if (
                    isTag('track', prev)
                    || isCategory('flow content', prev)
                ) {
                    result.push({
                        expect: 'before any flow content or track elements',
                        target: element
                    } as Result);
                }
            }
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // empty
        if (element.childNodes.length) {
            result.push({ expect: 'empty' } as Result);
        }

        return result;
    }
} as Rule;
