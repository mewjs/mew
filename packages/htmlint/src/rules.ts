/* eslint-disable class-methods-use-this */
import type { Parser } from '@mewjs/htmlparser2';

import type Reporter from './reporter';
import {
    getConfigByIndex,
    extractCommentInfo
} from './util';
import { parseRules } from './fs-util';
import type {
    Configuration,
    Configs,
    Node,
    Target,
    RuleOptions,
    ParserRule,
    DocumentRule,
    FormatterRule,
    InlineConfigs,
    getConfigValue,
    HTMLDocument
} from './typings/types';
import {
    Rule
} from './typings/types';

const rules: Rule<RuleOptions>[] = [];

function collect(index: number, ruleName: string, content: string, target: Configs) {
    (target[ruleName] = target[ruleName] || []).push({
        index,
        content
    });
}


class RulesManager {

    /**
     * Init rules.
     *
     * @return {Object} rules export
     */
    init(): this {
        rules.length = 0;

        parseRules().forEach(rule => {
            this.add(rule);
        });

        return this;
    }

    /**
     * Add a rule.
     *
     * @param {Object} rule - rule to add
     * @return {number} current rules num
     */
    add<T extends RuleOptions>(options: T | Rule<T>): number {
        const rule = Rule.create(options);
        return rules.push(rule);
    }

    /**
     * Get list of rule for given target.
     *
     * @param {Target=} target - given target ("document" / "parser")
     * @return {Array} rule list
     */
    list<T extends RuleOptions>(target?: Target): Rule<T>[] {
        if (!target) {
            return rules.slice();
        }

        return rules.filter(rule => rule.target === target);
    }

    /**
     * Collect inline-config info during parse.
     *
     * @param {Parser} parser - the HTML parser, instance of htmlparser2.Parser
     * @return {InlineConfigs} inline-config info, including reporter config & rules config
     */
    collectInlineConfig(parser: Parser): InlineConfigs {
        const rulesConfig = {} as Configs;
        const reporterConfig = {} as Configs;

        parser.on('comment', (comment: string) => {
            const commentInfo = extractCommentInfo(comment);

            // if no valid info
            if (!commentInfo) {
                return;
            }

            const { operation, content } = commentInfo;
            const { startIndex } = parser;

            switch (operation) {

                case 'enable':
                case 'disable':
                case 'disable-next-line':
                    /* eslint-disable-next-line no-case-declarations */
                    const targets = content as string[];

                    rules.forEach(({ name }) => {
                        if (!targets || targets.includes(name)) {
                            collect(startIndex, name, operation, reporterConfig);
                        }
                    });

                    break;

                case 'config':
                    /* eslint-disable-next-line no-case-declarations */
                    const config = content as Record<string, string>;
                    for (const ruleName in config) {
                        if (Object.prototype.hasOwnProperty.call(config, ruleName)) {
                            collect(startIndex, ruleName, config[ruleName], rulesConfig);
                        }
                    }
                    break;
            }
        });

        return {
            rules: rulesConfig,
            reporter: reporterConfig
        };
    }

    /**
     * Do lint parser.
     *
     * @param {Parser} parser - the HTML parser, instance of htmlparser2.Parser
     * @param {Reporter} reporter - the reporter
     * @param {Partial<Configuration>} config - config
     * @param {InlineConfigs} inlineConfig - inline config
     * @param {string} code - target code
     * @return {RulesManager} rules export
     */
    lintParser(
        parser: Parser,
        reporter: Reporter,
        config: Partial<Configuration>,
        inlineConfig: Configs,
        code: string
    ): this {
        config = { ...config };

        // lint parser
        this.list<ParserRule>('parser').forEach(rule => {
            const getConfig: getConfigValue = function (indexOrParser, ruleName) {
                const index = indexOrParser == null ? parser.startIndex : indexOrParser as number;
                ruleName = ruleName == null ? rule.name : ruleName;

                return getConfigByIndex(ruleName, index, inlineConfig, config);
            };

            (rule as ParserRule).lint(
                getConfig,
                parser,
                reporter.bindRule(rule.name),
                code
            );
        });

        return this;
    }

    /**
     * Do lint document.
     *
     * @param {HTMLDocument} document - the document node
     * @param {Reporter} reporter - the reporter
     * @param {Partial<Configuration>} config - config
     * @param {Configs} inlineConfig - inline config
     * @param {string} code - target code
     * @return {RulesManager} rules export
     */
    lintDocument(
        document: HTMLDocument,
        reporter: Reporter,
        config: Partial<Configuration>,
        inlineConfig: Configs,
        code: string
    ): this {
        config = { ...config };

        // lint document
        this.list<DocumentRule>('document').forEach(item => {
            const rule = item as DocumentRule;

            const getConfig: getConfigValue = function (indexOrParser, ruleName) {
                const index = indexOrParser == null
                    ? -1
                    : ((indexOrParser as HTMLDocument).startIndex || indexOrParser as number);

                return getConfigByIndex(ruleName ?? rule.name, index, inlineConfig, config);
            };

            try {
                rule.lint(
                    getConfig,
                    document,
                    reporter.bindRule(rule.name),
                    code
                );
            }
            catch (e) {
                console.warn('Error:', e.stack || e);
            }
        });

        return this;
    }

    /**
     * Do format document.
     *
     * @param {HTMLDocument} document - the document node
     * @param {Configuration} config - config
     * @param {Configs} inlineConfig - inline config
     * @param {Object} options - options for format
     * @return {RulesManager} rules export
     */
    format(document: HTMLDocument, config: Partial<Configuration>, inlineConfig: Configs, options: object): this {
        // format document
        rules.forEach(item => {
            const rule = item;

            if (rule.format) {
                const getConfig: getConfigValue = (indexOrParser, ruleName) => {
                    const index = indexOrParser == null
                        ? -1
                        : ((indexOrParser as Node).startIndex || indexOrParser as number);
                    ruleName = ruleName == null ? rule.name : ruleName;

                    return getConfigByIndex(ruleName, index, inlineConfig, config);
                };

                try {
                    (rule as FormatterRule).format(
                        getConfig,
                        document,
                        options
                    );
                }
                catch (e) {
                    console.warn('Error:', e.stack || e);
                }
            }
        });

        return this;
    }
}

const rulesManager = new RulesManager().init();

export default rulesManager;
