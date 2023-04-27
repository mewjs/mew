import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    getAncestors,
    getNodeInfo,
    walkDescendants,
    isTag
} from '../util';

export default {

    tagName: 'noscript',

    getCategories(element) {
        return ['metadata content', 'flow content', 'phrasing content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - in a head element of an html document, if there are no ancestor noscript elements
        // context: raw - where phrasing content is expected in html documents, if there are no ancestor noscript elements

        // there are no ancestor noscript elements
        getAncestors(element).forEach(ancestor => {
            if (isTag('noscript', ancestor)) {
                result.push({
                    expect: 'with no ancestor noscript elements',
                    got: getNodeInfo(ancestor),
                    target: element
                } as Result);
            }
        });

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // IGNORE: content: raw - when scripting is disabled, in a head element: in any order, zero or more link elements, zero or more style elements, and zero or more meta elements
        // IGNORE: content: raw - when scripting is disabled, not in a head element: transparent, but there must be no noscript element descendants
        // IGNORE: content: raw - otherwise: text that conforms to the requirements given in the prose

        // there must be no noscript element descendants
        walkDescendants(element, descendant => {
            if (isTag('noscript', descendant)) {
                result.push({
                    expect: 'with no noscript element descendants',
                    got: getNodeInfo(descendant),
                    target: descendant
                } as Result);
            }
        });

        return result;
    }
} as Rule;
