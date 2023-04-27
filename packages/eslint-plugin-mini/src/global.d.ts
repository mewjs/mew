/* eslint-disable @typescript-eslint/no-type-alias */
import type * as ESTree from 'estree';
import type * as eslint from 'eslint';
import type * as jsonSchema from 'json-schema';
import type {
    AST as XAST,
    TokenStore
} from '@mewjs/mpxml-eslint-parser';

declare global {

    export interface ParserServices {

        /**
         * Define handlers to traverse the template body.
         * @param templateBodyVisitor The template body handlers.
         * @param scriptVisitor The script handlers. This is optional.
         */
        defineTemplateBodyVisitor(templateBodyVisitor: RuleListener, scriptVisitor?: RuleListener): any;

        /**
         * Get the token store of the template body.
         * @returns The token store of template body.
         */
        getTemplateBodyTokenStore(): TokenStore;

        /**
         * Get the root document fragment.
         * @returns The root document fragment.
         */
        getDocumentFragment(): XAST.XDocumentFragment | null;
    }

    namespace ParserServices {
        // interface TokenStore extends SourceCode {

        // }

        type XTokenStore = TokenStore;
    }

    type ReportDescriptor = eslint.Rule.ReportDescriptor | {
        node: XAST.XNode | Token;
    };

    type JSONSchema4 = jsonSchema.JSONSchema4;


    // estree
    type BaseExpression = ESTree.BaseExpression;
    type AssignmentExpression = ESTree.AssignmentExpression;
    type ObjectExpression = ESTree.ObjectExpression;
    type Property = ESTree.Property;
    type MethodDefinition = ESTree.MethodDefinition;
    type ArrayExpression = ESTree.ArrayExpression;
    type ArrayPattern = ESTree.ArrayPattern;
    type ArrowFunctionExpression = ESTree.ArrowFunctionExpression;
    type AssignmentPattern = ESTree.AssignmentPattern;
    type NodeParentExtension = eslint.Rule.NodeParentExtension;
    type BinaryExpression = ESTree.BinaryExpression;
    type AwaitExpression = ESTree.AwaitExpression;
    type RestElement = ESTree.RestElement;
    type SpreadElement = ESTree.SpreadElement;
    type UnaryExpression = ESTree.UnaryExpression;
    type BlockStatement = ESTree.BlockStatement;
    type ClassBody = ESTree.ClassBody;
    type BreakStatement = ESTree.BreakStatement;
    type ContinueStatement = ESTree.ContinueStatement;
    type ReturnStatement = ESTree.ReturnStatement;
    type ThrowStatement = ESTree.ThrowStatement;
    type CallExpression = ESTree.CallExpression;
    type ImportExpression = ESTree.ImportExpression;
    type CatchClause = ESTree.CatchClause;
    type ClassExpression = ESTree.ClassExpression;
    type ConditionalExpression = ESTree.ConditionalExpression;
    type DoWhileStatement = ESTree.DoWhileStatement;
    type ExportAllDeclaration = ESTree.ExportAllDeclaration;
    type ExportDefaultDeclaration = ESTree.ExportDefaultDeclaration;
    type ExportNamedDeclaration = ESTree.ExportNamedDeclaration;
    type ClassDeclaration = ESTree.ClassDeclaration;
    type ExportSpecifier = ESTree.ExportSpecifier;
    type ForInStatement = ESTree.ForInStatement;
    type ForOfStatement = ESTree.ForOfStatement;
    type ForStatement = ESTree.ForStatement;
    type FunctionDeclaration = ESTree.FunctionDeclaration;
    type FunctionExpression = ESTree.FunctionExpression;
    type IfStatement = ESTree.IfStatement;
    type ImportDeclaration = ESTree.ImportDeclaration;
    type ImportSpecifier = ESTree.ImportSpecifier;
    type ImportNamespaceSpecifier = ESTree.ImportNamespaceSpecifier;
    type LabeledStatement = ESTree.LabeledStatement;
    type MetaProperty = ESTree.MetaProperty;
    type NewExpression = ESTree.NewExpression;
    type ObjectPattern = ESTree.ObjectPattern;
    type SequenceExpression = ESTree.SequenceExpression;
    type SwitchCase = ESTree.SwitchCase;
    type SwitchStatement = ESTree.SwitchStatement;
    type VariableDeclaration = ESTree.VariableDeclaration;
    type VariableDeclarator = ESTree.VariableDeclarator;
    type WhileStatement = ESTree.WhileStatement;
    type WithStatement = ESTree.WithStatement;
    type YieldExpression = ESTree.YieldExpression;
    type Statement = ESTree.Statement;
    type LogicalExpression = ESTree.LogicalExpression;
    type TemplateLiteral = ESTree.TemplateLiteral;
    type TaggedTemplateExpression = ESTree.TaggedTemplateExpression;
    type TryStatement = ESTree.TryStatement;
    type UpdateExpression = ESTree.UpdateExpression;
    type MemberExpression = ESTree.MemberExpression;
    type Program = ESTree.Program;
    type Expression = ESTree.Expression;
    type Node = ESTree.Node;
    type Position = ESTree.Position;
    type SourceLocation = ESTree.SourceLocation;


    // eslint
    type SourceCode = eslint.SourceCode;
    type NodeListener = eslint.Rule.NodeListener;
    type RuleFixer = eslint.Rule.RuleFixer;
    type Fix = eslint.Rule.Fix;
    type LintMessage = eslint.Linter.LintMessage;
    type RuleMetaData = eslint.Rule.RuleMetaData;

    type RuleListener = eslint.Rule.RuleListener & {
        Program?: ((node: XProgram) => void) | undefined;
        XAttribute?: ((node: XAttribute) => void) | undefined;
        XElement?: ((node: XElement) => void) | undefined;
    };

    interface RuleContext extends eslint.Rule.RuleContext {
        parserServices: ParserServices;
        report(descriptor: ReportDescriptor): void;
    }

    interface RuleModule extends eslint.Rule.RuleModule {
        create(context: RuleContext): RuleListener;
    }

    // mpxml
    type Token = XAST.Token | eslint.AST.Token;
    // type ParserServices = XParserServices;
    type Range = XAST.OffsetRange;
    type XProgram = XAST.ESLintProgram & { templateBody: XDocumentFragment };
    type XDocumentFragment = XAST.XDocumentFragment;
    type XAttribute = XAST.XAttribute;
    type XDirective = XAST.XDirective;
    type XElement = XAST.XElement;
    type XNode = XAST.XNode | ESTree.Node & { loc: XAST.Location; range: XAST.OffsetRange; parent: any };
    type XMustache = XAST.XMustache;
    type XLiteral = XAST.XLiteral;
    type XDirectiveKey = XAST.XDirectiveKey;
    type XIdentifier = XAST.XIdentifier;
    type XExpressionContainer = XAST.XExpressionContainer;
    type XText = XAST.XText;
    type XModuleContainer = XAST.XModuleContainer;
    type XStartTag = XAST.XStartTag;
    type XEndTag = XAST.XEndTag;
    type Reference = XAST.Reference;
    type XJson = XAST.XJson;

    export interface TemplateListener extends RuleListener{
        [key: string]: ((...args: any) => void) | undefined;
    }
}
/* eslint-enable @typescript-eslint/no-type-alias */
