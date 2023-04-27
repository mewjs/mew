import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    getContentModelParent,
    getRule,
    getNodeInfo,
    walkDescendants,
    isCategory
} from '../util';

export default {

    tagName: 'a',

    getCategories(element) {
        return ['flow content', 'phrasing content', 'interactive content', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - phrasing content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // content: raw - transparent, but there must be no interactive content descendant
        // transparent
        const contentModelParent = getContentModelParent(element);
        const rule = contentModelParent && getRule(contentModelParent);

        if (rule) {
            result.push(...rule.validateContent(element));
        }

        // but there must be no interactive content descendant
        walkDescendants(element, function handler(descendant) {
            if (isCategory('interactive content', descendant)) {
                result.push({
                    expect: 'no interactive content descendant',
                    got: getNodeInfo(descendant),
                    target: element
                } as Result);
            }
        });

        return result;
    }
} as Rule;
