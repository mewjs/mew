# AST for `<template lang="html">`

Some types are featured from [ESTree].

- [Program]
- [Node]
- [Statement]
- [BlockStatement]
- [Expression]
- [Literal]
- [Pattern]

You can use the type definition of this AST:

```ts
import { AST } from "vue-eslint-parser"

export function create(context) {
    return context.parserServices.defineTemplateBodyVisitor(
        // Event handlers for <template>.
        {
            XElement(node: AST.XElement): void {
                //...
            }
        },
        // Event handlers for <script> or scripts. (optional)
        {
            Program(node: AST.ESLintProgram): void {
                //...
            }
        }
    )
}
```

`AST` has the types of ESLint's AST with the prefix `ESLint`.<br>
See details: [../src/ast/nodes.ts](../src/ast/nodes.ts)

## Node

```js
extend interface Node {
    range: [ number ]
}
```

- This AST spec enhances the [Node] nodes like ESLint.
- The `range` property is an array which has 2 integers.
  The 1st integer is the offset of the start location of the node.
  The 2nd integer is the offset of the end location of the node.

## XIdentifier

```js
interface XIdentifier <: Node {
    type: "XIdentifier"
    name: string
    rawName: string
}
```

- This is similar to [Identifier] nodes but this `name` property can include any
  characters except U+0000-U+001F, U+007F-U+009F, U+0020, U+0022, U+0027, U+003E,
  U+002F, U+003D, U+FDD0-U+FDEF, U+FFFE, U+FFFF, U+1FFFE, U+1FFFF, U+2FFFE, U+2FFFF,
  U+3FFFE, U+3FFFF, U+4FFFE, U+4FFFF, U+5FFFE, U+5FFFF, U+6FFFE, U+6FFFF, U+7FFFE,
  U+7FFFF, U+8FFFE, U+8FFFF, U+9FFFE, U+9FFFF, U+AFFFE, U+AFFFF, U+BFFFE, U+BFFFF,
  U+CFFFE, U+CFFFF, U+DFFFE, U+DFFFF, U+EFFFE, U+EFFFF, U+FFFFE, U+FFFFF, U+10FFFE
  and U+10FFFF.
- This is attribute names.

## XText

```js
interface XText <: Node {
    type: "XText"
    value: string
}
```

- Plain text of HTML.
- HTML entities in the `value` property are decoded.

## XExpressionContainer

```js
interface XExpressionContainer <: Node {
    type: "XExpressionContainer"
    expression: Expression | null
    references: [ Reference ]
}

interface Reference {
    id: Identifier
    mode: "rw" | "r" | "w"
    variable: Variable | null
}

interface XForExpression <: Expression {
    type: "XForExpression"
    left: [ Pattern ]
    right: Expression
}

interface XOnExpression <: Expression {
    type: "XOnExpression"
    body: [ Statement ]
}

interface XSlotScopeExpression <: Expression {
    type: "XSlotScopeExpression"
    params: [ Pattern | RestElement ]
}

interface XFilterSequenceExpression <: Expression {
    type: "XFilterSequenceExpression"
    expression: Expression
    filters: [ XFilter ]
}

interface XFilter <: Node {
    type: "XFilter"
    callee: Identifier
    arguments: [ Expression ]
}
```

- This is mustaches or directive values.
- If syntax errors exist, `XExpressionContainer#expression` is `null`.
- If it's an empty mustache, `XExpressionContainer#expression` is `null`. (e.g., `{{ /* a comment */ }}`)
- `Reference` is objects but not `Node`. Those are external references which are in the expression.
- `Reference#variable` is the variable which is defined by a `XElement`. If a reference uses a global variable or a member of VM, this is `null`.

## XDirectiveKey

```js
interface XDirectiveKey <: Node {
    type: "XDirectiveKey"
    name: XIdentifier
    argument: XExpressionContainer | XIdentifier | null
    modifiers: [ XIdentifier ]
}
```


## XLiteral

```js
interface XLiteral <: Node {
    type: "XAttributeValue"
    value: string
}
```

- This is similar to [Literal] nodes but this is not always quoted.
- HTML entities in the `value` property are decoded.

## XAttribute

```js
interface XAttribute <: Node {
    type: "XAttribute"
    directive: false
    key: XIdentifier
    value: XLiteral | null
}

interface VDirective <: Node {
    type: "XAttribute"
    directive: true
    key: XDirectiveKey
    value: XExpressionContainer | null
}
```

- If their attribute value does not exist, the `value` property is `null`.
- The `slot-scope` attribute becomes `directive:true` specially.

## XStartTag

```js
interface XStartTag <: Node {
    type: "XStartTag"
    attributes: [ XAttribute ]
}
```

## XEndTag

```js
interface XEndTag <: Node {
    type: "XEndTag"
}
```

## XElement

```js
interface XElement <: Node {
    type: "XElement"
    namespace: string
    name: string
    startTag: XStartTag
    children: [ XText | XExpressionContainer | XElement ]
    endTag: XEndTag | null
    variables: [ Variable ]
}

interface Variable {
    id: Identifier
    kind: "x-for" | "scope"
    references: [ Reference ]
}
```

- `Variable` is objects but not `Node`. Those are variable declarations that child elements can use. The elements which have [`x-for` directives] or a special attribute [scope] can declare variables.
- `Variable#references` is an array of references which use this variable.

## XRootElement

```js
interface XRootElement <: XElement {
    tokens: [ Token ]
    comments: [ Token ]
    errors: [ ParseError ]
}

interface Token <: Node {
    type: string
    value: string
}

interface ParseError <: Error {
    code?: string
    message: string
    index: number
    lineNumber: number
    column: number
}
```

## Program

```js
extend interface Program {
    templateBody: XRootElement | null
}
```

This spec enhances [Program] nodes as it has the root node of `<template>`.
This supports only HTML for now. However, I'm going to add other languages Vue.js supports. The AST of other languages may be different form to XElement.

[ESTree]: https://github.com/estree/estree
[Program]: https://github.com/estree/estree/blob/master/es5.md#programs
[Node]: https://github.com/estree/estree/blob/master/es5.md#node-objects
[Statement]: https://github.com/estree/estree/blob/master/es5.md#statements
[BlockStatement]: https://github.com/estree/estree/blob/master/es5.md#blockstatement
[Expression]: https://github.com/estree/estree/blob/master/es5.md#expressions
[Literal]: https://github.com/estree/estree/blob/master/es5.md#literal
[Pattern]: https://github.com/estree/estree/blob/master/es5.md#patterns
[Identifier]: https://github.com/estree/estree/blob/master/es5.md#identifier
[ForInStatement]: https://github.com/estree/estree/blob/master/es5.md#forinstatement
[VariableDeclarator]: https://github.com/estree/estree/blob/master/es5.md#variabledeclarator
