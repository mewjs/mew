import type {
    Node,
    Element,
    Document,
    DomHandlerOptions
} from "domhandler";
import {
    DomHandler
} from "domhandler";
import * as ElementType from "domelementtype";
import type { ParserOptions } from "./Parser";
import { Parser } from "./Parser";

export { ElementType };
export type { ParserOptions };
export { Parser };


export type { DomHandlerOptions };
export { DomHandler };

type Options = ParserOptions & DomHandlerOptions;

// Helper methods

/**
 * Parses the data, returns the resulting document.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 */
export function parseDocument(data: string, options?: Options): Document {
    const handler = new DomHandler(void 0, options);
    new Parser(handler, options).end(data);
    return handler.root;
}

/**
 * Parses data, returns an array of the root nodes.
 *
 * Note that the root nodes still have a `Document` node as their parent.
 * Use `parseDocument` to get the `Document` node instead.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 * @deprecated Use `parseDocument` instead.
 */
export function parseDOM(data: string, options?: Options): Node[] {
    return parseDocument(data, options).children;
}

/**
 * Creates a parser instance, with an attached DOM handler.
 *
 * @param cb A callback that will be called once parsing has been completed.
 * @param options Optional options for the parser and DOM builder.
 * @param elementCb An optional callback that will be called every time a tag has been completed inside of the DOM.
 */
export function createDomStream(
    cb: (error: Error | null, dom: Node[]) => void,
    options?: Options,
    elementCb?: (element: Element) => void
): Parser {
    const handler = new DomHandler(cb, options, elementCb);
    return new Parser(handler, options);
}

export type { Callbacks as TokenizerCallbacks } from "./Tokenizer";
export { default as Tokenizer } from "./Tokenizer";

/*
 * All of the following exports exist for backwards-compatibility.
 * They should probably be removed eventually.
 */

export * from "./FeedHandler";
export * as DomUtils from "domutils";

// Old names for Dom- & FeedHandler
export { DomHandler as DefaultHandler };
export { FeedHandler as RssHandler } from "./FeedHandler";
