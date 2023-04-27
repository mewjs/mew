import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    isNot,
    getNodeInfo,
    isCategory
} from '../util';

export default {

    tagName: 'track',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as a child of a media element, before any flow content
        if (element.parentElement) {
            // as a child of an media element
            if (isNot('media element', element.parentElement)) {
                result.push({
                    expect: 'as a child of an media element',
                    got: getNodeInfo(element.parentElement),
                    target: element
                } as Result);
            }

            // before any flow content
            for (let prev = element; (prev = prev.previousElementSibling);) {
                if (isCategory('flow content', prev)) {
                    result.push({
                        expect: 'before any flow content',
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
