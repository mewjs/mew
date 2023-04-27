import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    getContentModelParent,
    getRule
} from '../util';

export default {

    tagName: 'ins',

    getCategories(element) {
        return ['flow content', 'phrasing content', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - phrasing content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // transparent
        const contentModelParent = getContentModelParent(element);
        const rule = contentModelParent && getRule(contentModelParent);

        if (rule) {
            result.push(...rule.validateContent(element));
        }

        return result;
    }
} as Rule;
