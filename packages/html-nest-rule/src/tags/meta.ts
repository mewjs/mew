import type HTMLNode from '@mewjs/dom';
import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    getNodeInfo,
    isTag,
    isNotTag
} from '../util';

export default {

    tagName: 'meta',

    getCategories(element) {
        return ['metadata content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - if the charset attribute is present, or if the element's http-equiv attribute is in the encoding declaration state: in a head element
        if (
            element.hasAttribute('charset')
            || element.getAttribute('http-equiv') === 'content-type'
        ) {
            if (
                element.parentElement
                && isNotTag('head', element.parentElement)
            ) {
                result.push({
                    expect: 'in a head element',
                    got: getNodeInfo(element.parentElement),
                    target: element
                } as Result);
            }
        }

        // context: raw - if the http-equiv attribute is present but not in the encoding declaration state: in a head element
        // context: raw - if the http-equiv attribute is present but not in the encoding declaration state: in a noscript element that is a child of a head element
        if (
            element.hasAttribute('http-equiv')
            && element.getAttribute('http-equiv') !== 'content-type'
        ) {
            if (
                element.parentElement
                && isNotTag('head', element.parentElement)
                && !(
                    isTag('noscript', element.parentElement)
                    && isTag('head', (element.parentElement as HTMLNode).parentElement)
                )
            ) {
                result.push({
                    expect: 'in a head element or in a noscript element that is a child of a head element',
                    target: element
                } as Result);
            }
        }

        // IGNORE: context: raw - if the name attribute is present: where metadata content is expected

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // empty
        if (element.children.some(node => node.nodeType === 1)) {
            result.push({ expect: 'empty' } as Result);
        }

        return result;
    }
} as Rule;
