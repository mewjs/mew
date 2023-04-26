/* eslint-disable max-lines */
import { ElementType, isTag as isElement } from 'domelementtype';
import { selectAll, selectOne, is } from 'css-select';
import type { Node, Document } from 'domhandler/lib/node';
import { Element } from 'domhandler/lib/node';

export { Node, Element, Document } from 'domhandler/lib/node';

export { ElementType, isTag } from 'domelementtype';

/**
 * Transform node to Node instance & recursively transform its children.
 *
 * @param {HTMLNode} node - given node
 * @param {HTMLNode=} root - root node
 * @return {HTMLNode} result node
 */
export const transformRecursively = function (node: Node | HTMLNode, root?: Node | HTMLNode): HTMLNode {
    root = root || node;

    const element = HTMLNode.init(node);

    for (let i = 0; i < element.childNodes?.length; i++) {
        element.childNodes[i] = transformRecursively(element.childNodes[i] as HTMLNode, root);
    }

    return element;
};


/**
 * Define attributes for target object.
 *
 * @param {Object} target - target object
 * @param {Object} attributes - attributes
 * @return {Object} target object
 */
function extendAttribute<T extends object, U extends object>(target: T, attributes: U): T & U {
    for (const [name, value] of Object.entries(attributes)) {
        if (Object.prototype.hasOwnProperty.call(attributes, name)) {
            Object.defineProperty(target, name, value);
        }
    }

    return target as (T & U);
}

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

const nodeTypes = new Map<ElementType, number>([
    [ElementType.Tag, NodeType.ELEMENT_NODE],
    [ElementType.Script, NodeType.ELEMENT_NODE],
    [ElementType.Style, NodeType.ELEMENT_NODE],
    [ElementType.Directive, NodeType.ELEMENT_NODE],
    [ElementType.Text, NodeType.TEXT_NODE],
    [ElementType.CDATA, NodeType.CDATA_SECTION_NODE],
    [ElementType.Comment, NodeType.COMMENT_NODE],
    [ElementType.Root, NodeType.DOCUMENT_NODE],
    [ElementType.Doctype, NodeType.DOCUMENT_TYPE_NODE]
]);

enum DocumentPosition {
    DOCUMENT_POSITION_DISCONNECTED = 0x01,
    DOCUMENT_POSITION_PRECEDING = 0x02,
    DOCUMENT_POSITION_FOLLOWING = 0x04,
    DOCUMENT_POSITION_CONTAINS = 0x08,
    DOCUMENT_POSITION_CONTAINED_BY = 0x10,
    DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20
}


// http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-102161490
export const DOMImplementation = {

    // hasFeature: function () { /*TODO*/ },
    // getFeature: function () { /*TODO*/ },

    /**
     * createDocumentType
     *
     * @param {string} qualifiedName qualified Name
     * @param {string} publicId public ID
     * @param {string} systemId system ID
     * @return {Node}
     */
    createDocumentType(qualifiedName: string, publicId: string, systemId: string): HTMLNode {
        return HTMLNode.createDocumentType({
            name: qualifiedName,
            publicId,
            systemId
        });
    },

    /**
     * createDocument
     *
     * @param {string} namespaceURI namespace URI
     * @param {string} qualifiedName qualified Name
     * @param {string} doctype document type
     * @return {Node}
     */
    createDocument(namespaceURI: string, qualifiedName: string, doctype: string): HTMLNode {
        return HTMLNode.createDocument({
            name: qualifiedName,
            namespaceURI,
            doctype
        });
    }

};


function cleanRelativeLink<T extends Node[]>(nodes: T) {
    if (!nodes.length) {
        return;
    }

    for (let i = 0, node: Node; (node = nodes[i]); i++) {
        node.prev = nodes[i - 1] || null;
        node.next = nodes[i + 1] || null;
    }
}


/**
 * class Node
 * 参考http://www.w3.org/TR/dom/#interface-node
 *
 * @constructor
 */
export default class HTMLNode extends Element {
    nodeName?: string;
    nodeValue?: string;
    textContent?: string = '';
    publicId?: string;
    systemId?: string;
    root?: Document;
    namespaceURI = '';

    data?: string;
    doctype?: string | Node = '';

    // static typeMap = NodeType;

    /**
     * Init a Node instance with given node.
     *
     * @param {Partial<HTMLNode>} nodeOptions - given node
     * @return {Node} result node
     */
    static init(node?: Partial<HTMLNode> | HTMLNode | null): HTMLNode {
        // empty node
        if (!node) {
            return new HTMLNode('', {});
        }

        // avoid repetitive construct
        if (node instanceof HTMLNode) {
            return node;
        }

        // @ts-expect-error
        node.__proto__ = HTMLNode.prototype;
        HTMLNode.extend(node);


        if (node.name === 'document') {
            return HTMLNode.createDocument(node);
        }

        if (isElement(node as Node)) {
            return HTMLNode.createElement(node);
        }

        switch (node.type) {

            case ElementType.Text:
                return HTMLNode.createTextNode(node);

            case ElementType.Directive:
                return HTMLNode.createDirective(node);

            case ElementType.Comment:
                return HTMLNode.createComment(node);

            case ElementType.CDATA:
                return HTMLNode.createCDATA(node);

            default:
                return node as HTMLNode;

        }
    }

    /**
     * Extend given node with attributes.
     *
     * @param {HTMLNode} node - given node
     * @return {HTMLNode} node itself
     */
    static extend(node: Partial<HTMLNode>): HTMLNode {

        Object.assign(node, {

            // fill later depending on node type
            type: node.type ?? ElementType.Tag,

            // fill later depending on node type
            nodeName: node.nodeName ?? '',

            // TODO
            baseURI: '',
            parentNode: node.parent || null,
            childNodes: node.children ?? [],

            // fill later depending on node type
            nodeValue: null,

            // fill later depending on node type
            textContent: node.textContent ?? ''
        });

        return node as HTMLNode;
    }

    /**
     * Create a Document node.
     *
     * @param {HTMLNode} node - given node
     * @return {Document} result Document node
     */
    static createDocument(node: Partial<HTMLNode>): HTMLDocument {
        node = node instanceof HTMLNode ? node : HTMLNode.init(node);

        const element = HTMLElement.init(node);

        const doctype = element.doctype
            || element.childNodes.filter(
                node => (node as HTMLNode).name  === '!doctype'
            )[0] || null;

        element.childNodes.forEach(node => (node.parentNode = element));

        // properties
        const document = Object.assign(element, {
            type: ElementType.Root,
            nodeName: '#document',
            // nodeValue: null,
            // textContent: null,

            implementation: DOMImplementation,
            doctype,
            documentElement: element.firstElementChild || null,

            head: element.querySelector('head'),
            body: element.querySelector('body')
        }) as unknown as HTMLDocument;

        return document;
    }

    /**
     * Create an Element node.
     *
     * @param {HTMLNode} node - given node
     * @return {HTMLElement} result Element node
     */
    static createElement(node: Partial<HTMLNode>): HTMLElement {
        node = node instanceof HTMLNode ? node : HTMLNode.init(node);

        return HTMLElement.init(Object.assign(node, {
            type: ElementType.Tag,
            nodeName: node.name?.toUpperCase(),
            textContent: node.data
        }));
    }

    /**
     * Create a TextNode node.
     *
     * @param {HTMLNode} node - given node
     * @return {HTMLNode} result TextNode node
     */
    static createTextNode(node: Partial<HTMLNode>): HTMLNode {
        node = node instanceof HTMLNode ? node : HTMLNode.init(node);

        return Object.assign(node, {
            type: ElementType.Text,
            nodeName: '#text',
            nodeValue: node.data,
            textContent: node.data
        }) as HTMLNode;
    }

    /**
     * Create a Directive node.
     *
     * @param {HTMLNode} node - given node
     * @return {HTMLNode} result Directive node
     */
    static createDirective(node: Partial<HTMLNode>): HTMLNode {
        node = node instanceof HTMLNode ? node : HTMLNode.init(node);

        switch (node.name) {

            case '!doctype':
                node.name = '';
                return HTMLNode.createDocumentType(node);

            default:
                return Object.assign(node, {
                    type: ElementType.Directive,
                    nodeValue: null,
                    textContent: null
                }) as HTMLNode;
        }
    }

    /**
     * Create a DocumentType node.
     *
     * @param {HTMLNode} node - given node
     * @return {HTMLNode} result DocumentType node
     */
    static createDocumentType(node: Partial<HTMLNode>): HTMLNode {
        node = node instanceof HTMLNode ? node : HTMLNode.init(node);

        const properties: string[] = [];
        if (node.data) {
            node.data.replace(/("[^"]+"(\s|$))|([^\n\r\s]+)/g, property => (
                properties.push(
                    property
                        .replace(/[\n\r]+/g, '')
                        .replace(/(^")|("$)/g, '')
                ),
                ''
            ));
        }

        const name = node.name || properties[1] || '';
        const isPublic = properties[2] === 'PUBLIC';
        const publicId = node.publicId || (isPublic ? properties[3] : '') || '';
        const systemId = node.systemId || (isPublic ? properties[4] : properties[3]) || '';

        Object.assign(node, {
            type: ElementType.Doctype,
            nodeValue: void 0,
            textContent: void 0,

            name,
            publicId,
            systemId
        });

        extendAttribute(node, {
            nodeName: {
                get(this: HTMLNode) {
                    return this.name;
                }
            }
        });

        return node as HTMLNode;
    }

    /**
     * Create a Comment node.
     *
     * @param {HTMLNode} node - given node
     * @return {HTMLNode} result Comment node
     */
    static createComment(node: Partial<HTMLNode>): HTMLNode {
        node = node instanceof HTMLNode ? node : HTMLNode.init(node);

        Object.assign(node, {
            type: ElementType.Comment,
            nodeName: '#comment',
            nodeValue: node.data,
            textContent: node.data
        });

        return node as HTMLNode;
    }

    /**
     * Create a CDATA node.
     *
     * @param {HTMLNode} node - given node
     * @return {HTMLNode} result CDATA node
     */
    static createCDATA(node: Partial<HTMLNode>): HTMLNode {
        node = node instanceof HTMLNode ? node : HTMLNode.init(node);

        Object.assign(node, {
            type: ElementType.CDATA,
            nodeName: '#cdata',
            nodeValue: void 0,
            textContent: void 0
        });

        return node as HTMLNode;
    }

    /**
     * Get path ( array of node ) from root to given node.
     *
     * @param {Node} node - given node
     * @return {Node[]} path from root to given node
     */
    static getPath(node: Node): Node[] {
        const path: Node[] = [node];

        while (node.parentNode) {
            path.unshift(node.parentNode);
            node = node.parentNode;
        }

        return path;
    }

    /**
     * Insert a node to given position.
     *
     * @param {HTMLNode} parent - parent node
     * @param {HTMLNode} child - child node to insert
     * @param {number} pos - position (in parent's childNode array) to insert
     */
    static insert(parent: HTMLNode, child: HTMLNode, pos: number) {
        const { childNodes } = parent;

        childNodes.splice(pos, 0, child);

        cleanRelativeLink(childNodes);

        child.parentNode = parent;
    }

    /**
     * Remove a node from its current position.
     *
     * @param {HTMLNode} child - node to remove
     */
    static remove(child: HTMLNode) {
        if (!child.parentNode) {
            return;
        }

        const { childNodes } = child.parentNode;
        const index = childNodes.indexOf(child);

        childNodes.splice(index, 1);
        const prev = childNodes[index - 1] || null;
        const next = childNodes[index] || null;

        if (prev) {
            prev.next = next;
        }
        else if (next) {
            next.prev = prev;
        }

        child.prev = child.next = null;
        child.parentNode = null;
    }

    // http://www.w3.org/TR/dom/#interface-document

    createElement(localName: string) {
        return HTMLNode.createElement({
            name: localName.toLowerCase()
        });
    }

    createDocumentFragment() {
        return HTMLNode.init({});
    }

    // eslint-disabled id-denylist
    createTextNode(data: string) {
        return HTMLNode.createTextNode({
            data
        });
    }

    createComment(data: string) {
        return HTMLNode.createComment({
            data
        });
    }
    // eslint-enabled id-denylist

    // createProcessingInstruction: function () { /*TODO*/ }

    // importNode: function () { /*TODO*/ }
    // adoptNode: function () { /*TODO*/ }
    // createEvent: function () { /*TODO*/ }
    // createRange: function () { /*TODO*/ }
    // createNodeIterator: function () { /*TODO*/ }
    // createTreeWalker: function () { /*TODO*/ }

    get tagName() {
        return this.name?.toUpperCase() || '';
    }

    set tagName(value) {
        this.name = value;
    }

    get nodeType() {
        // 11 for DOCUMENT_FRAGMENT_NODE
        return nodeTypes.get(this.type) ?? NodeType.DOCUMENT_FRAGMENT_NODE;
    }

    get ownerDocument() {
        let current: Node | null = this;
        while (
            current
            && current.nodeType !== NodeType.DOCUMENT_NODE
        ) {
            current = current.parentNode;
        }
        return current || null;
    }

    get parentElement() {
        return (this.parentNode && isElement(this.parentNode)) ? this.parentNode : null;
    }

    hasChildNodes() {
        return !!this.childNodes.length;
    }

    isEqualNode(node: Node) {
        return node === this;
    }

    compareDocumentPosition(other: HTMLNode | null) {
        const reference = this;

        // same object
        if (reference === other) {
            return 0;
        }

        let path: Node[];
        let otherPath: Node[];

        // not in the same tree
        if (
            !other
            || (path = HTMLNode.getPath(reference))[0] !== (otherPath = HTMLNode.getPath(other))[0]
        ) {
            return DocumentPosition.DOCUMENT_POSITION_DISCONNECTED
                + DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
        }

        // ancestor
        if (other.contains(reference)) {
            return DocumentPosition.DOCUMENT_POSITION_CONTAINS + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
        }

        // descendant
        if (reference.contains(other)) {
            return DocumentPosition.DOCUMENT_POSITION_CONTAINED_BY + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
        }

        // preceding
        for (let i = 1, l = path.length; i < l; i++) {
            if (path[i] !== otherPath[i]) {
                const siblings = (path[i - 1] as HTMLNode).childNodes;
                if (siblings.indexOf(otherPath[i]) < siblings.indexOf(path[i])) {
                    return DocumentPosition.DOCUMENT_POSITION_PRECEDING;
                }
            }
        }

        return DocumentPosition.DOCUMENT_POSITION_FOLLOWING;

    }

    contains(another: Node | null) {
        while (another) {
            if (another === this) {
                return true;
            }
            another = another.parentNode;
        }

        return false;
    }

    // lookupPrefix: function () { /*TODO*/ },
    // lookupNamespaceURI: function () { /*TODO*/ },
    // isDefaultNamespace: function () { /*TODO*/ },

    insertBefore(node: Node, child: Node) {
        const pos = this.childNodes.indexOf(child);
        if (pos < 0) {
            throw new Error('HierarchyRequestError');
        }

        HTMLNode.remove(node as HTMLNode);
        HTMLNode.insert(this, node as HTMLNode, pos);

        return node;
    }

    appendChild(node: Node) {
        HTMLNode.remove(node as HTMLNode);
        HTMLNode.insert(this, node as HTMLNode, this.childNodes.length);

        return node;
    }

    replaceChild(node: HTMLNode, child: HTMLNode) {
        const pos = this.childNodes.indexOf(child);
        if (pos < 0) {
            throw new Error('HierarchyRequestError');
        }

        HTMLNode.remove(child);
        HTMLNode.remove(node);
        HTMLNode.insert(this, node, pos);

        return child;
    }

    removeChild(child: HTMLNode) {
        if (!this.childNodes.includes(child)) {
            throw new Error('NotFoundError');
        }

        HTMLNode.remove(child);

        return child;
    }

}


const Namespaces = {
    HTML: 'http://www.w3.org/1999/xhtml',
    XML: 'http://www.w3.org/XML/1998/namespace',
    XMLNS: 'http://www.w3.org/2000/xmlns/'
};


/**
 * class Attribute
 *
 * @see http://www.w3.org/TR/dom/#attr
 *
 * @constructor
 * @param {string} name attribute name
 * @param {*} value attribute value
 */
export class Attribute {
    localName = '';
    specified = true;
    namespaceURI: string | null = null;
    prefix: string | null = null;

    constructor(public name: string, public value: string | number | boolean) {
        this.localName = name;
    }
}

/**
 * class Element
 *
 * @see http://www.w3.org/TR/dom/#interface-element
 *
 */
export class HTMLElement extends HTMLNode {

    /**
     * Init a Element instance with given node.
     *
     * @param {Node} element - given node as element
     * @return {HTMLElement} result node
     */
    static init(element: HTMLNode | Partial<HTMLElement> | null): HTMLElement {
        if (!element || (element instanceof HTMLElement)) {
            return element! as HTMLElement;
        }

        // @ts-expect-error
        element.__proto__ = HTMLElement.prototype;

        // const newElement = Object.assign(new HTMLElement(element.name, {}), element);

        return HTMLElement.extend(element);
    }

    /**
     * Extend given element with attributes.
     *
     * @param {HTMLElement} element - given element
     * @return {HTMLElement} element itself
     */
    static extend(element: HTMLNode | Partial<HTMLElement>): HTMLElement {

        // https://dom.spec.whatwg.org/#interface-element

        Object.assign(element, {

            // Note: UnStandard realization here
            // attribute realized based on attribs (map) instead of attributes (list) for better performance
            // while the latter is recommended by specification
            attribs: element.attribs || {},

            namespaceURI: element.namespaceURI || Namespaces.HTML,
            // TODO:
            prefix: '',
            tagName: element.name

        });

        return element as HTMLElement;
    }


    get id() {
        return this.attribs.id || '';
    }

    get className() {
        return this.attribs.class || '';
    }

    get classList() {
        return this.attribs.class ? this.attribs.class.split(/\s+/) : [];
    }

    get localName() {
        return this.name;
    }

    // get children() {
    //     return this.childNodes.filter(isElement);
    // }

    get firstElementChild(): HTMLElement {
        return this.children.filter(isElement)[0] as HTMLElement || null;
    }

    get lastElementChild(): HTMLElement {
        return this.children.filter(isElement).pop() as HTMLElement || null;
    }

    get childElementCount() {
        return this.children.filter(isElement).length;
    }

    get previousElementSibling() {
        let element: HTMLElement | null = this;
        // eslint-disable-next-line no-unmodified-loop-condition
        while ((element = element.previousSibling as HTMLElement)) {
            if (isElement(element)) {
                return element;
            }
        }
    }

    get nextElementSibling() {
        let element: HTMLElement | null = this;
        // eslint-disable-next-line no-unmodified-loop-condition
        while ((element = element.nextSibling as HTMLElement)) {
            if (isElement(element)) {
                return element;
            }
        }
    }


    getAttribute(name: string) {
        return this.hasAttribute(name) ? this.attribs[name] : null;
    }

    setAttribute(name: string, value: number | string | boolean) {
        this.attribs[name] = String(value);
    }

    removeAttribute(name: string) {
        delete this.attribs[name];
    }

    hasAttribute(name: string) {
        name = name && (this.namespaceURI === Namespaces.HTML ? name.toLowerCase() : name);
        return Object.prototype.hasOwnProperty.call(this.attribs, name);
    }

    getAttributeNode(name: string) {
        return this.hasAttribute(name) ? new Attribute(name, this.attribs[name]) : null;
    }

    setAttributeNode(node: Attribute) {
        const oldAttribute = this.getAttributeNode(node.name);
        this.setAttribute(node.name, node.value);
        return oldAttribute;
    }

    removeAttributeNode(node: Attribute) {
        const oldAttribute = this.getAttributeNode(node.name);
        this.removeAttribute(node.name);
        return oldAttribute;
    }

    // closest() { /*TODO*/ },

    matches(selectors: string) {
        return is(this, selectors);
    }

    getElementsByTagName(tagName: string) {
        return this.querySelectorAll(tagName.toLowerCase());
    }

    getElementsByClassName(classNameList: string) {
        const [firstClass, ...otherClass] = classNameList.split(' ');

        const elements = this.querySelectorAll(`.${ firstClass }`);
        if (!otherClass) {
            return elements;
        }

        const l = otherClass.length;
        return elements.filter(element => {
            for (let i = 0; i < l; i++) {
                if (otherClass[i] && !element.classList.includes(otherClass[i])) {
                    return false;
                }
            }
            return true;
        });
    }

    querySelector(selector: string) {
        const element = selectOne<Element, HTMLElement>(selector, this);
        if (!element) {
            return null;
        }

        return element;
    }

    querySelectorAll(selector: string) {
        return selectAll<Element, HTMLElement>(selector, this);
    }
}

export class HTMLDocument extends HTMLElement {
    implementation: typeof DOMImplementation;
    documentElement: HTMLElement;
    nodeName = '#document';

    get nodeType() {
        return NodeType.DOCUMENT_NODE;
    }
    // nodeValue: null,
    // textContent: null,

    URL: string | URL = 'about:blank';
    documentURI = 'about:blank';
    compatMode = 'CSS1Compat';
    characterSet = 'utf-8';
    contentType = 'text/html';
    head: HTMLElement | null = null;
    body: HTMLElement | null = null;
    html: HTMLElement | null = null;

    constructor(children: Node[]) {
        super(ElementType.Root, {}, children);

        this.documentElement = this.html = this.children[0] as HTMLElement;
    }

}
