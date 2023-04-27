import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateChildrenSequence,
    isTag,
    isNotCategory
} from '../util';

export default {

    tagName: 'table',

    getCategories(element) {
        return ['flow content', 'palpable content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - flow content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - in this order:
        //      optionally a caption element,
        //      followed by zero or more colgroup elements,
        //      followed optionally by a thead element,
        //      followed optionally by a tfoot element,
        //      followed by either zero or more tbody elements or one or more tr elements,
        //      followed optionally by a tfoot element (but there can only be one tfoot element child in total),
        //      optionally intermixed with one or more script-supporting elements
        result.push(...validateChildrenSequence({
            desc: [
                'optionally a caption element',
                'followed by zero or more colgroup elements',
                'followed optionally by a thead element',
                'followed optionally by a tfoot element',
                'followed by either zero or more tbody elements or one or more tr elements',
                'followed optionally by a tfoot element',
                'optionally intermixed with one or more script-supporting elements'
            ].join(', '),
            filter: isNotCategory('script-supporting element'),
            sequence: [
                ['caption', '?'],
                ['colgroup', '*'],
                ['thead', '?'],
                ['tfoot', '?'],
                // "tbody & tr should not show together" will be checked in following code
                ['tbody|tr', '*'],
                // "but there can only be one tfoot element child in total" will be checked in following code
                ['tfoot', '?']
            ]
        }, element));

        // tbody & tr should not show together
        if (
            children.some(isTag('tbody'))
            && children.some(isTag('tr'))
        ) {
            result.push({
                expect: 'containing either tbody elements or tr elements',
                got: 'tbody and tr',
                target: element
            } as Result);
        }

        // but there can only be one tfoot element child in total
        if (children.filter(isTag('tfoot')).length > 1) {
            result.push({
                expect: 'containing only one tfoot element child in total',
                target: element
            } as Result);
        }

        return result;
    }
} as Rule;
