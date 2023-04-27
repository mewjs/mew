import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    isTag,
    isNotTag
} from '../util';

export default {

    tagName: 'head',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as the first element in an html element
        if (
            element.parentElement
            && (
                isNotTag('html', element.parentElement)
                || element.parentElement.children.filter(node => node.nodeType === 1).indexOf(element) !== 0
            )
        ) {
            result.push({
                expect: 'as the first element in an html element',
                target: element
            } as Result);
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - if the document is an iframe srcdoc document or if title information is available from a higher-level protocol: zero or more elements of metadata content, of which no more than one is a title element and no more than one is a base element
        // content: raw - otherwise: one or more elements of metadata content, of which exactly one is a title element and no more than one is a base element

        result.push(...validateCategory('metadata content', children));

        if (children.filter(isTag('title')).length > 1) {
            result.push({
                expect: 'no more than one title element',
                target: element
            } as Result);
        }

        if (children.filter(isTag('base')).length > 1) {
            result.push({
                expect: 'no more than one base element',
                target: element
            } as Result);
        }

        return result;
    }
} as Rule;
