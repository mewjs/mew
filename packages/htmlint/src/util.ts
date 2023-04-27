import { EventEmitter } from 'events';
import { isTag } from 'domelementtype';
import type { DomHandler, ParserEvent, HandlerEvent } from '@mewjs/htmlparser2';
import { Parser } from '@mewjs/htmlparser2';
import type { HTMLElement } from '@mewjs/dom/lib';
import type { Configuration, Configs } from './typings/types';

const { hasOwnProperty } = Object.prototype;

export const isElement = isTag;

// http://www.w3.org/TR/html5/syntax.html#elements-0
const voidElements = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
]);

export const isVoidElement = (tag: string) => voidElements.has(tag);

export function extend<T>(target: Partial<T>, src: T): T;
export function extend<T>(target: T, src: Partial<T>): T;
export function extend<T, R>(target: T, src: R): T & R;
export function extend<T>(target: Partial<T>, src: Partial<T>): Partial<T>;

/**
 * Copy properties from src to target.
 *
 * @param {Object} target - target object
 * @param {?Object} src - src object
 * @return {Object} target object
 */
export function extend<T>(target: Partial<T>, src: Partial<T>): T | Partial<T> {
    for (const key in src) {
        if (hasOwnProperty.call(src, key)) {
            target[key] = src[key];
        }
    }

    return target;
}

/**
 * Define attributes for target object.
 *
 * @param {Object} target - target object
 * @param {Object} attributes - attributes
 * @return {Object} target object
 */
export function extendAttribute<T extends object, U extends object>(target: T, attributes: U): T & U {
    for (const [name, value] of Object.entries(attributes)) {
        if (hasOwnProperty.call(attributes, name)) {
            Object.defineProperty(target, name, value);
        }
    }

    return target as (T & U);
}

export interface Getter {
    (key: string, refresh?: boolean, ...args: any[]): any;
    clear?(): void;
}

/**
 * Make given method result-cacheable.
 *
 * @param {Function} getter - given method
 * @return {Function} result method which caches result automatically
 * @property {Function} clear - clear cache
 */
export function cacheable(getter: Getter): Getter {
    const storage = new Map();

    const get: Getter = (key: string, refresh = false) => {
        if (refresh || !storage.has(key)) {
            storage.set(
                key,
                getter(key, refresh)
            );
        }

        return storage.get(key);
    };

    const clear = () => (storage.clear());

    get.clear = clear;

    return get;
}


export interface Position {
    line: number;
    column: number;
}

export type GetPosition = (index: number) => Position;

export function getPosition(content: string): GetPosition;
export function getPosition(content: string, index: number): Position;

/**
 * Get position (line & column) in or a position method for given content.
 *
 * @param {string} content - given content
 * @param {number=} index - target index
 * @return {Position|GetPosition} position method / position info
 */
export function getPosition(content: string, index = 0): GetPosition | Position {
    let start = 0;
    let line = 0;
    let column = 0;

    // the position method (index -> line & column)
    // indexes should be passed with pos-low-to-high
    const position: GetPosition = (index: number) => {
        for (; start < index; start++) {
            column++;

            if (content[start] === '\n') {
                column = 0;
                line++;
            }
        }

        return {
            line: line + 1,
            column: column + 1
        };
    };

    return index > 1 ? position(index) : position;
}

type CommentOperation = 'disable' | 'disable-next-line' | 'enable' | 'config';

interface CommentInfo {
    operation: CommentOperation;
    content: string[] | Record<string, string> | null;
}

/**
 * Extract config info from comment content.
 *
 * @param {string} comment - comment content
 * @return {?CommentInfo} config info
 */
export const extractCommentInfo = (comment: string): CommentInfo | null => {
    // htmlint-disable img-alt, attr-value-double-quotes
    const ablePattern = /^[\s\n]*htmlint-(\w+)(?:\s+([\w-]+(?:,\s*[\w-]+)*)?[\s\n]*)?$/;
    // htmlint "img-alt": false
    const configPattern = /^[\s\n]*htmlint\s([\s\S]*)$/;

    const result = ablePattern.exec(comment);

    if (result) {

        return {
            operation: result[1] as CommentOperation,
            content: result[2] ? result[2].split(/\s*,\s*/g) : null
        };
    }

    if (configPattern.test(comment)) {
        const rules = RegExp.$1
            .replace(/([a-zA-Z0-9\-/]+):/g, '"$1":')
            .replace(/(\]|[0-9])\s+(?=")/, '$1,');

        try {
            return {
                operation: 'config',
                content: JSON.parse(`{${ rules }}`)
            };
        }
        catch (e) {}
    }

    return null;
};

/**
 * Walk a tree (pre-order).
 *
 * @param {Object} root - the root node of the tree
 * @param {Function} handler - the handler
 * @param {string} childrenKey - key of children property
 */
export const walk = (root: HTMLElement, handler: (node: HTMLElement) => void, childrenKey = 'children') => {
    if (!root) {
        return;
    }

    handler(root);

    const list: HTMLElement[] = root[childrenKey]?.filter(isTag);
    list?.forEach(child => {
        walk(child, handler, childrenKey);
    });
};

export function getInlineConfigByIndex<T extends string | boolean | number | object>(
    rule: string,
    index: number,
    inlineConfig: Configs,
    initial: T
): T {
    let result = initial;

    const configs = inlineConfig?.[rule];
    if (!configs) {
        return result;
    }

    for (let i = 0, l = configs.length; i < l; i++) {
        if (index >= 0 && configs[i].index > index) {
            break;
        }

        result = configs[i].content as T;
    }

    return result;
}

export const getConfigByIndex = (
    rule: string,
    index: number,
    inlineConfig: Configs,
    config: Partial<Configuration>
) => getInlineConfigByIndex(rule, index, inlineConfig, config[rule]);

/**
 * Make target emittable &
 * emit event "Xyz" on target while target._cbs.onXyz called.
 *
 * @param {Object} target - the target
 * @param {string[]} events - events need to emit
 * @return {Object} target itself
 */
export function emittable<T extends Parser | DomHandler, E = T extends Parser ? ParserEvent : HandlerEvent>(
    target: T,
    events: (keyof E)[]
): T {

    // make target emittable
    Object.assign(target, EventEmitter.prototype);


    // wrap methods based on given event list
    events.forEach((eventName: keyof E) => {

        // emit "xxx" on target while method "onXyz" in cbs called
        const methodName = `on${ eventName as string }`;
        const method = target[methodName];

        target[methodName] = (...args: Parameters<typeof method>) => {
            method?.apply(target, args);

            if (target instanceof Parser) {
                // type eventType = keyof ParserEvent;
                target.emit(eventName as keyof ParserEvent, ...args);
            }
            else {
                // type eventType = keyof HandlerEvent;
                target.emit(eventName as keyof HandlerEvent, ...args);
            }
        };
    });

    return target;
}
