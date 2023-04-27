import * as path from 'path';
import * as AST from './ast';
import { HTMLParser, HTMLTokenizer } from './html';
import { parseScript } from './script';
import * as services from './parser-services';
import { JsonParser } from './script/json-parser';
import TokenStore from './external/token-store';

function getFileType(options: any): string {
    const filePath = (options.filePath as string | undefined) || '.js';
    return path.extname(filePath).slice(1)
        .toLowerCase();
}

function isInlineWxsModule(node: AST.XElement) {
    return node.name === 'wxs'
        && node.children.length
        && node.children[0].type === 'XModuleContainer';
}

function resolveUndefined(options: any) {
    if (!options) {
        return options;
    }

    for (const key of Object.keys(options)) {
        if (options[key] === void 0) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete options[key];
        }
    }
    return options;
}

/**
 * Parse the given source code.
 * @param code The source code to parse.
 * @param options The parser options.
 * @returns The parsing result.
 */
export function parseForESLint(
    code: string,
    parserOptions: any,
): AST.ESLintExtendedProgram {
    const options = {
        comment: true,
        ecmaVersion: 2018,
        loc: true,
        range: true,
        tokens: true,
        ...resolveUndefined(parserOptions),
    };

    let result: AST.ESLintExtendedProgram;
    let document: AST.XDocumentFragment | null;
    const xmlType = getFileType(options);

    // parse script
    if (['wxml', 'axml', 'swan'].includes(xmlType)) {
        const tokenizer = new HTMLTokenizer(code);
        const rootAST = new HTMLParser(tokenizer, options).parse();
        const concreteInfo: AST.HasConcreteInfo = {
            tokens: rootAST.tokens,
            comments: rootAST.comments,
            errors: rootAST.errors,
        };
        const templateBody = rootAST != null
            ? Object.assign(rootAST, { xmlType }, concreteInfo)
            : void 0;

        result = parseScript('', options);
        result.ast.templateBody = templateBody;

        const wxsModules = rootAST.children
            .filter(node => node.type === 'XElement' && isInlineWxsModule(node)) as AST.XElement[];
        const moduleBody: (AST.ESLintStatement | AST.ESLintModuleDeclaration)[] = [];
        for (const wxsModule of wxsModules) {
            for (const body of wxsModule.children) {
                if (body.type === 'XModuleContainer' && body.body != null) {
                    moduleBody.push(...body.body);
                }
            }
        }

        if (moduleBody.length) {
            result.ast.sourceType = 'module';
            result.ast.body = moduleBody;
            result.ast.range = rootAST.range;
            result.ast.tokens = rootAST.tokens;
        }

        document = rootAST;
    }
    else if (xmlType === 'json') {
        const rootAST = new JsonParser(options).parse(code);
        result = parseScript('', options);
        result.ast.templateBody = rootAST;
        document = rootAST;
    }
    else {
        result = parseScript(code, options);
        document = null;
    }

    result.services = Object.assign(
        result.services || {},
        services.define(result.ast, document),
    );

    return result;
}

/**
 * Parse the given source code.
 * @param code The source code to parse.
 * @param options The parser options.
 * @returns The parsing result.
 */
export function parse(code: string, options: any): AST.ESLintProgram {
    return parseForESLint(code, options).ast;
}

export {
    AST,
    TokenStore
};
