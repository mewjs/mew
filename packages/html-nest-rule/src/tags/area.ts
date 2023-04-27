import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    getAncestors,
    isTag
} from '../util';

export default {

    tagName: 'area',

    getCategories(element) {
        return ['flow content', 'phrasing content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - where phrasing content is expected, but only if there is a map element ancestor or a template element ancestor

        // only if there is a map element ancestor or a template element ancestor
        if (!getAncestors(element).some(isTag('map|template'))) {
            result.push({
                expect: 'with a map element ancestor or a template element ancestor',
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
