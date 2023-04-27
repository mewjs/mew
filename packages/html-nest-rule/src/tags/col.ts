import type { HTMLElement } from '@mewjs/dom';
import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    getNodeInfo,
    isNotTag
} from '../util';

export default {

    tagName: 'col',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as a child of a colgroup element that doesn't have a span attribute
        if (
            element.parentElement
            && (
                isNotTag('colgroup', element.parentElement)
                || (element.parentElement as HTMLElement).hasAttribute('span')
            )
        ) {
            result.push({
                expect: 'as a child of a colgroup element that doesn\'t have a span attribute',
                got: getNodeInfo(element.parentElement),
                target: element
            } as Result);
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
