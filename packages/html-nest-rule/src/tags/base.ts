import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    isTag,
    isNotTag
} from '../util';

export default {

    tagName: 'base',

    getCategories(element) {
        return ['metadata content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - in a head element containing no other base elements
        const parent = element.parentElement;
        if (
            parent
            && (
                isNotTag('head', parent)
                || parent.children.filter(isTag('base')).length > 1
            )
        ) {
            result.push({
                expect: 'in a head element containing no other base elements',
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
