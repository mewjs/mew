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

    tagName: 'figure',

    getCategories(element) {
        return ['flow content', 'sectioning root', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - flow content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - either: one figcaption element followed by flow content
        // content: raw - or: flow content followed by one figcaption element

        const figcaptionChildren = children.filter(isTag('figcaption'));

        // at most one figcaption element
        if (figcaptionChildren.length > 1) {
            result.push({
                expect: 'at most one figcaption element',
                got: `${ figcaptionChildren.length } figcaption elements`,
                target: element
            } as Result);
        }

        // figcaption element to be the first or last child
        figcaptionChildren.forEach(figcaptionChild => {
            if (
                figcaptionChild !== element.firstElementChild
                && figcaptionChild !== element.lastElementChild
            ) {
                result.push({
                    expect: 'figcaption element to be the first or last child',
                    target: figcaptionChild
                } as Result);
            }
        });

        // content: raw - or: flow content
        result.push(...validateCategory(
            'flow content',
            children.filter(isNotTag('figcaption'))
        ));

        return result;
    }
} as Rule;
