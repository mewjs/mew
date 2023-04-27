import EventEmitter from 'events';
import NodeEventGenerator from './external/node-event-generator';
import TokenStore from './external/token-store';
import type {
    ESLintProgram,
    XDocumentFragment
} from './ast';
import {
    traverseNodes
} from './ast';

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
const emitters = new WeakMap<object, EventEmitter>();
const stores = new WeakMap<object, TokenStore>();

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

export interface ParserServices {

    /**
     * Define handlers to traverse the template body.
     * @param templateBodyVisitor The template body handlers.
     * @param scriptVisitor The script handlers. This is optional.
     */
    defineTemplateBodyVisitor(
        templateBodyVisitor: { [key: string]: (...args: any) => void },
    ): object;

    /**
     * Get the token store of the template body.
     * @returns The token store of template body.
     */
    getTemplateBodyTokenStore(): TokenStore;

    /**
     * Get the root document fragment.
     * @returns The root document fragment.
     */
    getDocumentFragment(): XDocumentFragment | null;
}

/**
 * Define the parser service
 * @param rootAST
 */
export function define(
    rootAST: ESLintProgram,
    document: XDocumentFragment | null,
): ParserServices {
    return {

        /**
         * Define handlers to traverse the template body.
         * @param templateBodyVisitor The template body handlers.
         */
        defineTemplateBodyVisitor(
            templateBodyVisitor: { [key: string]: (...args: any) => void },
        ): Record<string, unknown> {
            const scriptVisitor: { [key: string]: (...args: any) => void } = {};

            if (rootAST.templateBody == null) {
                return scriptVisitor;
            }

            let emitter = emitters.get(rootAST);

            // If this is the first time, initialize the intermediate event emitter.
            if (emitter == null) {
                emitter = new EventEmitter();
                emitter.setMaxListeners(0);
                emitters.set(rootAST, emitter);

                const programExitHandler = scriptVisitor['Program:exit'];
                scriptVisitor['Program:exit'] = node => {
                    try {
                        if (typeof programExitHandler === 'function') {
                            programExitHandler(node);
                        }

                        // Traverse template body.
                        const generator = new NodeEventGenerator(
                            emitter!,
                        );
                        traverseNodes(
                            rootAST.templateBody as XDocumentFragment,
                            generator,
                        );
                    }
                    finally {
                        scriptVisitor['Program:exit'] = programExitHandler;
                        emitters.delete(rootAST);
                    }
                };
            }

            // Register handlers into the intermediate event emitter.
            for (const selector of Object.keys(templateBodyVisitor)) {
                emitter.on(selector, templateBodyVisitor[selector]);
            }

            return scriptVisitor;
        },

        /**
         * Get the token store of the template body.
         * @returns The token store of template body.
         */
        getTemplateBodyTokenStore(): TokenStore {
            const ast = rootAST.templateBody;
            const key = ast || stores;
            let store = stores.get(key);

            if (!store) {
                store = ast != null
                    ? new TokenStore(ast.tokens, ast.comments)
                    : new TokenStore([], []);
                stores.set(key, store);
            }

            return store;
        },

        /**
         * Get the root document fragment.
         * @returns The root document fragment.
         */
        getDocumentFragment(): XDocumentFragment | null {
            return document;
        },
    };
}
