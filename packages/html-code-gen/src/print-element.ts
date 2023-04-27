/* eslint-disable no-template-curly-in-string */
import type HTMLNode from '@mewjs/dom';
import { indent, format, isIn } from './util';
import { tagTypeMap, booleanAttributes } from './spec';
import { print, printAsync } from './print';

const array = Array.prototype;

export interface Config {
    [key: string]: any;
}

export interface Attribute {
    name: string;
    value: string;
}

export interface Info {
    tag: string;
    start: string;
    end: string;
    sep: string;
    children: string[];
    indent: string;
    innerIndent: string;
    attributes: string;
}

type ConditionKeys = 'isVoid' | 'isHtml' | 'noFormat' | 'inline' | 'isRawText' | 'newLine';
type Condition = Record<ConditionKeys, boolean>;


function indentWithinCharSize(opt: Config) {
    return indent(opt.level, opt['indent-char'], opt['indent-size']);
}

function printAttribute(attribute: Attribute, opt: Config) {
    // boolean attribute
    if (isIn(attribute.name, booleanAttributes)) {
        if (
            opt['bool-attribute-value'] === 'remove'
            || !attribute.value
        ) {
            return attribute.name;
        }
    }

    return format('${ name }="${ value }"', attribute);
}

function printAttributes(attributes: Attribute[], opt: Config) {
    if (!attributes) {
        return '';
    }

    return array.map.call(attributes, (attribute: Attribute) => printAttribute(attribute, opt)).join(' ');
}

function printVoidElementNode(info: Partial<Info>, node: HTMLNode, condition: Condition, opt: Config) {
    const tpl = opt['self-close'] === 'close'
        ? '<${ tag }${ attributes } />'
        : '<${ tag }${ attributes }>';
    return format(tpl, info);
}

function packageElement(info: Info, content: string) {
    const parts = (
        content
            ? [
                info.start,
                content,
                info.end
            ]
            : [
                info.start,
                info.end
            ]
    );
    return parts.join(info.sep);
}

function removeBlankLineAround(content: string) {
    return content.replace(/(^(\s*\n)+)|((\n\s*)+$)/g, '');
}

function makePrintRawTextElementNode(async: false):
(info: Info, node: HTMLNode, condition: Condition, opt: Config) => string;
function makePrintRawTextElementNode(async: true):
(info: Info, node: HTMLNode, condition: Condition, opt: Config) => Promise<string>;

function makePrintRawTextElementNode(async: boolean) {
    return (info: Info, node: HTMLNode, condition: Condition, opt: Config) => {
        const formatter = opt.formatter[info.tag] || removeBlankLineAround;

        const contentOpt: Config = { ...opt };
        contentOpt.level++;

        function indentContent(content: string, indentOpt: Config) {
            indentOpt = indentOpt || contentOpt;

            return content
                .split('\n')
                .map(line => (line ? (indentWithinCharSize(indentOpt) + line) : line))
                .join('\n');
        }

        const content = node.childNodes.length
            ? formatter((node.childNodes[0] as HTMLNode).textContent, node, contentOpt, {
                indent: indentContent,
                trim: removeBlankLineAround
            })
            : '';

        if (!async) {
            return packageElement(info, content);
        }

        return Promise.resolve(content).then(content => packageElement(info, content));
    };
}

const printRawTextElementNode = makePrintRawTextElementNode(false);
const printRawTextElementNodeAsync = makePrintRawTextElementNode(true);

function printNormalElementNode(info: Info, node: HTMLNode, condition: Condition) {
    const children = (
        condition.newLine
            ? info.children.map(child => {
                child = child.trim();
                return child ? (info.innerIndent + child) : child;
            }).filter(Boolean)
            : info.children
    );

    const content = children.join(info.sep);

    return packageElement(info, content);
}

function makePrintElementNode(async: false): (node: HTMLNode, opt: Config) => string;
function makePrintElementNode(async: true): (node: HTMLNode, opt: Config) => Promise<string>;
function makePrintElementNode(async: boolean) {
    // format method for general element
    return (node: HTMLNode, opt: Config) => {

        const tag = node.tagName.toLowerCase();
        const attributesStr = printAttributes(node.attributes, opt);

        const noFormat = opt['no-format'] || isIn(tag, opt['no-format-tag']);
        const inline = isIn(tag, opt['inline-tag']) || !node.childNodes.length;
        // conditions
        const condition: Condition = {
            isVoid: isIn(tag, tagTypeMap.void),
            isHtml: tag === 'html',
            noFormat,
            inline,
            isRawText: isIn(tag, tagTypeMap['raw-text']),
            newLine: !(noFormat || inline)
        };


        // node info
        const partialInfo: Partial<Info> = {
            indent: indentWithinCharSize(opt),
            tag,
            attributes: attributesStr ? ` ${ attributesStr }` : ''
        };

        // void elements
        if (condition.isVoid) {
            return printVoidElementNode(partialInfo, node, condition, opt);
        }

        // new opt for next-level (child) nodes
        const newOpt = { ...opt };

        // no-format should be inherited
        if (condition.noFormat) {
            newOpt['no-format'] = true;
        }

        // increase level
        // do not indent 'head' & 'body' (under 'html')
        if (!condition.isHtml) {
            newOpt.level++;
        }

        // tag start & end
        const info = {
            ...partialInfo,
            start: format('<${tag}${attributes}>', partialInfo),
            end: (condition.newLine ? partialInfo.indent : '') + format('</${tag}>', partialInfo),
            sep: condition.newLine ? '\n' : '',
            // indent for child nodes
            innerIndent: indentWithinCharSize(newOpt)
        } as Info;

        // raw text ( 'script' / 'style' )
        if (condition.isRawText) {
            return (
                async
                    ? printRawTextElementNodeAsync(info, node, condition, opt)
                    : printRawTextElementNode(info, node, condition, opt)
            );
        }

        if (!async) {
            info.children = node.childNodes.map(node => print(node as HTMLNode, newOpt));

            return printNormalElementNode(info, node, condition);
        }

        return Promise.all(
            /* eslint-disable-next-line require-await */
            node.childNodes.map(async node => printAsync(node as HTMLNode, newOpt))
        ).then(children => {
            info.children = children;
            return printNormalElementNode(info, node, condition);
        });
    };
}

export const printElementNode = makePrintElementNode(false);
export const printElementNodeAsync = makePrintElementNode(true);
