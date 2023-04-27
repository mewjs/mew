import type { ScopeManager } from 'eslint-scope';
import type { ParserServices } from '../parser-services';
import type { ParseError } from './errors';
import type { HasLocation } from './locations';
import type { Token } from './tokens';

//------------------------------------------------------------------------------
// Common
//------------------------------------------------------------------------------

/**
 * Objects which have their parent.
 */
export interface HasParent {
    parent?: Node | null;
}

/**
 * The union type for all nodes.
 */
export type Node =
    | ESLintNode
    | XNode;

//------------------------------------------------------------------------------
// Script
//------------------------------------------------------------------------------

/**
 * The union type for ESLint nodes.
 */
export type ESLintNode =
    | ESLintIdentifier
    | ESLintLiteral
    | ESLintProgram
    | ESLintSwitchCase
    | ESLintCatchClause
    | ESLintVariableDeclarator
    | ESLintStatement
    | ESLintExpression
    | ESLintProperty
    | ESLintAssignmentProperty
    | ESLintSuper
    | ESLintTemplateElement
    | ESLintSpreadElement
    | ESLintPattern
    | ESLintClassBody
    | ESLintMethodDefinition
    | ESLintModuleDeclaration
    | ESLintModuleSpecifier
    | ESLintLegacyRestProperty;

/**
 * The parsing result of ESLint custom parsers.
 */
export interface ESLintExtendedProgram {
    ast: ESLintProgram;
    services?: ParserServices;
    visitorKeys?: { [type: string]: string[] };
    scopeManager?: ScopeManager;
}

export interface ESLintProgram extends HasLocation, HasParent {
    type: 'Program';
    sourceType: 'script' | 'module';
    body: (ESLintStatement | ESLintModuleDeclaration)[];
    templateBody?: XDocumentFragment & HasConcreteInfo;
    tokens?: Token[];
    comments?: Token[];
    errors?: ParseError[];
}

export type ESLintStatement =
    | ESLintExpressionStatement
    | ESLintBlockStatement
    | ESLintEmptyStatement
    | ESLintDebuggerStatement
    | ESLintWithStatement
    | ESLintReturnStatement
    | ESLintLabeledStatement
    | ESLintBreakStatement
    | ESLintContinueStatement
    | ESLintIfStatement
    | ESLintSwitchStatement
    | ESLintThrowStatement
    | ESLintTryStatement
    | ESLintWhileStatement
    | ESLintDoWhileStatement
    | ESLintForStatement
    | ESLintForInStatement
    | ESLintForOfStatement
    | ESLintDeclaration;

export interface ESLintEmptyStatement extends HasLocation, HasParent {
    type: 'EmptyStatement';
}

export interface ESLintBlockStatement extends HasLocation, HasParent {
    type: 'BlockStatement';
    body: ESLintStatement[];
}

export interface ESLintExpressionStatement extends HasLocation, HasParent {
    type: 'ExpressionStatement';
    expression: ESLintExpression;
}

export interface ESLintIfStatement extends HasLocation, HasParent {
    type: 'IfStatement';
    test: ESLintExpression;
    consequent: ESLintStatement;
    alternate: ESLintStatement | null;
}

export interface ESLintSwitchStatement extends HasLocation, HasParent {
    type: 'SwitchStatement';
    discriminant: ESLintExpression;
    cases: ESLintSwitchCase[];
}

export interface ESLintSwitchCase extends HasLocation, HasParent {
    type: 'SwitchCase';
    test: ESLintExpression | null;
    consequent: ESLintStatement[];
}

export interface ESLintWhileStatement extends HasLocation, HasParent {
    type: 'WhileStatement';
    test: ESLintExpression;
    body: ESLintStatement;
}

export interface ESLintDoWhileStatement extends HasLocation, HasParent {
    type: 'DoWhileStatement';
    body: ESLintStatement;
    test: ESLintExpression;
}

export interface ESLintForStatement extends HasLocation, HasParent {
    type: 'ForStatement';
    init: ESLintVariableDeclaration | ESLintExpression | null;
    test: ESLintExpression | null;
    update: ESLintExpression | null;
    body: ESLintStatement;
}

export interface ESLintForInStatement extends HasLocation, HasParent {
    type: 'ForInStatement';
    left: ESLintVariableDeclaration | ESLintPattern;
    right: ESLintExpression;
    body: ESLintStatement;
}

export interface ESLintForOfStatement extends HasLocation, HasParent {
    type: 'ForOfStatement';
    left: ESLintVariableDeclaration | ESLintPattern;
    right: ESLintExpression;
    body: ESLintStatement;
}

export interface ESLintLabeledStatement extends HasLocation, HasParent {
    type: 'LabeledStatement';
    label: ESLintIdentifier;
    body: ESLintStatement;
}

export interface ESLintBreakStatement extends HasLocation, HasParent {
    type: 'BreakStatement';
    label: ESLintIdentifier | null;
}

export interface ESLintContinueStatement extends HasLocation, HasParent {
    type: 'ContinueStatement';
    label: ESLintIdentifier | null;
}

export interface ESLintReturnStatement extends HasLocation, HasParent {
    type: 'ReturnStatement';
    argument: ESLintExpression | null;
}

export interface ESLintThrowStatement extends HasLocation, HasParent {
    type: 'ThrowStatement';
    argument: ESLintExpression;
}

export interface ESLintTryStatement extends HasLocation, HasParent {
    type: 'TryStatement';
    block: ESLintBlockStatement;
    handler: ESLintCatchClause | null;
    finalizer: ESLintBlockStatement | null;
}

export interface ESLintCatchClause extends HasLocation, HasParent {
    type: 'CatchClause';
    param: ESLintPattern;
    body: ESLintBlockStatement;
}

export interface ESLintWithStatement extends HasLocation, HasParent {
    type: 'WithStatement';
    object: ESLintExpression;
    body: ESLintStatement;
}

export interface ESLintDebuggerStatement extends HasLocation, HasParent {
    type: 'DebuggerStatement';
}

export type ESLintDeclaration =
    | ESLintFunctionDeclaration
    | ESLintVariableDeclaration
    | ESLintClassDeclaration;

export interface ESLintFunctionDeclaration extends HasLocation, HasParent {
    type: 'FunctionDeclaration';
    async: boolean;
    generator: boolean;
    id: ESLintIdentifier | null;
    params: ESLintPattern[];
    body: ESLintBlockStatement;
}

export interface ESLintVariableDeclaration extends HasLocation, HasParent {
    type: 'VariableDeclaration';
    kind: 'var' | 'let' | 'const';
    declarations: ESLintVariableDeclarator[];
}

export interface ESLintVariableDeclarator extends HasLocation, HasParent {
    type: 'VariableDeclarator';
    id: ESLintPattern;
    init: ESLintExpression | null;
}

export interface ESLintClassDeclaration extends HasLocation, HasParent {
    type: 'ClassDeclaration';
    id: ESLintIdentifier | null;
    superClass: ESLintExpression | null;
    body: ESLintClassBody;
}

export interface ESLintClassBody extends HasLocation, HasParent {
    type: 'ClassBody';
    body: ESLintMethodDefinition[];
}

export interface ESLintMethodDefinition extends HasLocation, HasParent {
    type: 'MethodDefinition';
    kind: 'constructor' | 'method' | 'get' | 'set';
    computed: boolean;
    static: boolean;
    key: ESLintExpression;
    value: ESLintFunctionExpression;
}

export type ESLintModuleDeclaration =
    | ESLintImportDeclaration
    | ESLintExportNamedDeclaration
    | ESLintExportDefaultDeclaration
    | ESLintExportAllDeclaration;

export type ESLintModuleSpecifier =
    | ESLintImportSpecifier
    | ESLintImportDefaultSpecifier
    | ESLintImportNamespaceSpecifier
    | ESLintExportSpecifier;

export interface ESLintImportDeclaration extends HasLocation, HasParent {
    type: 'ImportDeclaration';
    specifiers: (
        | ESLintImportSpecifier
        | ESLintImportDefaultSpecifier
        | ESLintImportNamespaceSpecifier)[];
    source: ESLintLiteral;
}

export interface ESLintImportSpecifier extends HasLocation, HasParent {
    type: 'ImportSpecifier';
    imported: ESLintIdentifier;
    local: ESLintIdentifier;
}

export interface ESLintImportDefaultSpecifier extends HasLocation, HasParent {
    type: 'ImportDefaultSpecifier';
    local: ESLintIdentifier;
}

export interface ESLintImportNamespaceSpecifier extends HasLocation, HasParent {
    type: 'ImportNamespaceSpecifier';
    local: ESLintIdentifier;
}

export interface ESLintExportNamedDeclaration extends HasLocation, HasParent {
    type: 'ExportNamedDeclaration';
    declaration?: ESLintDeclaration | null;
    specifiers: ESLintExportSpecifier[];
    source?: ESLintLiteral | null;
}

export interface ESLintExportSpecifier extends HasLocation, HasParent {
    type: 'ExportSpecifier';
    exported: ESLintIdentifier;
}

export interface ESLintExportDefaultDeclaration extends HasLocation, HasParent {
    type: 'ExportDefaultDeclaration';
    declaration: ESLintDeclaration | ESLintExpression;
}

export interface ESLintExportAllDeclaration extends HasLocation, HasParent {
    type: 'ExportAllDeclaration';
    source: ESLintLiteral;
}

export type ESLintExpression =
    | ESLintThisExpression
    | ESLintArrayExpression
    | ESLintObjectExpression
    | ESLintFunctionExpression
    | ESLintArrowFunctionExpression
    | ESLintYieldExpression
    | ESLintLiteral
    | ESLintUnaryExpression
    | ESLintUpdateExpression
    | ESLintBinaryExpression
    | ESLintAssignmentExpression
    | ESLintLogicalExpression
    | ESLintMemberExpression
    | ESLintConditionalExpression
    | ESLintCallExpression
    | ESLintNewExpression
    | ESLintSequenceExpression
    | ESLintTemplateLiteral
    | ESLintTaggedTemplateExpression
    | ESLintClassExpression
    | ESLintMetaProperty
    | ESLintIdentifier
    | ESLintAwaitExpression;

export interface ESLintIdentifier extends HasLocation, HasParent {
    type: 'Identifier';
    name: string;
}

export interface ESLintLiteral extends HasLocation, HasParent {
    type: 'Literal';
    value: string | boolean | null | number | RegExp;
    raw: string;
    regex?: {
        pattern: string;
        flags: string;
    };
}

export interface ESLintThisExpression extends HasLocation, HasParent {
    type: 'ThisExpression';
}

export interface ESLintArrayExpression extends HasLocation, HasParent {
    type: 'ArrayExpression';
    elements: (ESLintExpression | ESLintSpreadElement)[];
}

export interface ESLintObjectExpression extends HasLocation, HasParent {
    type: 'ObjectExpression';
    properties: (
        | ESLintProperty
        | ESLintSpreadElement
        | ESLintLegacySpreadProperty)[];
}

export interface ESLintProperty extends HasLocation, HasParent {
    type: 'Property';
    kind: 'init' | 'get' | 'set';
    method: boolean;
    shorthand: boolean;
    computed: boolean;
    key: ESLintExpression;
    value: ESLintExpression | ESLintPattern;
}

export interface ESLintFunctionExpression extends HasLocation, HasParent {
    type: 'FunctionExpression';
    async: boolean;
    generator: boolean;
    id: ESLintIdentifier | null;
    params: ESLintPattern[];
    body: ESLintBlockStatement;
}

export interface ESLintArrowFunctionExpression extends HasLocation, HasParent {
    type: 'ArrowFunctionExpression';
    async: boolean;
    generator: boolean;
    id: ESLintIdentifier | null;
    params: ESLintPattern[];
    body: ESLintBlockStatement;
}

export interface ESLintSequenceExpression extends HasLocation, HasParent {
    type: 'SequenceExpression';
    expressions: ESLintExpression[];
}

export interface ESLintUnaryExpression extends HasLocation, HasParent {
    type: 'UnaryExpression';
    operator: '-' | '+' | '!' | '~' | 'typeof' | 'void' | 'delete';
    prefix: boolean;
    argument: ESLintExpression;
}

export interface ESLintBinaryExpression extends HasLocation, HasParent {
    type: 'BinaryExpression';
    operator:
        | '=='
        | '!='
        | '==='
        | '!=='
        | '<'
        | '<='
        | '>'
        | '>='
        | '<<'
        | '>>'
        | '>>>'
        | '+'
        | '-'
        | '*'
        | '/'
        | '%'
        | '**'
        | '|'
        | '^'
        | '&'
        | 'in'
        | 'instanceof';
    left: ESLintExpression;
    right: ESLintExpression;
}

export interface ESLintAssignmentExpression extends HasLocation, HasParent {
    type: 'AssignmentExpression';
    operator:
    | '='
    | '+='
    | '-='
    | '*='
    | '/='
    | '%='
    | '**='
    | '<<='
    | '>>='
    | '>>>='
    | '|='
    | '^='
    | '&=';
    left: ESLintPattern;
    right: ESLintExpression;
}

export interface ESLintUpdateExpression extends HasLocation, HasParent {
    type: 'UpdateExpression';
    operator: '++' | '--';
    argument: ESLintExpression;
    prefix: boolean;
}

export interface ESLintLogicalExpression extends HasLocation, HasParent {
    type: 'LogicalExpression';
    operator: '||' | '&&';
    left: ESLintExpression;
    right: ESLintExpression;
}

export interface ESLintConditionalExpression extends HasLocation, HasParent {
    type: 'ConditionalExpression';
    test: ESLintExpression;
    alternate: ESLintExpression;
    consequent: ESLintExpression;
}

export interface ESLintCallExpression extends HasLocation, HasParent {
    type: 'CallExpression';
    callee: ESLintExpression | ESLintSuper;
    arguments: (ESLintExpression | ESLintSpreadElement)[];
}

export interface ESLintSuper extends HasLocation, HasParent {
    type: 'Super';
}

export interface ESLintNewExpression extends HasLocation, HasParent {
    type: 'NewExpression';
    callee: ESLintExpression;
    arguments: (ESLintExpression | ESLintSpreadElement)[];
}

export interface ESLintMemberExpression extends HasLocation, HasParent {
    type: 'MemberExpression';
    computed: boolean;
    object: ESLintExpression | ESLintSuper;
    property: ESLintExpression;
}

export interface ESLintYieldExpression extends HasLocation, HasParent {
    type: 'YieldExpression';
    delegate: boolean;
    argument: ESLintExpression | null;
}

export interface ESLintAwaitExpression extends HasLocation, HasParent {
    type: 'AwaitExpression';
    argument: ESLintExpression;
}

export interface ESLintTemplateLiteral extends HasLocation, HasParent {
    type: 'TemplateLiteral';
    quasis: ESLintTemplateElement[];
    expressions: ESLintExpression[];
}

export interface ESLintTaggedTemplateExpression extends HasLocation, HasParent {
    type: 'TaggedTemplateExpression';
    tag: ESLintExpression;
    quasi: ESLintTemplateLiteral;
}

export interface ESLintTemplateElement extends HasLocation, HasParent {
    type: 'TemplateElement';
    tail: boolean;
    value: {
        cooked: string;
        raw: string;
    };
}

export interface ESLintClassExpression extends HasLocation, HasParent {
    type: 'ClassExpression';
    id: ESLintIdentifier | null;
    superClass: ESLintExpression | null;
    body: ESLintClassBody;
}

export interface ESLintMetaProperty extends HasLocation, HasParent {
    type: 'MetaProperty';
    meta: ESLintIdentifier;
    property: ESLintIdentifier;
}

export type ESLintPattern =
    | ESLintIdentifier
    | ESLintObjectPattern
    | ESLintArrayPattern
    | ESLintRestElement
    | ESLintAssignmentPattern
    | ESLintMemberExpression
    | ESLintLegacyRestProperty;

export interface ESLintObjectPattern extends HasLocation, HasParent {
    type: 'ObjectPattern';
    properties: (
        | ESLintAssignmentProperty
        | ESLintRestElement
        | ESLintLegacyRestProperty)[];
}

export interface ESLintAssignmentProperty extends ESLintProperty {
    value: ESLintPattern;
    kind: 'init';
    method: false;
}

export interface ESLintArrayPattern extends HasLocation, HasParent {
    type: 'ArrayPattern';
    elements: ESLintPattern[];
}

export interface ESLintRestElement extends HasLocation, HasParent {
    type: 'RestElement';
    argument: ESLintPattern;
}

export interface ESLintSpreadElement extends HasLocation, HasParent {
    type: 'SpreadElement';
    argument: ESLintExpression;
}

export interface ESLintAssignmentPattern extends HasLocation, HasParent {
    type: 'AssignmentPattern';
    left: ESLintPattern;
    right: ESLintExpression;
}

/**
 * Legacy for babel-eslint and espree.
 */
export interface ESLintLegacyRestProperty extends HasLocation, HasParent {
    type: 'RestProperty' | 'ExperimentalRestProperty';
    argument: ESLintPattern;
}

/**
 * Legacy for babel-eslint and espree.
 */
export interface ESLintLegacySpreadProperty extends HasLocation, HasParent {
    type: 'SpreadProperty' | 'ExperimentalSpreadProperty';
    argument: ESLintExpression;
}

//------------------------------------------------------------------------------
// Template
//------------------------------------------------------------------------------

/**
 * Constants of namespaces.
 * @see https://infra.spec.whatwg.org/#namespaces
 */
export const NS = Object.freeze({
    HTML: 'http://www.w3.org/1999/xhtml' as 'http://www.w3.org/1999/xhtml',
    SVG: 'http://www.w3.org/2000/svg' as 'http://www.w3.org/2000/svg',
    XLink: 'http://www.w3.org/1999/xlink' as 'http://www.w3.org/1999/xlink',
    XML: 'http://www.w3.org/XML/1998/namespace' as 'http://www.w3.org/XML/1998/namespace',
    XMLNS: 'http://www.w3.org/2000/xmlns/' as 'http://www.w3.org/2000/xmlns/'
});

/**
 * Type of namespaces.
 */
export type Namespace =
    | typeof NS.HTML
    | typeof NS.SVG
    | typeof NS.XLink
    | typeof NS.XML
    | typeof NS.XMLNS;

/**
 * Type of variable definitions.
 */
export interface Variable {
    id: ESLintIdentifier;
    kind: 'for' | 'scope';
    references: Reference[];
}

/**
 * Type of variable references.
 */
export interface Reference {
    id: ESLintIdentifier;
    mode: 'rw' | 'r' | 'w';
    variable: Variable | null;
}

/**
 * The union type of any nodes.
 */
export type XNode =
    | XAttribute
    | XDirective
    | XDirectiveKey
    | XDocumentFragment
    | XElement
    | XEndTag
    | XExpressionContainer
    | XModuleContainer
    | XIdentifier
    | XLiteral
    | XStartTag
    | XText
    | XMustache
    | XJson;

/**
 * Text nodes.
 */
export interface XText extends HasLocation, HasParent {
    type: 'XText';
    parent: XDocumentFragment | XElement;
    value: string;
}

/**
 * The node of JavaScript expression in text.
 * e.g. `{{ name }}`
 */
export interface XExpressionContainer extends HasLocation, HasParent {
    type: 'XExpressionContainer';
    parent: XDocumentFragment | XElement | XAttribute | XDirective | XDirectiveKey;
    expression: ESLintExpression | null;
    references: Reference[];
}


/**
 * The node of Json file.
 * e.g. `{{ name }}`
 */
export interface XJson extends HasLocation, HasParent {
    type: 'XJson';
    parent: XDocumentFragment;
    value: ESLintExpression;
}

/**
 * The node of JavaScript module in text.
 * e.g. `<wxs module="foo"> module.exports = 1 </wxs>`
 */
export interface XModuleContainer extends HasLocation, HasParent {
    type: 'XModuleContainer';
    parent: XElement;
    body: (ESLintStatement | ESLintModuleDeclaration)[] | null;
    references: Reference[];
}

/**
 * Attribute name nodes.
 */
export interface XIdentifier extends HasLocation, HasParent {
    type: 'XIdentifier';
    parent: XAttribute | XDirectiveKey;
    name: string;
    rawName: string;
}

/**
 * Attribute name nodes.
 */
export interface XDirectiveKey extends HasLocation, HasParent {
    type: 'XDirectiveKey';
    parent: XDirective;
    name: XIdentifier;
    argument: XIdentifier | null;
    modifiers: XIdentifier[] | null;
}

/**
 * Attribute value nodes.
 */
export interface XLiteral extends HasLocation, HasParent {
    type: 'XLiteral';
    parent: XAttribute;
    value: string;
}


export interface XMustache extends HasLocation, HasParent {
    type: 'Mustache';
    value: string;
    parent: XAttribute;
}

/* eslint-disable-next-line @typescript-eslint/no-type-alias */
export type XAttributeValue = (XLiteral | XMustache | XExpressionContainer)[];

/**
 * Static attribute nodes.
 */
export interface XAttribute extends HasLocation, HasParent {
    type: 'XAttribute';
    parent: XStartTag;
    directive: false;
    key: XIdentifier;
    value: XAttributeValue;
}

/**
 * Directive nodes.
 */
export interface XDirective extends HasLocation, HasParent {
    type: 'XAttribute';
    parent: XStartTag;
    directive: true;
    key: XDirectiveKey;
    prefix: 'wx:' | 'a:' | 's-' | null;
    value: XAttributeValue;
}

/**
 * Start tag nodes.
 */
export interface XStartTag extends HasLocation, HasParent {
    type: 'XStartTag';
    parent: XElement;
    selfClosing: boolean;
    attributes: (XAttribute | XDirective)[];
}

/**
 * End tag nodes.
 */
export interface XEndTag extends HasLocation, HasParent {
    type: 'XEndTag';
    parent: XElement;
}

/**
 * The property which has concrete information.
 */
export interface HasConcreteInfo {
    tokens: Token[];
    comments: Token[];
    errors: ParseError[];
}

/**
 * Element nodes.
 */
export interface XElement extends HasLocation, HasParent {
    type: 'XElement';
    parent: XDocumentFragment | XElement;
    namespace: Namespace;
    name: string;
    rawName: string;
    startTag: XStartTag;
    children: (XElement | XText | XExpressionContainer | XModuleContainer)[];
    endTag: XEndTag | null;
    variables: Variable[];
}

/**
 * Root nodes.
 */
export interface XDocumentFragment
    extends HasLocation,
    HasParent,
    HasConcreteInfo {
    type: 'XDocumentFragment';
    xmlType: 'wxml' | 'axml' | 'swan' | 'unknown';
    parent: null;
    children: (XElement | XText | XExpressionContainer | XJson)[];
}
