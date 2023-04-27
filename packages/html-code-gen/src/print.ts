/* eslint-disable @typescript-eslint/no-use-before-define */
import type HTMLNode from '@mewjs/dom';
import { tagTypeMap, NodeType } from './spec';
import type {
    Config
} from './print-element';
import {
    printElementNode,
    printElementNodeAsync
} from './print-element';

const array = Array.prototype;

// TEXT_NODE
function printTextNode(node: HTMLNode, opt: Config) {
    const content = node.textContent ?? '';
    return opt['no-format']
        ? content
        : content.replace(/[\s\n\r]+/g, ' ');
}

// COMMENT_NODE
function printCommentNode(node: HTMLNode) {
    return `<!--${ node.textContent }-->`;
}

// CDATA_SECTION_NODE
function printCDATASectionNode(node: HTMLNode) {
    return `<![CDATA[${ node.textContent }]]>`;
}

// DOCUMENT_TYPE_NODE
function printDocumentTypeNode(node: HTMLNode) {
    if (!node.publicId && !node.systemId) {
        return `<!DOCTYPE ${ node.name }>`;
    }

    let output = `<!DOCTYPE ${ node.name }`;

    if (node.publicId) {
        output += ' PUBLIC';
        output += ` "${ node.publicId }"`;
    }
    else {
        output += ' SYSTEM';
    }

    if (node.systemId) {
        output += ` "${ node.systemId }"`;
    }

    output += '>';

    return output;
}

// DOCUMENT_NODE
function printDocumentNode(node: HTMLNode, opt: Config) {
    return array.map
        .call(node.childNodes, (node: HTMLNode): string => print(node, opt))
        .filter(content => (content as string).trim())
        .join('\n');
}

async function printDocumentNodeAsync(node: HTMLNode, opt: Config) {
    const children = await Promise.all(
        /* eslint-disable-next-line require-await */
        array.map.call(node.childNodes, async node => printAsync(node, opt))
    );
    return children
        .filter(content => (content as string).trim())
        .join('\n');
}

function makePrint(async: false): (node: HTMLNode, opt: Config) => string;
function makePrint(async: true): (node: HTMLNode, opt: Config) => Promise<string>;
function makePrint(async: boolean) {
    return (node: HTMLNode, opt: Config): string | Promise<string> => {

        // default options
        opt = {
            // size of indent
            'indent-size': 4,
            // char of indent ( space / tab )
            'indent-char': 'space',
            // max char num in one line
            'max-char': 80,
            // tags whose content should not be formatted
            'no-format-tag': tagTypeMap.structural,
            // no format
            'no-format': false,
            // tags whose content should be inline
            'inline-tag': tagTypeMap.inline,
            // special formatters { tagName ( script / style ) : formatter }
            'formatter': {},
            // hide value of boolean attribute or not ( 'remove' / 'preserve' )
            'bool-attribute-value': 'remove',
            // Should void tags close themselves with "/" ( 'close' / 'no-close' )
            'self-close': 'no-close',
            // current level
            'level': 0,
            ...opt
        };

        let output: string | Promise<string>;

        switch (node.nodeType) {

            case NodeType.TEXT_NODE:
                output = printTextNode(node, opt);
                break;

            case NodeType.COMMENT_NODE:
                output = printCommentNode(node);
                break;

            case NodeType.CDATA_SECTION_NODE:
                output = printCDATASectionNode(node);
                break;

            case NodeType.DOCUMENT_TYPE_NODE:
                output = printDocumentTypeNode(node);
                break;

            case NodeType.DOCUMENT_NODE:
                output = (
                    async
                        ? printDocumentNodeAsync
                        : printDocumentNode
                )(node, opt);
                break;

            case NodeType.ELEMENT_NODE:
                output = (
                    async
                        ? printElementNodeAsync
                        : printElementNode
                )(node, opt);
                break;

            default:
                output = '';
        }

        return (
            async
                ? Promise.resolve(output)
                : output
        );

    };
}

export const print = makePrint(false);
export const printAsync = makePrint(true);
