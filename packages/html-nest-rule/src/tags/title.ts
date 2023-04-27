import type { HTMLElement } from '@mewjs/dom';
import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    isNot,
    isNotTag
} from '../util';

export default {

    tagName: 'title',

    getCategories(element) {
        return ['metadata content'];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - in a head element containing no other title elements
        const parent = element.parentElement as HTMLElement;
        if (
            parent
            && (
                isNotTag('head', parent)
                || parent.getElementsByTagName('title').length > 1
            )
        ) {
            result.push({
                expect: 'in a head element containing no other title elements',
                target: element
            } as Result);
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // content: raw - text that is not inter-element whitespace
        if (!(
            element.childNodes.length === 1
            && element.childNodes[0].nodeType === 3
            && isNot('inter-element whitespace', element.childNodes[0])
        )) {
            result.push({
                expect: 'text that is not inter-element whitespace',
                target: element
            } as Result);
        }

        return result;
    }
} as Rule;
