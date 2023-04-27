import type { HTMLElement } from '@mewjs/dom';
import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    isTag
} from '../util';

export default {

    tagName: 'template',

    getCategories(element) {
        return ['metadata content', 'flow content', 'phrasing content', 'script-supporting element'];
    },

    validateContext(element) {
        const result: Result[] = [];
        const parentElement = element.parentElement as HTMLElement;
        // IGNORE: context: is - metadata content
        // IGNORE: context: is - phrasing content
        // IGNORE: context: is - script-supporting elements

        // as a child of a colgroup element that doesn't have a span attribute
        // -> content of [ colgroup ]
        if (
            parentElement
            && isTag('colgroup', parentElement)
            && parentElement.hasAttribute('span')
        ) {
            result.push({
                expect: 'as a child of a colgroup element that doesn\'t have a span attribute',
                target: element
            } as Result);
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // IGNORE: content: raw - either: metadata content
        // IGNORE: content: raw - or: flow content
        // IGNORE: content: raw - or: the content model of ol and ul elements
        // IGNORE: content: raw - or: the content model of dl elements
        // IGNORE: content: raw - or: the content model of figure elements
        // IGNORE: content: raw - or: the content model of ruby elements
        // IGNORE: content: raw - or: the content model of object elements
        // IGNORE: content: raw - or: the content model of video and audio elements
        // IGNORE: content: raw - or: the content model of table elements
        // IGNORE: content: raw - or: the content model of colgroup elements
        // IGNORE: content: raw - or: the content model of thead, tbody, and tfoot elements
        // IGNORE: content: raw - or: the content model of tr elements
        // IGNORE: content: raw - or: the content model of fieldset elements
        // IGNORE: content: raw - or: the content model of select elements

        return result;
    }
} as Rule;
