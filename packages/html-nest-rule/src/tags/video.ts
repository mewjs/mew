import type {
    Result
} from '../util';
import {
    getContentModelParent,
    getRule,
    getNodeInfo,
    walkDescendants,
    is,
    isTag
} from '../util';
import type { Rule } from '../rules';

const isMedia = is('media element');
export default {

    tagName: 'video',

    getCategories(element) {
        const categories = ['flow content', 'phrasing content', 'embedded content', 'palpable content'];

        // if the element has a controls attribute: interactive content
        if (element.hasAttribute('controls')) {
            categories.push('interactive content');
        }

        return categories;
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - embedded content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        // content: raw - if the element has a src attribute: zero or more track elements, then transparent, but with no media element descendants
        // content: raw - if the element does not have a src attribute: zero or more source elements, then zero or more track elements, then transparent, but with no media element descendants

        const hasSrcAttribute = element.hasAttribute('src');

        // transparent
        const contentModelParent = getContentModelParent(element);
        const rule = contentModelParent && getRule(contentModelParent);

        if (rule) {
            element.childNodes = element.childNodes.filter(child => {
                // if the element does not have a src attribute: zero or more source elements
                if (
                    !hasSrcAttribute
                    && isTag('source', child)
                ) {
                    return false;
                }

                // zero or more track elements
                if (isTag('track', child)) {
                    return false;
                }

                return true;
            });

            result.push(...rule!.validateContent(element));
        }

        // but with no media element descendants
        walkDescendants(element, descendant => {
            if (isMedia(descendant)) {
                result.push({
                    expect: 'with no media element descendants',
                    got: getNodeInfo(descendant),
                    target: descendant
                } as Result);
            }
        });

        return result;
    }
} as Rule;
