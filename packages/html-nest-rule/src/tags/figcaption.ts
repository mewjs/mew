import type { HTMLElement } from '@mewjs/dom';
import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    getNodeInfo,
    isNotTag
} from '../util';

export default {

    tagName: 'figcaption',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        const parentElement = element.parentElement as HTMLElement;
        // context: raw - as the first or last child of a figure element
        if (parentElement) {
            if (isNotTag('figure', parentElement)) {
                result.push({
                    expect: 'as the first or last child of a figure element',
                    got: getNodeInfo(parentElement),
                    target: element
                } as Result);
            }

            if (
                element !== parentElement.firstElementChild
                && element !== parentElement.lastElementChild
            ) {
                result.push({
                    expect: 'as the first or last child of a figure element',
                    target: element
                } as Result);
            }
        }

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
