import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    isTag,
    isNotTag,
    getNodeInfo,
    walkDescendants
} from '../util';

export default {

    tagName: 'caption',

    getCategories(element) {
        return [];
    },

    validateContext(element) {
        const result: Result[] = [];
        // context: raw - as the first element child of a table element
        if (
            element.parentElement
            && (
                isNotTag('table', element.parentElement)
                || element.parentElement.children.indexOf(element) !== 0
            )
        ) {
            result.push({
                expect: 'as the first element child of a table element',
                got: getNodeInfo(element.parentElement),
                target: element
            } as Result);
        }

        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - flow content, but with no descendant table elements

        // flow content
        result.push(...validateCategory('flow content', children));

        // but with no descendant table elements
        walkDescendants(element, descendant => {
            // no descendant table elements
            if (isTag('table', descendant)) {
                result.push({
                    expect: 'with no descendant table elements',
                    got: getNodeInfo(descendant),
                    target: descendant
                } as Result);
            }
        });

        return result;
    }
} as Rule;
