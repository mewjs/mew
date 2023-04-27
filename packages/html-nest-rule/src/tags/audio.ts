import type HTMLNode from '@mewjs/dom';
import type { Rule } from '../rules';
import type { Result } from '../util';
import {
    extend,
    getContentModelParent,
    getRule,
    getNodeInfo,
    walkDescendants,
    isTag,
    is
} from '../util';

const isMedia = is('media element');

export default {

    tagName: 'audio',

    getCategories(element) {
        const categories = ['flow content', 'phrasing content', 'embedded content'];

        // if the element has a controls attribute: interactive content
        // if the element has a controls attribute: palpable content
        if (element.hasAttribute('controls')) {
            categories.push('interactive content');
            categories.push('palpable content');
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
            const nodes = (element.childNodes as HTMLNode[]).filter(child => {
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

            result.push(
                ...rule.validateContent(
                    extend(Object.create(element), { childNodes: nodes })
                )
            );

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
