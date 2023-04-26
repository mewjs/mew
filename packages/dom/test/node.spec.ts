import { parseDocument } from 'htmlparser2';
import { ElementType } from 'domelementtype';
import type { HTMLDocument } from '../src';
import HTMLNode, { NodeType, HTMLElement, transformRecursively } from '../src';

describe('deal non-standard node', () => {

    describe('empty node', () => {
        const node = null;
        it('should return right result', () => {
            expect(HTMLNode.init(node) instanceof HTMLNode).toBe(true);
        });
    });

    describe('illegal node', () => {
        const node = {
            name: 'illegal',
            data: ''
        };

        it('should return right result', () => {
            expect(HTMLNode.init(node) instanceof HTMLNode).toBe(true);
        });
    });

    describe('illegal directive node', () => {
        const node = {
            type: ElementType.Directive,
            name: 'illegal',
            data: ''
        };

        it('should return right result', () => {
            expect(HTMLNode.init(node) instanceof HTMLNode).toBe(true);
        });
    });

    describe('a node instance', () => {
        const node = HTMLNode.init({
            type: ElementType.Directive,
            name: 'node',
            data: ''
        });
        const node2 = HTMLNode.init(node);

        it('should return itself', () => {
            expect(node2 === node).toBe(true);
        });
    });
});

describe('node properties', () => {
    const document = transformRecursively(
        parseDocument(
            '<document><p><span></span><i></i></p></document>'
        ).children[0] as HTMLNode
    ) as HTMLDocument;

    it('should have node properties', () => {

        const p = document.childNodes[0] as HTMLElement;
        const span = p.firstChild as HTMLElement;
        const i = p.lastChild as HTMLElement;

        expect(span.ownerDocument).toBe(document);

        expect(span.parentElement).toBe(p);
        expect(document.parentElement).toBe(null);

        expect(span.firstChild).toBe(null);
        expect(span).toBe(p.childNodes[0]);

        expect(i.lastChild).toBe(null);
        expect(i).toBe(p.childNodes[p.childNodes.length - 1]);

        expect(document.previousSibling).toBe(null);
        expect(p.previousSibling).toBe(null);
        expect(i.previousSibling).toBe(span);

        expect(document.nextSibling).toBe(null);
        expect(p.nextSibling).toBe(null);
        expect(span.nextSibling).toBe(i);
    });
});

describe('node methods (read ops)', () => {
    const p = transformRecursively(
        parseDocument(
            '<p><span></span>'
            + '<a id="x" class="y z" href="#" data-role="test" disabled>'
            + '<img id="c1" class="cls">'
            + '<span id="c2" class="cls"></span>'
            + '</a>'
            + '<i></i></p>'
        ).children[0] as HTMLNode
    );

    const p2 = transformRecursively(parseDocument('<p></p>').children[0] as HTMLNode);

    it('should have node methods', () => {

        const node = p.childNodes[1] as HTMLElement;

        expect(node.hasChildNodes()).toBe(true);
        expect(HTMLElement.init(node.firstChild).hasChildNodes()).toBe(false);

        expect(node.isEqualNode(node)).toBe(true);
        expect(node.isEqualNode(p)).toBe(false);
        expect(node.isEqualNode(node.firstChild!)).toBe(false);

        expect(node.compareDocumentPosition(node)).toBe(0);
        expect([35, 37].includes(node.compareDocumentPosition(null))).toBe(true);
        expect([35, 37].includes(node.compareDocumentPosition(p2))).toBe(true);
        expect(node.compareDocumentPosition(p)).toBe(10);
        expect(node.compareDocumentPosition(node.firstChild as HTMLNode)).toBe(20);
        expect(node.compareDocumentPosition(node.previousSibling as HTMLNode)).toBe(2);
        expect(node.compareDocumentPosition(node.nextSibling as HTMLNode)).toBe(4);

        expect(node.contains(node.childNodes[0])).toBe(true);
        expect((node.parentNode as HTMLNode).contains(node.childNodes[0])).toBe(true);
        expect((node.previousSibling as HTMLNode).contains(node.childNodes[0])).toBe(false);
    });
});

describe('method insertBefore', () => {
    const document = transformRecursively(
        parseDocument(
            '<document><html><body>'
            + '<a>'
            + '<img id="c1" class="cls">'
            + '<span id="c2" class="cls"></span>'
            + '</a>'
            + '</body></html></document>'
        ).children[0] as HTMLNode
    ) as HTMLDocument;

    const p = transformRecursively(
        parseDocument('<p></p>').children[0] as HTMLNode
    );


    // const body = document.querySelector('body');
    const a = document.querySelector('body a')!;
    const img = document.querySelector('a img')!;
    const span = document.querySelector('a span')!;

    it('should works well', () => {
        a.insertBefore(span, img);
        expect(a.firstChild).toBe(span);
        expect(a.lastChild).toBe(img);
        expect(span.previousSibling).toBe(null);
        expect(span.nextSibling).toBe(img);
        expect(img.previousSibling).toBe(span);
        expect(img.nextSibling).toBe(null);

        a.insertBefore(p, img);
        expect(a.childNodes.length).toBe(3);
        expect(a.childNodes[1]).toBe(p);
        expect(p.parentNode).toBe(a);
        expect(img.previousSibling).toBe(p);
        expect(span.nextSibling).toBe(p);
        expect(p.previousSibling).toBe(span);
        expect(p.nextSibling).toBe(img);
        expect(p.ownerDocument).toBe(document);
    });
});

describe('method appendChild', () => {
    const document = transformRecursively(
        parseDocument(
            '<document><html><body>'
                + '<a>'
                + '<img id="c1" class="cls">'
                + '<span id="c2" class="cls"></span>'
                + '</a>'
                + '</body></html></document>'
        ).children[0] as HTMLNode
    ) as HTMLDocument;

    const p = transformRecursively(
        parseDocument('<p></p>').children[0] as HTMLNode
    );

    const a = document.querySelector('a')!;
    const img = a.firstChild!;
    const span = a.lastChild!;

    it('should works well', () => {
        a.appendChild(img);
        expect(a.firstChild).toBe(span);
        expect(a.lastChild).toBe(img);
        expect(span.previousSibling).toBe(null);
        expect(span.nextSibling).toBe(img);
        expect(img.previousSibling).toBe(span);
        expect(img.nextSibling).toBe(null);

        a.appendChild(p);
        expect(a.childNodes.length).toBe(3);
        expect(a.lastChild).toBe(p);
        expect(p.parentNode).toBe(a);
        expect(p.ownerDocument).toBe(document);
        expect(p.previousSibling).toBe(img);
        expect(p.nextSibling).toBe(null);
        expect(img.nextSibling).toBe(p);
    });
});

describe('method replaceChild', () => {
    const document = transformRecursively(
        parseDocument(
            '<document><html><body>'
            + '<a>'
            + '<img id="c1" class="cls">'
            + '<span id="c2" class="cls"></span>'
            + '<i></i>'
            + '</a>'
            + '</body></html></document>'
        ).children[0] as HTMLNode
    ) as HTMLDocument;

    const p = transformRecursively(
        parseDocument('<p></p>').children[0] as HTMLNode
    );

    const a = document.querySelector('body a')!;
    const img = a.firstChild as HTMLNode;
    const span = a.childNodes[1] as HTMLNode;
    const i = a.lastChild as HTMLNode;

    it('should works well', () => {
        a.replaceChild(img, i);
        expect(a.childNodes.length).toBe(2);
        expect(a.firstChild).toBe(span);
        expect(a.lastChild).toBe(img);
        expect(span.previousSibling).toBe(null);
        expect(span.nextSibling).toBe(img);
        expect(img.previousSibling).toBe(span);
        expect(img.nextSibling).toBe(null);

        a.replaceChild(p, span);
        expect(a.childNodes.length).toBe(2);
        expect(a.firstChild).toBe(p);
        expect(p.parentNode).toBe(a);
        expect(p.ownerDocument).toBe(document);
        expect(p.previousSibling).toBe(null);
        expect(p.nextSibling).toBe(img);
        expect(img.previousSibling).toBe(p);
        expect(img.nextSibling).toBe(null);
    });
});

describe('method removeChild', () => {
    const document = transformRecursively(
        parseDocument(
            '<document><html><body>'
            + '<a>'
            + '<img id="c1" class="cls">'
            + '<i></i>'
            + '<span id="c2" class="cls"></span>'
            + '</a>'
            + '</body></html></document>'
        ).children[0] as HTMLNode
    ) as HTMLDocument;


    const a = document.querySelector('body a')!;
    const img = a.firstChild as HTMLElement;
    const span = a.childNodes[1] as HTMLElement;
    const i = a.lastChild as HTMLElement;

    it('should works well', () => {
        a.removeChild(i);
        expect(a.childNodes.length).toBe(2);
        expect(a.firstChild).toBe(img);
        expect(a.lastChild).toBe(span);
        expect(img.previousSibling).toBe(null);
        expect(img.nextSibling).toBe(span);
        expect(span.previousSibling).toBe(img);
        expect(span.nextSibling).toBe(null);
        expect(i.ownerDocument).toBe(null);
        expect(i.parentNode).toBe(null);
        expect(i.previousSibling).toBe(null);
        expect(i.nextSibling).toBe(null);

        a.removeChild(span);
        expect(a.childNodes.length).toBe(1);
        expect(a.firstChild).toBe(img);
        expect(a.lastChild).toBe(img);
        expect(img.previousSibling).toBe(null);
        expect(img.nextSibling).toBe(null);
        expect(span.previousSibling).toBe(null);
        expect(span.nextSibling).toBe(null);
    });
});

describe('text node', () => {

    const p = transformRecursively(
        parseDocument('<p><span></span>aaa<i></i></p>').children[0] as HTMLNode
    );

    it('should behave like a text node', () => {
        const node = p.childNodes[1] as HTMLNode;

        expect(node.nodeName).toBe('#text');
        expect(node.nodeType).toBe(NodeType.TEXT_NODE);
        expect(node.nodeValue).toBe('aaa');
        expect(node.textContent).toBe('aaa');

        expect((node.parentNode as HTMLElement).tagName).toBe('P');
        expect(node.parentElement).toBe(node.parentNode);
        expect((node.previousSibling as HTMLElement).tagName).toBe('SPAN');
        expect((node.nextSibling as HTMLElement).tagName).toBe('I');
    });
});

describe('doctype node', () => {
    let node = parseDocument('<!DOCTYPE html>').children[0] as HTMLNode;

    it('should behave like a doctype node', () => {
        node = HTMLNode.init(node);

        expect(node.name).toBe('html');
        expect(node.nodeName).toBe('html');
        expect(node.nodeType).toBe(NodeType.DOCUMENT_TYPE_NODE);
    });
});

describe('cdata node', () => {
    const node = {
        type: ElementType.CDATA,
        data: ''
    };

    it('should behave like a cdata node', () => {
        const htmlNode = HTMLNode.init(node);

        expect(htmlNode.nodeName).toBe('#cdata');
        expect(htmlNode.nodeType).toBe(NodeType.CDATA_SECTION_NODE);
    });
});

describe('comment node', () => {
    const p = transformRecursively(
        parseDocument('<p><span></span><!--aaa--><i></i></p>').children[0] as HTMLNode
    );

    it('should behave like a comment node', () => {
        transformRecursively(p);
        const node = p.childNodes[1] as HTMLNode;

        expect(node.nodeName).toBe('#comment');
        expect(node.nodeType).toBe(NodeType.COMMENT_NODE);
        expect(node.nodeValue).toBe('aaa');
        expect(node.textContent).toBe('aaa');

        expect((node.parentNode as HTMLElement).tagName).toBe('P');
        expect(node.parentElement).toBe(node.parentNode);
        expect((node.previousSibling as HTMLElement).tagName).toBe('SPAN');
        expect((node.nextSibling as HTMLElement).tagName).toBe('I');
    });
});

describe('document node', () => {
    const node = transformRecursively(
        parseDocument(
            '<document><!DOCTYPE html>'
            + '<html><head></head><body></body></html></document>'
        ).children[0] as HTMLNode
    ) as HTMLDocument;

    it('should behave like a document node', () => {
        expect(node.nodeName).toBe('#document');
        expect(node.nodeType).toBe(NodeType.DOCUMENT_NODE);

        const doctype = node.doctype as HTMLNode;
        expect(doctype.nodeName).toBe('html');
        expect(doctype.nodeType).toBe(NodeType.DOCUMENT_TYPE_NODE);

        expect(node.querySelector('body')!.ownerDocument).toBe(node);

        expect(node.documentElement.tagName).toBe('HTML');
        expect(node.head!.tagName).toBe('HEAD');
        expect(node.body!.tagName).toBe('BODY');
    });
});

// TODO: CDATA
