import type { Handler } from '@mewjs/htmlparser2/lib/Parser';
import type { Callbacks } from '@mewjs/htmlparser2/lib/Tokenizer';
import Tokenizer from '@mewjs/htmlparser2/lib/Tokenizer';

declare module '@mewjs/htmlparser2' {

    type RemoveOn<K extends string> = K extends `on${ infer R }` ? R : never;
    type EventHandler<T> = {
        [K in keyof T as RemoveOn<K>]: T[K];
    };

    // 'attribdata' | 'opentagname' | 'opentagend' | 'selfclosingtag' | 'attribname' | 'attribend'
    // | 'closetag' | 'declaration' | 'processinginstruction' | 'comment' | 'cdata' | 'text' | 'error' | 'end';
    export type ParserEvent = EventHandler<Callbacks>;

    export declare class Parser {
        tokenizer: Tokenizer;
        handler: DomHandler;
        on<T extends keyof ParserEvent, P = Parameters<ParserEvent[T]>>(
            name: T,
            callback: (this: Parser, ...args: P) => void
        ): void;

        off<T extends keyof ParserEvent, P = Parameters<ParserEvent[T]>>(
            name: T,
            callback: (this: Parser, ...args: P) => void
        ): void;

        emit<T extends keyof ParserEvent, P = Parameters<ParserEvent[T]>>(name: T, ...args: P): void;
    }

    // 'processinginstruction' | 'comment' | 'commentend' | 'cdatastart' | 'text' | 'cdataend'
    // | 'error' | 'closetag' | 'end' | 'reset' | 'parserinit' | 'opentagname' | 'opentag' | 'attribute';
    export type HandlerEvent = EventHandler<Handler>;

    export class DomHandler {
        on<T extends keyof HandlerEvent, P = Parameters<HandlerEvent[T]>>(
            name: T,
            callback: (this: DomHandler, ...args: P) => void
        ): void;

        off<T extends keyof HandlerEvent, P = Parameters<HandlerEvent[T]>>(
            name: T,
            callback: (this: DomHandler, ...args: P) => void
        ): void;

        emit<T extends keyof HandlerEvent, P = Parameters<HandlerEvent[T]>>(name: T, ...args: P): void;
    }

    export class Tokenizer {
        sectionStart: number;
        _index: number;
        buffer: string;
    }
}
