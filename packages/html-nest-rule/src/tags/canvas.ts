import type { HTMLElement } from '@mewjs/dom';
import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    getRule
} from '../util';

export default {

    tagName: 'canvas',

    getCategories(element) {
        return ['flow content', 'phrasing content', 'embedded content', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - embedded content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // transparent
        const rule = element.parentElement && getRule(element.parentElement as HTMLElement);
        if (rule) {
            result.push(...rule.validateContent(element));
        }

        return result;
    }
} as Rule;
