import { isTag as isElement } from '@mewjs/dom';
import type { Rule } from '../rules';
import type { Result } from '../util';
import {
    getNodeInfo,
    isNotTag,
    isNot
} from '../util';

export default {

    tagName: 'option',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as a child of a select element
        // context: raw - as a child of a datalist element
        // context: raw - as a child of an optgroup element
        if (
            element.parentElement
            && isNotTag('select|datalist|optgroup', element.parentElement)
        ) {
            result.push({
                expect: 'as a child of a select element, a datalist element or an optgroup element',
                got: getNodeInfo(element.parentElement),
                target: element
            } as Result);
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - if the element has a label attribute and a value attribute: empty
        if (
            element.hasAttribute('label')
            && element.hasAttribute('value')
        ) {
            if (element.childNodes.length) {
                result.push({ expect: 'empty' } as Result);
            }
        }

        // content: raw - if the element has a label attribute but no value attribute: text
        if (
            element.hasAttribute('label')
            && !element.hasAttribute('value')
        ) {
            if (children.filter(isElement).length > 0) {
                result.push({ expect: 'text' } as Result);
            }
        }

        // content: raw - if the element has no label attribute: text that is not inter-element whitespace
        if (!element.hasAttribute('label')) {
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
        }

        return result;
    }
} as Rule;
