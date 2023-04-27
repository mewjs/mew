import assert from 'assert';
import last from 'lodash/last';
import findLastIndex from 'lodash/findLastIndex';
import type {
    ErrorCode,
    HasLocation,
    Namespace,
    Token,
    XAttribute,
    XDocumentFragment,
    XElement,
    XExpressionContainer,
    XLiteral,
    XNode
} from '../ast';
import {
    NS,
    ParseError
} from '../ast';
import { debug } from '../common/debug';
import { LocationCalculator } from '../common/location-calculator';
import {
    convertToDirective,
    processMustache,
    processWxsModule,
    resolveReferences,
} from '../template';
import {
    SVG_ATTRIBUTE_NAME_MAP,
} from './util/attribute-names';
import {
    HTML_CAN_BE_LEFT_OPEN_TAGS,
    HTML_NON_FHRASING_TAGS,
    HTML_RAWTEXT_TAGS,
    HTML_RCDATA_TAGS,
    HTML_VOID_ELEMENT_TAGS,
    SVG_ELEMENT_NAME_MAP,
} from './util/tag-names';
import type {
    IntermediateToken,
    EndTag,
    StartTag,
    Text,
    Mustache
} from './intermediate-tokenizer';
import {
    IntermediateTokenizer
} from './intermediate-tokenizer';
import type { Tokenizer } from './tokenizer';

const DIRECTIVE_NAME = /^(?:wx:|a:|s-|change:|model:|bind:?|on|catch:?|capture-bind:|capture-catch:|mut-bind:)[\w.-]*$/u;
const DT_DD = /^d[dt]$/u;
const DUMMY_PARENT: any = Object.freeze({});

/**
 * Check whether the element is a HTML integration point or not.
 * @see https://html.spec.whatwg.org/multipage/parsing.html#tree-construction-dispatcher
 * @param element The current element.
 * @returns `true` if the element is a HTML integration point.
 */
function isHTMLIntegrationPoint(element: XElement): boolean {
    if (element.namespace === NS.SVG) {
        const { name } = element;
        return name === 'foreignObject' || name === 'desc' || name === 'title';
    }

    return false;
}

/**
 * Adjust element names by the current namespace.
 * @param name The lowercase element name to adjust.
 * @param namespace The current namespace.
 * @returns The adjusted element name.
 */
function adjustElementName(name: string, namespace: Namespace): string {
    if (namespace === NS.SVG) {
        return SVG_ELEMENT_NAME_MAP.get(name) || name;
    }
    return name;
}

/**
 * Adjust attribute names by the current namespace.
 * @param name The lowercase attribute name to adjust.
 * @param namespace The current namespace.
 * @returns The adjusted attribute name.
 */
function adjustAttributeName(name: string, namespace: Namespace): string {
    if (namespace === NS.SVG) {
        return SVG_ATTRIBUTE_NAME_MAP.get(name) || name;
    }

    return name;
}

/**
 * Set the location of the last child node to the end location of the given node.
 * @param node The node to commit the end location.
 */
function propagateEndLocation(node: XDocumentFragment | XElement): void {
    const lastChild
        = (node.type === 'XElement' ? node.endTag : null) || last(node.children as XNode[]);
    if (lastChild != null) {
        node.range[1] = lastChild.range[1];
        node.loc.end = lastChild.loc.end;
    }
}

/**
 * The parser of HTML.
 * This is not following to the HTML spec completely because wxml template spec is pretty different to HTML.
 */
export class Parser {
    private tokenizer: IntermediateTokenizer;

    private locationCalculator: LocationCalculator;

    private parserOptions: any;

    private document: XDocumentFragment;

    private elementStack: XElement[];

    /**
     * The source code text.
     */
    private get text(): string {
        return this.tokenizer.text;
    }

    /**
     * The tokens.
     */
    private get tokens(): Token[] {
        return this.tokenizer.tokens;
    }

    /**
     * The comments.
     */
    private get comments(): Token[] {
        return this.tokenizer.comments;
    }

    /**
     * The syntax errors which are found in this parsing.
     */
    private get errors(): ParseError[] {
        return this.tokenizer.errors;
    }

    /**
     * The current namespace.
     */
    private get namespace(): Namespace {
        return this.tokenizer.namespace;
    }

    private set namespace(value: Namespace) {
        this.tokenizer.namespace = value;
    }

    /**
     * The current flag of expression enabled.
     */
    private get expressionEnabled(): boolean {
        return this.tokenizer.expressionEnabled;
    }

    private set expressionEnabled(value: boolean) {
        this.tokenizer.expressionEnabled = value;
    }

    /**
     * Get the current node.
     */
    private get currentNode(): XDocumentFragment | XElement {
        return last(this.elementStack) || this.document;
    }

    /**
     * Initialize this parser.
     * @param tokenizer The tokenizer to parse.
     * @param parserOptions The parser options to parse inline expressions.
     */
    constructor(tokenizer: Tokenizer, parserOptions: any) {
        this.tokenizer = new IntermediateTokenizer(tokenizer);
        this.locationCalculator = new LocationCalculator(
            tokenizer.gaps,
            tokenizer.lineTerminators,
        );
        this.parserOptions = parserOptions;
        this.document = {
            type: 'XDocumentFragment',
            range: [0, 0],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 0 },
            },
            parent: null,
            children: [],
            tokens: this.tokens,
            comments: this.comments,
            errors: this.errors,
            xmlType: 'unknown'
        };
        this.elementStack = [];
        this.expressionEnabled = true;
    }

    /**
     * Parse the HTML which was given in this constructor.
     * @returns The result of parsing.
     */
    parse(): XDocumentFragment {
        let token: IntermediateToken | null = null;
        while ((token = this.tokenizer.nextToken()) != null) {
            (this as any)[token.type](token);
        }

        this.popElementStackUntil(0);
        propagateEndLocation(this.document);

        return this.document;
    }

    /**
     * Handle the start tag token.
     *
     * @param token The token to handle.
     */
    protected StartTag(token: StartTag): void {
        debug('[html] StartTag %j', token);

        this.closeCurrentElementIfNecessary(token.name);
        const parent = this.currentNode;
        const namespace = this.detectNamespace(token);

        const element: XElement = {
            type: 'XElement',
            range: [token.range[0], token.range[1]],
            loc: { start: token.loc.start, end: token.loc.end },
            parent,
            name: adjustElementName(token.name, namespace),
            rawName: token.rawName,
            namespace,
            startTag: {
                type: 'XStartTag',
                range: token.range,
                loc: token.loc,
                parent: DUMMY_PARENT,
                selfClosing: token.selfClosing,
                attributes: token.attributes,
            },
            children: [],
            endTag: null,
            variables: [],
        };

        // Setup relations.
        parent.children.push(element);
        element.startTag.parent = element;

        for (const attribute of token.attributes) {
            attribute.parent = element.startTag;
            this.processAttribute(attribute, namespace);
        }

        // Resolve references.
        for (const attribute of element.startTag.attributes) {
            if (attribute.value != null) {
                attribute.value
                    .filter(i => i.type === 'XExpressionContainer')
                    .forEach(i => resolveReferences(i as XExpressionContainer));
            }
        }

        // Check whether the self-closing is valid.
        const isVoid
            = namespace === NS.HTML && HTML_VOID_ELEMENT_TAGS.has(element.name);
        // only check void elements
        if (!token.selfClosing && isVoid) {
            this.reportParseError(
                token,
                'non-void-html-element-start-tag-with-trailing-solidus',
            );
        }

        // wxml supports self-closing elements even if it's not one of void elements.
        if (token.selfClosing || isVoid) {
            this.expressionEnabled = true;
            return;
        }

        // Push to stack.
        this.elementStack.push(element);

        this.namespace = namespace;

        // Update the content type of this element.
        if (namespace === NS.HTML) {
            if (element.parent.type === 'XDocumentFragment') {
                const langAttr = element.startTag.attributes.find(
                    a => !a.directive && a.key.name === 'lang',
                ) as XAttribute | undefined;

                const langValue = langAttr?.value?.[0]?.type === 'XLiteral'
                    ? (langAttr.value[0] as XLiteral).value
                    : '';
                const lang = (langAttr && langValue) || 'html';
                if (lang !== 'html') {
                    this.tokenizer.state = 'RAWTEXT';
                }
                this.expressionEnabled = true;
            }

            if (HTML_RCDATA_TAGS.has(element.name)) {
                this.tokenizer.state = 'RCDATA';
            }

            if (HTML_RAWTEXT_TAGS.has(element.name)) {
                this.tokenizer.state = 'RAWTEXT';
            }
        }
    }

    /**
     * Handle the end tag token.
     * @param token The token to handle.
     */
    protected EndTag(token: EndTag): void {
        debug('[html] EndTag %j', token);

        const i = findLastIndex(
            this.elementStack,
            el => el.name.toLowerCase() === token.name,
        );
        if (i === -1) {
            this.reportParseError(token, 'x-invalid-end-tag');
            return;
        }

        const element = this.elementStack[i];
        element.endTag = {
            type: 'XEndTag',
            range: token.range,
            loc: token.loc,
            parent: element,
        };

        this.popElementStackUntil(i);
    }

    /**
     * Handle the text token.
     * @param token The token to handle.
     */
    protected Text(token: Text): void {
        debug('[html] Text %j', token);
        const parent = this.currentNode;
        parent.children.push({
            type: 'XText',
            range: token.range,
            loc: token.loc,
            parent,
            value: token.value,
        });

        // wxs module parse, with no src attribute
        if (parent.type === 'XElement'
            && parent.name === 'wxs'
            && parent.children[0].type === 'XText'
            && !parent.startTag.attributes.some(attr => attr.key.name === 'src')) {

            processWxsModule(
                this.parserOptions,
                this.locationCalculator,
                parent
            );
        }
    }

    /**
     * Handle the text token.
     * @param token The token to handle.
     */
    protected Mustache(token: Mustache): void {
        debug('[html] Mustache %j', token);

        const parent = this.currentNode;
        const container: XExpressionContainer = {
            type: 'XExpressionContainer',
            range: token.range,
            loc: token.loc,
            parent,
            expression: null,
            references: [],
        };

        processMustache(
            {
                sourceType: 'module',
                ecmaVersion: 2018,
                range: true,
                loc: true,
                tokens: true,
            },
            this.locationCalculator,
            container,
            token,
        );

        // Set relationship.
        parent.children.push(container);

        // Resolve references.
        resolveReferences(container);
    }

    /**
     * Report an invalid character error.
     * @param code The error code.
     */
    private reportParseError(token: HasLocation, code: ErrorCode): void {
        const error = ParseError.fromCode(
            code,
            token.range[0],
            token.loc.start.line,
            token.loc.start.column,
        );
        this.errors.push(error);

        debug('[html] syntax error:', error.message);
    }

    /**
     * Pop an element from the current element stack.
     */
    private popElementStack(): void {
        assert(this.elementStack.length >= 1);

        const element = this.elementStack.pop()!;
        propagateEndLocation(element);

        // Update the current namespace.
        const current = this.currentNode;
        this.namespace
            = current.type === 'XElement' ? current.namespace : NS.HTML;

        // Update expression flag.
        if (this.elementStack.length === 0) {
            this.expressionEnabled = false;
        }
    }

    /**
     * Pop elements from the current element stack.
     * @param index The index of the element you want to pop.
     */
    private popElementStackUntil(index: number): void {
        while (this.elementStack.length > index) {
            this.popElementStack();
        }
    }

    /**
     * Detect the namespace of the new element.
     * @param token The StartTag token to detect.
     * @returns The namespace of the new element.
     */
    private detectNamespace(token: StartTag): Namespace {
        const { name } = token;
        let ns = this.namespace;

        if (ns === NS.SVG) {
            const element = this.currentNode;
            if (element.type === 'XElement') {
                if (
                    element.name === 'annotation-xml'
                    && name === 'svg'
                ) {
                    return NS.SVG;
                }
                if (
                    isHTMLIntegrationPoint(element)
                    || (name !== 'mglyph'
                    && name !== 'malignmark')
                ) {
                    ns = NS.HTML;
                }
            }
        }

        if (ns === NS.HTML) {
            if (name === 'svg') {
                return NS.SVG;
            }
        }

        return ns;
    }

    /**
     * Close the current element if necessary.
     * @param name The tag name to check.
     */
    private closeCurrentElementIfNecessary(name: string): void {
        const element = this.currentNode;
        if (element.type !== 'XElement') {
            return;
        }

        if (element.name === 'p' && HTML_NON_FHRASING_TAGS.has(name)) {
            this.popElementStack();
        }
        if (element.name === name && HTML_CAN_BE_LEFT_OPEN_TAGS.has(name)) {
            this.popElementStack();
        }
        if (DT_DD.test(element.name) && DT_DD.test(name)) {
            this.popElementStack();
        }
    }

    /**
     * Adjust and validate the given attribute node.
     * @param node The attribute node to handle.
     * @param namespace The current namespace.
     */
    private processAttribute(node: XAttribute, namespace: Namespace): void {
        const attrName = node.key.name;
        if (DIRECTIVE_NAME.test(attrName)) {
            convertToDirective(
                node,
            );
        }

        const values = node.value.map(token => {
            if (token.type === 'Mustache') {
                // TODO: template bindings use object model
                // except is expression
                let isSpreadObject = false;
                if (node.parent.parent.name === 'template'
                    && !node.directive && node.key.name !== 'is') {
                    isSpreadObject = true;
                }

                const container: XExpressionContainer = {
                    type: 'XExpressionContainer',
                    range: token.range,
                    loc: token.loc,
                    parent: node,
                    expression: null,
                    references: [],
                };

                processMustache(
                    {
                        sourceType: 'module',
                        ecmaVersion: 2018,
                        range: true,
                        loc: true,
                        tokens: true,
                    },
                    this.locationCalculator,
                    container,
                    token as unknown as Mustache,
                    isSpreadObject
                );

                // Resolve references.
                resolveReferences(container);
                return container;
            }
            return token;
        });

        node.value = values;

        const key = (node.key.name = adjustAttributeName(
            node.key.name,
            namespace,
        ));

        const value = values?.[0]?.type === 'XLiteral'
            ? (node.value[0] as XLiteral).value
            : null;

        if (key === 'xmlns' && value !== namespace) {
            this.reportParseError(node, 'x-invalid-namespace');
        }
        else if (key === 'xmlns:xlink' && value !== NS.XLink) {
            this.reportParseError(node, 'x-invalid-namespace');
        }
    }
}
