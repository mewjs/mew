import type * as escopeTypes from 'eslint-scope';
import escope from 'eslint-scope';
import type {
    ESLintIdentifier,
    ESLintProgram,
    Reference
} from '../ast';
import {
    getFallbackKeys,
} from '../ast';

/**
 * Check whether the given reference is unique in the belonging array.
 * @param reference The current reference to check.
 * @param index The index of the reference.
 * @param references The belonging array of the reference.
 */
function isUnique(
    reference: escopeTypes.Reference,
    index: number,
    references: escopeTypes.Reference[],
): boolean {
    return (
        index === 0 || reference.identifier !== references[index - 1].identifier
    );
}


/**
 * Transform the given reference object.
 * @param reference The source reference object.
 * @returns The transformed reference object.
 */
function transformReference(reference: escopeTypes.Reference): Reference {
    const ret: Reference = {
        id: reference.identifier as ESLintIdentifier,
        mode: reference.isReadOnly()
            ? 'r'
            : reference.isWriteOnly()
                ? 'w'
                : /* otherwise */ 'rw',
        variable: null,
    };
    Object.defineProperty(ret, 'variable', { enumerable: false });

    return ret;
}


/**
 *
 * @param ast
 * @param parserOptions
 */
function analyze(ast: ESLintProgram, parserOptions: any): escopeTypes.Scope {
    const ecmaVersion = parserOptions.ecmaVersion || 2017;
    const ecmaFeatures = parserOptions.ecmaFeatures || {};
    const sourceType = parserOptions.sourceType || 'script';
    const result = escope.analyze(ast, {
        ignoreEval: true,
        nodejsScope: false,
        impliedStrict: ecmaFeatures.impliedStrict,
        ecmaVersion,
        sourceType,
        // @ts-expect-error
        fallback: getFallbackKeys,
    });

    return result.globalScope;
}

/**
 * Analyze the external references of the given AST.
 * @param {ASTNode} ast The root node to analyze.
 * @returns {Reference[]} The reference objects of external references.
 */
export function analyzeExternalReferences(
    ast: ESLintProgram,
    parserOptions: any,
): Reference[] {
    const scope = analyze(ast, parserOptions);
    return scope.through.filter(isUnique).map(transformReference);
}

