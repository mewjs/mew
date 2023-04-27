import { curry } from 'lodash';
import type { Node, HTMLElement } from '@mewjs/dom';
import type HTMLNode from '@mewjs/dom';
import { isTag as isElement } from '@mewjs/dom';

import type { Rule } from './rules';
import { rules } from './rules';

export { extend } from 'lodash';

export { Node } from '@mewjs/dom';

export enum NodeType {
    ELEMENT_NODE = 1,
    ATTRIBUTE_NODE = 2,
    TEXT_NODE = 3,
    CDATA_SECTION_NODE = 4,
    ENTITY_REFERENCE_NODE = 5,
    ENTITY_NODE = 6,
    PROCESSING_INSTRUCTION_NODE = 7,
    COMMENT_NODE = 8,
    DOCUMENT_NODE = 9,
    DOCUMENT_TYPE_NODE = 10,
    DOCUMENT_FRAGMENT_NODE = 11
}


// export interface HTMLNode {
//     publicId?: string;
//     systemId?: string;
//     name: string;
//     tagName: string;
//     textContent: string;
//     nodeType: NodeType;
//     childNodes: HTMLNode[];
//     children: HTMLNode[];
//     attributes: Attribute[];
//     parentNode: HTMLNode;
//     parentElement: HTMLNode;
//     nextElementSibling: HTMLNode;
//     previousElementSibling: HTMLNode;
//     firstElementChild: HTMLNode;
//     lastElementChild: HTMLNode;
//     ownerDocument: HTMLNode;
//     hasAttribute(name: string): boolean;
//     getAttribute(name: string): string;
//     getElementsByTagName(name: string): HTMLNode[];
// }

export interface Attribute {
    name: string;
    value: string;
}
// const hasOwnProperty = Object.prototype.hasOwnProperty;
// export function extend<T>(target: Partial<T>, src: T) : T;
// export function extend<T>(target: T, src: Partial<T>) : T;
// export function extend<T, R>(target: T, src: R) : T & R;
// export function extend<T>(target: Partial<T>, src: Partial<T>) : Partial<T>;

// /**
//  * Copy properties from src to target.
//  *
//  * @param {Object} target - target object
//  * @param {?Object} src - src object
//  * @return {Object} target object
//  */
//  export function extend<T>(target: Partial<T>, src: Partial<T>): T | Partial<T> {
//     for (let key in src) {
//         if (hasOwnProperty.call(src, key)) {
//             target[key] = src[key];
//         }
//     }

//     return target;
// }

/**
 * Curry given method
 *
 * @param {Function} method - the given method
 * @param {?number} expects - expected num of arguments
 * @return {Function} curried method
 */
// export function curry<T extends Method, P = Parameters<T>>(method: T, expects: number = 0): Function {
//     expects = arguments.length <= 1 ? method.length : expects;

//     return function curried(...args: P[]) {
//         const given = args.length;
//         if (given >= expects) {
//             return method.apply(null, args);
//         }

//         return curry(
//             function (...rest) {
//                 return method.apply(
//                     null,
//                     args.concat(rest)
//                 );
//             },
//             expects - given
//         );
//     };
// };

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type IsMethod = (...args: any[]) => any;

/**
 * Oppose operation for curried methods
 *
 * @param {Function} method - the curried method
 * @return {Function} opposed method
 */
export function not(method: IsMethod): IsMethod {
    return function is(...args: Parameters<IsMethod>): ReturnType<IsMethod> {
        const returnValue = method(...args);

        return typeof returnValue === 'function'
            ? not(returnValue)
            : !returnValue;
    };
}

/**
 * Walk a tree (pre-order).
 *
 * @param {HTMLElement} root - the root node of the tree
 * @param {Function} handler - the handler
 * @param {string} childrenKey - key of children property
 */
export function walk(
    root: HTMLElement,
    handler: (element: HTMLElement) => void,
    childrenKey = 'children'
) {
    handler(root);

    (root[childrenKey] || []).forEach(child => {
        isElement(child) && walk(child, handler, childrenKey);
    });
}

/**
 * Get rule for given element.
 *
 * @param {Element} element - given element
 * @return {Rule|undefined} corresponding rule
 */
export function getRule(element: HTMLElement): Rule | undefined {
    return rules[element.tagName.toLowerCase()];
}

/**
 * Get categories of given element.
 *
 * @param {Element} element - given element
 * @return {string[]} element categories
 */
export function getCategories(element: HTMLElement): string[] {
    const rule = getRule(element)!;

    return rule
        ? rule.getCategories(element)
        : [];
}

/**
 * Get description for given element.
 *
 * @param {Element} element - given element
 * @return {string} element description
 */
export function getNodeInfo(element: Node): string {
    return `<${ (element as HTMLElement).tagName.toLowerCase() }>`;
}

/**
 * Get categories description of given element.
 *
 * @param {Element} element - given element
 * @return {string} element categories description
 */
export function getNodeCategoriesInfo(el: Node): string {
    const element = el as HTMLElement;
    const categories = getCategories(element);

    return `${ getNodeInfo(element) } ( ${
        categories.length
            ? categories.join(' | ')
            : 'none'
    } )`;
}

/**
 * Get description for given element sequence.
 *
 * @param {Element[]} sequence - given element sequence
 * @return {string} sequence description
 */
export function getSequenceInfo(sequence: Node[]): string {
    return `[ ${
        (sequence as HTMLElement[]).map(child => child.tagName.toLowerCase()).join(', ')
    } ]`;
}

/**
 * If given element matches given category(s).
 *
 * @param {string} expect - expected category(s)
 * @param {Element=} element - given element
 * @return {boolean|Function} if matches, or match method
 */
export const isCategory = curry((expect: string, el: Node) => {
    const element = el as HTMLElement;
    if (!getRule(element)) {
        return true;
    }

    const expects = expect.split('|');
    const categories = getCategories(element);
    return expects.some(expect => categories.includes(expect));
});

/**
 * If given element does not match given category.
 *
 * @param {string} expect - expected category
 * @param {Element=} element - given element
 * @return {boolean|Function} if does not matches, or match method
 */
export const isNotCategory = not(isCategory);

/**
 * If given element matches given tag(s).
 *
 * @param {string} expect - expected tag(s)
 * @param {Element=} element - given element
 * @return {boolean|Function} if matches, or match method
 */
export const isTag = curry((tag: string, element: Node) => {
    const el = element as HTMLElement;
    return el?.tagName ? tag.split('|').includes(el.tagName.toLowerCase()) : false;
});

/**
 * If given element does not match given tag(s).
 *
 * @param {string} expect - expected tag(s)
 * @param {Element=} element - given element
 * @return {boolean|Function} if does not match, or match method
 */
export const isNotTag = not(isTag);

/**
 * Get ancestors of given element.
 *
 * @param {Element} element - given element
 * @return {Array.Element} ancestors of given element
 */
export function getAncestors(element: HTMLNode): HTMLNode[] {
    const ancestors: HTMLElement[] = [];
    let parent: HTMLElement;

    while (element.parentElement) {
        parent = element.parentElement as HTMLElement;
        ancestors.push(parent);
        element = parent;
    }

    return ancestors;
}

type Handler = (target: HTMLElement) => void;

/**
 * Walk through all descendants of given element.
 *
 * @param {Element} element - given element
 * @param {Function} handler - handler to execute with each descendant
 */
export function walkDescendants(element: HTMLElement, handler: Handler) {
    walk(element, (target: HTMLElement) => {
        if (target !== element) {
            handler(target);
        }
    });
}

export interface Result {
    expect: string;
    got: string;
    target: HTMLElement;
}

/**
 * Validate categories of given elements.
 *
 * @param {string} expect - expected category
 * @param {Element[]} elements - given elements
 * @return {Array} validate result
 */
export function validateCategory(expect: string, elements: Node[] | HTMLElement[]): Result[] {
    return (elements as HTMLElement[]).reduce<Result[]>((result, target) => {
        if (isNotCategory(expect, target)) {
            result.push({
                expect,
                got: getNodeCategoriesInfo(target),
                target
            });
        }
        return result;
    }, []);
}

export type Sequence = HTMLNode | [string, string] | [string, number] | [Validator, number];

export interface Expect {
    filter?: (node: HTMLNode) => boolean;
    sequence: Sequence[];
    desc: string;
}

export type Validator = (element: HTMLElement) => boolean;

/**
 * Validate children sequence of given element.
 *
 * @param {Expect} expect - expected sequence info
 * @param {Array} expect.sequence - expected sequence
 * @param {string} expect.desc - description for expected sequence
 * @param {Function=} expect.filter - method for filter before validate
 * @param {Element} element - given element
 * @return {Result[]} validate result
 */
export function validateChildrenSequence(expect: Expect, element: HTMLElement): Result[] {
    let children = element.children.slice() as HTMLElement[];

    if (expect.filter) {
        children = children.filter(node => expect.filter!(node));
    }

    function createElementValidator(expectString: string): Validator {
        const expects = expectString.split('|');

        return function validator(element: HTMLElement) {
            return element && expects.reduce((valid: boolean, expect: string) => {
                let check: (expect: string, element: HTMLElement) => boolean = isTag;
                const prefix = 'category:';
                if (expect.startsWith(prefix)) {
                    expect = expect.slice(prefix.length);
                    check = isCategory;
                }
                return valid || check(expect, element);
            }, false);
        };
    }

    function unExpect(unexpected: HTMLNode): Result[] {
        return [
            {
                expect: expect.desc,
                got: getSequenceInfo(element.children as HTMLElement[]),
                target: element
            }
        ];
    }

    for (
        let i = 0,
            l = expect.sequence.length,
            expectInfo: Sequence,
            validate: Validator,
            quantifier: string;
        i < l;
        i++
    ) {
        expectInfo = expect.sequence[i];

        validate = typeof expectInfo[0] === 'function'
            ? expectInfo[0]
            : createElementValidator(expectInfo[0]);

        quantifier = expectInfo[1];

        switch (quantifier) {

            // zero or one
            case '?':
                if (validate(children[0])) {
                    children.shift();
                }
                break;

            // zero or more
            case '*':
                while (validate(children[0])) {
                    children.shift();
                }
                break;

            // one or more
            case '+':
                if (!validate(children[0])) {
                    return unExpect(children[0]);
                }

                do {
                    children.shift();
                }
                while (validate(children[0]));
                break;

            // exact quantifier
            default:
                // eslint-disable-next-line no-case-declarations
                let n = parseInt(quantifier);
                while (n--) {
                    if (!validate(children[0])) {
                        return unExpect(children[0]);
                    }
                    children.shift();
                }
                break;
        }
    }

    return children.length ? unExpect(children[0]) : [];
}

const TRANSPARENT_TAGS = new Set([
    'audio',
    'video',
    'a',
    'del',
    'ins',
    'map',
    'object'
]);

export function isTransparentContentModel({ tagName }: HTMLNode) {
    return TRANSPARENT_TAGS.has(tagName.toLowerCase());
}

export function getContentModelParent(element: HTMLElement): HTMLElement | null {

    while (element.parentElement) {

        if (!isTransparentContentModel(element.parentElement as HTMLElement)) {
            return element.parentElement as HTMLElement;
        }

        element = element.parentElement as HTMLElement;

    }

    return null;

}

type Define = (given?: HTMLNode) => boolean;
interface Defines {
    [key: string]: Define;
}

const defines: Defines = {
    // http://www.w3.org/TR/html5/dom.html#inter-element-whitespace
    'inter-element whitespace': function (given?: HTMLNode): boolean {
        return !given
            || (
                given.nodeType === NodeType.TEXT_NODE
                // eslint-disable-next-line no-control-regex
                && /^[\u0020\u0009\u000a\u000c\u000d]*$/.test(given.textContent!)
            );
    },
    // https://www.w3.org/TR/html5/embedded-content-0.html#media-element
    'media element': function (given?: HTMLNode): boolean {
        return !!given
            && ['audio', 'video'].includes(given.tagName.toLowerCase());
    }
};

export function isType(name: string, given: HTMLNode | undefined): boolean {
    const define = defines[name];

    return define
        ? define(given)
        : false;
}

export const is = curry(isType, 2);

export const isNot = not(is);
