import type { HTMLElement } from '@mewjs/dom';
import type { Rule } from '../rules';
import type {
    Result,
    Node
} from '../util';
import {
    getNodeInfo,
    isTag,
    isNotCategory
} from '../util';

export default {

    tagName: 'dl',

    getCategories(element) {
        const categories = ['flow content'];

        // A name-value group consists of one or more names (dt elements)
        // followed by one or more values (dd elements),
        // ignoring any nodes other than dt and dd elements
        function startsNameValueGroup(child: Node, index: number, children: Node[]) {
            return isTag('dt', child)
                && children.slice(index + 1).some(isTag('dd'));
        }

        // if the element's children include at least one name-value group: palpable content
        if (element.children.some(startsNameValueGroup)) {
            categories.push('palpable content');
        }

        return categories;
    },

    validateContext(element) {
        const result: Result[] = [];
        // IGNORE: context: is - flow content
        return result;
    },

    validateContent(element) {
        const result: Result[] = [];
        const { children } = element;

        // content: raw - zero or more groups each consisting of one or more dt elements
        // followed by one or more dd elements, optionally intermixed with script-supporting elements

        const childrenDtDd = (children as HTMLElement[]).filter(child => {
            if (isTag('dt|dd', child)) {
                return true;
            }

            // optionally intermixed with script-supporting elements
            if (isNotCategory('script-supporting element', child)) {
                result.push({
                    expect: 'dt, dd or script-supporting element',
                    got: getNodeInfo(child),
                    target: child
                } as Result);
            }

            return false;
        });

        const childrenDtDdTags = childrenDtDd.map(child => child.tagName).join(',');

        // zero or more groups each consisting of one or more dt elements followed by one or more dd elements
        if (childrenDtDdTags && !/^((DT,)+(DD(,|$))+)*$/.test(childrenDtDdTags)) {
            result.push({
                expect: 'zero or more groups each consisting of one or more dt elements '
                    + 'followed by one or more dd elements',
                got: childrenDtDdTags,
                target: element
            } as Result);
        }

        return result;
    }
} as Rule;
