import type { Rule } from '../rules';
import type {
    Result
} from '../util';
import {
    validateCategory,
    getNodeInfo,
    walkDescendants,
    isTag
} from '../util';

export default {

    tagName: 'label',

    getCategories(element) {
        return [
            'flow content',
            'phrasing content',
            'interactive content',
            'reassociateable form-associated element',
            'palpable content'
        ];
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - phrasing content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;
        // content: raw - phrasing content, but with no descendant labelable elements unless it is the element's labeled control, and no descendant label elements

        // phrasing content
        result.push(...validateCategory('phrasing content', children));

        // but with no descendant labelable elements unless it is the element's labeled control, and no descendant label elements
        walkDescendants(element, descendant => {
            // with no descendant labelable elements unless it is the element's labeled control
            // "The label element represents a caption in a user interface. The caption can be associated with a specific form control, known as the label element's labeled control, either using the for attribute, or by putting the form control inside the label element itself"
            // so skip check here.

            // no descendant label elements
            if (isTag('label', descendant)) {
                result.push({
                    expect: 'with no descendant label elements',
                    got: getNodeInfo(descendant),
                    target: descendant
                } as Result);
            }
        });

        return result;
    }
} as Rule;
