import type { Parser } from '@mewjs/htmlparser2';
import type { HTMLElement, HTMLDocument } from '@mewjs/dom/lib';
import type defaultConfig from '../default/config';
import type Reporter from '../reporter';

export { Node, Element, Document } from 'domhandler/lib/node';
export { ElementType } from 'domelementtype';
export { HTMLDocument } from '@mewjs/dom/lib';

export type ConfigurationValue = string | boolean | number | ConfigObject;
interface ConfigObject {
    [key: string]: ConfigurationValue;
}
/* eslint-disable-next-line @typescript-eslint/no-type-alias */
export type Configuration = typeof defaultConfig;
// export type Configuration = {
//     [key in keyof (typeof defaultConfig)]: ConfigurationValue | ConfigObject;
// };

export declare type Target = 'document' | 'parser';

export declare interface ASTNode {
    index: number;
    content: string;
}

export declare interface ASTTarget {
    [key: string]: ASTNode[];
}

export declare interface Config {
    index: number;
    content: string | boolean | number | Record<string, string | boolean | number>;
}

export declare interface Configs {
    [key: string]: Config[];
}

// export declare type ParserLinter = (getConfig: getConfigValue, parser: Parser, reporter: Reporter, code?: string) => void
// export declare type DocumentLinter =( getConfig: getConfigValue, document: HTMLElement, reporter: Reporter, code?: string) => void


export declare type getConfigValue = (
    indexOrParser?: number | string | Parser | HTMLElement,
    ruleName?: string
) => ConfigurationValue;
export declare type Linter<T> = (getConfig: getConfigValue, parser: T, reporter: Reporter, code?: string) => void;
export declare type Formatter = (getConfig: getConfigValue, document: HTMLDocument, options: object) => void;

export interface RuleOptions {
    target: Target;
    name: string;
    desc: string;
    lint?: Linter<Parser> | Linter<HTMLDocument>;
    format?: Formatter;
}

export interface FormatterRule extends RuleOptions {
    format: Formatter;
}

export interface ParserRule extends RuleOptions {
    lint: Linter<Parser>;
}

export interface DocumentRule extends RuleOptions {
    lint: Linter<HTMLDocument>;
}

export declare interface InlineConfigRules {
    [key: string]: string;
}

export declare interface InlineConfigs {
    // [key: string]: object,
    rules: Configs;
    reporter: Configs;
}

export type RuleType = Parser | HTMLDocument;

/**
 * class Rule
 *
 * @constructor
 * @param {Object} rule - config info for rule
 */
export class Rule<T extends RuleOptions> implements RuleOptions {
    target: Target = 'document';
    name = '';
    desc = '';
    lint: null;
    format: null;

    constructor(options: T) {
        Object.assign(this, options);
    }

    static create<T extends RuleOptions>(options: T): Rule<T> {
        if (options instanceof Rule) {
            return options;
        }

        return new Rule<T>(options);
    }
}

export interface RuleHelper {
    indent: (content: string) => string;
    trim: (content: string) => string;
}

