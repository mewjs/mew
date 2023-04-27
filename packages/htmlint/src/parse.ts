import type { ParserOptions } from '@mewjs/htmlparser2';
import {
    DomHandler,
    Parser,
    parseDocument
} from '@mewjs/htmlparser2';
import type { HTMLDocument } from '@mewjs/dom/lib';
import type HTMLNode from '@mewjs/dom/lib';
import { transformRecursively } from '@mewjs/dom/lib';
import { emittable } from './util';
import type { Document } from './typings/types';

/**
 * Wrap node list with <document>.
 *
 * @param doc document
 * @return document node
 */
function wrapDocument(doc: Document): HTMLDocument {
    const node = parseDocument('<document></document>').children[0] as HTMLNode;
    node.children = doc.children;
    const document = transformRecursively(node) as HTMLDocument;

    const nodes = document.children as HTMLNode[];
    for (const node of nodes) {

        // node.prev = nodes[i - 1] || null;
        // node.next = nodes[i + 1] || null;

        node.root = document;
        // node.parent = null;
    }

    // fix startIndex missing, cause <document> is parsed separately
    document.startIndex = document.documentElement && document.documentElement.startIndex | 0;

    return document;
}

/**
 * Get a HTML parser.
 *
 * @param {Object} options - options for create parser
 * @return {Parser} HTML parser
 */
function getParser(options: ParserOptions = {}): Parser {
    // merge with default options
    options = {
        lowerCaseTags: true,
        lowerCaseAttributeNames: false,
        recognizeCDATA: true,
        xmlMode: false,
        lintMode: true,
        recognizeSelfClosing: false,
        decodeEntities: false,
        ...options
    };

    // init handler
    const handler = new DomHandler(void 0, {
        withStartIndices: true,
        withEndIndices: true
    });

    // make parser emittable
    emittable(handler, [
        'processinginstruction',
        'comment',
        'commentend',
        'cdatastart',
        'text',
        'cdataend',
        'error',
        'closetag',
        'end',
        'reset',
        'parserinit',
        'opentagname',
        'opentag',
        'attribute'
    ]);


    // init parser
    const parser = new Parser(handler, options);

    emittable(parser, [
        'attribdata',
        'opentagname',
        'opentagend',
        'selfclosingtag',
        'attribname',
        'attribend',
        'closetag',
        'declaration',
        'processinginstruction',
        'comment',
        'cdata',
        'text',
        'error',
        'end'
    ]);

    // make handler accessible
    parser.handler = handler;

    return parser;
}

/**
 * Parse given html content to document node.
 *
 * @param {string} htmlCode - HTML code content
 * @param {Parser=} parser - given parser
 * @return {Node} document node
 */
export default function parse(htmlCode: string, parser: Parser = getParser()): HTMLDocument {
    // get parser
    // parser = parser || getParser();

    // replace "\r\n" with "\n"
    htmlCode = htmlCode.replace(/\r\n/g, '\n');

    // do parse
    parser.end(htmlCode);

    // get dom & wrap it with <document>
    return wrapDocument(parser.handler.root);
}

parse.getParser = getParser;
