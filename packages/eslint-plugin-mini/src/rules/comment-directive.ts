import utils from '../utils';

interface RuleAndLocation {
    ruleId: string;
    index: number;
    key?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const COMMENT_DIRECTIVE_B = /^\s*(eslint-(?:en|dis)able)(?:\s+|$)/;
const COMMENT_DIRECTIVE_L = /^\s*(eslint-disable(?:-next)?-line)(?:\s+|$)/;

/**
 * Remove the ignored part from a given directive comment and trim it.
 * @param {string} value The comment text to strip.
 * @returns {string} The stripped text.
 */
function stripDirectiveComment(value: string): string {
    return value.split(/\s-{2,}\s/u)[0];
}

/**
 * Parse a given comment.
 * @param {RegExp} pattern The RegExp pattern to parse.
 * @param {string} comment The comment value to parse.
 * @returns {({type:string,rules:RuleAndLocation[]})|null} The parsing result.
 */
function parse(pattern: RegExp, comment: string): ({ type: string; rules: RuleAndLocation[] }) | null {
    const text = stripDirectiveComment(comment);
    const match = pattern.exec(text);
    if (match == null) {
        return null;
    }

    const type = match[1];

    const rules: RuleAndLocation[] = [];

    const rulesRe = /([^,\s]+)[,\s]*/g;
    let startIndex = match[0].length;
    rulesRe.lastIndex = startIndex;

    let res: string[] | null;
    while ((res = rulesRe.exec(text))) {
        const ruleId = res[1].trim();
        rules.push({
            ruleId,
            index: startIndex
        });
        startIndex = rulesRe.lastIndex;
    }

    return { type, rules };
}

/**
 * Enable rules.
 * @param {RuleContext} context The rule context.
 * @param {{line:number,column:number}} loc The location information to enable.
 * @param { 'block' | 'line' } group The group to enable.
 * @param {string | null} rule The rule ID to enable.
 * @returns {void}
 */
function enable(
    context: RuleContext,
    loc: { line: number; column: number },
    group: 'block' | 'line',
    rule: string | null
): void {
    if (rule) {
        context.report({
            loc,
            messageId: group === 'block' ? 'enableBlockRule' : 'enableLineRule',
            data: { rule }
        });
    }
    else {
        context.report({
            loc,
            messageId: group === 'block' ? 'enableBlock' : 'enableLine'
        });
    }
}

/**
 * Disable rules.
 * @param {RuleContext} context The rule context.
 * @param {{line:number,column:number}} loc The location information to disable.
 * @param { 'block' | 'line' } group The group to disable.
 * @param {string | null} rule The rule ID to disable.
 * @param {string} key The disable directive key.
 * @returns {void}
 */
function disable(
    context: RuleContext,
    loc: { line: number; column: number },
    group: 'block' | 'line',
    rule: string | null,
    key: string
): void {
    if (rule) {
        context.report({
            loc,
            messageId: group === 'block' ? 'disableBlockRule' : 'disableLineRule',
            data: { rule, key }
        });
    }
    else {
        context.report({
            loc,
            messageId: group === 'block' ? 'disableBlock' : 'disableLine',
            data: { key }
        });
    }
}

/**
 * Process a given comment token.
 * If the comment is `eslint-disable` or `eslint-enable` then it reports the comment.
 * @param {RuleContext} context The rule context.
 * @param {Token} comment The comment token to process.
 * @param {boolean} reportUnusedDisableDirectives To report unused eslint-disable comments.
 * @returns {void}
 */
function processBlock(context: RuleContext, comment: Token, reportUnusedDisableDirectives: boolean): void {
    const parsed = parse(COMMENT_DIRECTIVE_B, comment.value);
    if (parsed != null) {
        if (parsed.type === 'eslint-disable') {
            if (parsed.rules.length) {
                const rules = reportUnusedDisableDirectives
                    ? reportUnusedRules(context, comment, parsed.type, parsed.rules)
                    : parsed.rules;
                for (const rule of rules) {
                    disable(
                        context,
                        comment.loc.start,
                        'block',
                        rule.ruleId,
                        rule.key || '*'
                    );
                }
            }
            else {
                const key = reportUnusedDisableDirectives
                    ? reportUnused(context, comment, parsed.type)
                    : '';
                disable(context, comment.loc.start, 'block', null, key);
            }
        }
        else if (parsed.rules.length) {
            for (const rule of parsed.rules) {
                enable(context, comment.loc.start, 'block', rule.ruleId);
            }
        }
        else {
            enable(context, comment.loc.start, 'block', null);
        }
    }
}

/**
 * Process a given comment token.
 * If the comment is `eslint-disable-line` or `eslint-disable-next-line` then it reports the comment.
 * @param {RuleContext} context The rule context.
 * @param {Token} comment The comment token to process.
 * @param {boolean} reportUnusedDisableDirectives To report unused eslint-disable comments.
 * @returns {void}
 */
function processLine(context: RuleContext, comment: Token, reportUnusedDisableDirectives: boolean): void {
    const parsed = parse(COMMENT_DIRECTIVE_L, comment.value);
    if (parsed != null && comment.loc.start.line === comment.loc.end.line) {
        const line
      = comment.loc.start.line + (parsed.type === 'eslint-disable-line' ? 0 : 1);
        const column = -1;
        if (parsed.rules.length) {
            const rules = reportUnusedDisableDirectives
                ? reportUnusedRules(context, comment, parsed.type, parsed.rules)
                : parsed.rules;
            for (const rule of rules) {
                disable(context, { line, column }, 'line', rule.ruleId, rule.key || '');
                enable(context, { line: line + 1, column }, 'line', rule.ruleId);
            }
        }
        else {
            const key = reportUnusedDisableDirectives
                ? reportUnused(context, comment, parsed.type)
                : '';
            disable(context, { line, column }, 'line', null, key);
            enable(context, { line: line + 1, column }, 'line', null);
        }
    }
}

/**
 * Reports unused disable directive.
 * Do not check the use of directives here. Filter the directives used with post process.
 * @param {RuleContext} context The rule context.
 * @param {Token} comment The comment token to report.
 * @param {string} kind The comment directive kind.
 * @returns {string} The report key
 */
function reportUnused(context: RuleContext, comment: Token, kind: string): string {
    const { loc } = comment;

    context.report({
        loc,
        messageId: 'unused',
        data: { kind }
    });

    return locToKey(loc.start);
}

/**
 * Reports unused disable directive rules.
 * Do not check the use of directives here. Filter the directives used with post process.
 * @param {RuleContext} context The rule context.
 * @param {Token} comment The comment token to report.
 * @param {string} kind The comment directive kind.
 * @param {RuleAndLocation[]} rules To report rule.
 * @returns { { ruleId: string, key: string }[] }
 */
function reportUnusedRules(
    context: RuleContext,
    comment: Token,
    kind: string,
    rules: RuleAndLocation[]
): { ruleId: string; key: string }[] {
    const sourceCode = context.getSourceCode();
    const commentStart = comment.range[0] + 4; /* <!-- */

    return rules.map(rule => {
        const start = sourceCode.getLocFromIndex(commentStart + rule.index);
        const end = sourceCode.getLocFromIndex(
            commentStart + rule.index + rule.ruleId.length
        );

        context.report({
            loc: { start, end },
            messageId: 'unusedRule',
            data: { rule: rule.ruleId, kind }
        });

        return {
            ruleId: rule.ruleId,
            key: locToKey(start)
        };
    });
}

/**
 * Gets the key of location
 * @param {Position} location The location
 * @returns {string} The key
 */
function locToKey(location: Position): string {
    return `line:${ location.line },column${ location.column }`;
}

/**
 * Extracts the top-level elements in document fragment.
 * @param {XDocumentFragment} documentFragment The document fragment.
 * @returns {XElement[]} The top-level elements
 */
function extractTopLevelHTMLElements(documentFragment: XDocumentFragment): XElement[] {
    // @ts-expect-error
    return documentFragment.children.filter(node => node.type === 'XElement');
}

/**
 * Extracts the top-level comments in document fragment.
 * @param {XDocumentFragment} documentFragment The document fragment.
 * @returns {Token[]} The top-level comments
 */
function extractTopLevelDocumentFragmentComments(documentFragment: XDocumentFragment): Token[] {
    const elements = extractTopLevelHTMLElements(documentFragment);

    return documentFragment.comments.filter(
        comment =>
            elements.every(
                element =>
                    comment.range[1] <= element.range[0] || element.range[1] <= comment.range[0]
            )
    );
}

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'support comment-directives',
            categories: ['base'],
            url: utils.getRuleUrl('comment-directive')
        },
        schema: [
            {
                type: 'object',
                properties: {
                    reportUnusedDisableDirectives: {
                        type: 'boolean'
                    }
                },
                additionalProperties: false
            }
        ],
        messages: {
            disableBlock: '--block {{key}}',
            enableBlock: '++block',
            disableLine: '--line {{key}}',
            enableLine: '++line',
            disableBlockRule: '-block {{rule}} {{key}}',
            enableBlockRule: '+block {{rule}}',
            disableLineRule: '-line {{rule}} {{key}}',
            enableLineRule: '+line {{rule}}',
            clear: 'clear',
            unused: 'Unused {{kind}} directive (no problems were reported).',
            unusedRule: 'Unused {{kind}} directive (no problems were reported from \'{{rule}}\').'
        }
    },

    create(context) {
        const options = context.options[0] || {};

        const { reportUnusedDisableDirectives } = options;
        const documentFragment = context.parserServices.getDocumentFragment?.();

        return {

            Program(node: XProgram) {
                if (node.templateBody) {
                    // Send directives to the post-process.
                    for (const comment of node.templateBody.comments) {
                        processBlock(context, comment, reportUnusedDisableDirectives);
                        processLine(context, comment, reportUnusedDisableDirectives);
                    }

                    // Send a clear mark to the post-process.
                    context.report({
                        loc: node.templateBody.loc.end,
                        messageId: 'clear'
                    });
                }
                if (documentFragment) {
                    // Send directives to the post-process.
                    for (const comment of extractTopLevelDocumentFragmentComments(documentFragment)) {
                        processBlock(context, comment, reportUnusedDisableDirectives);
                        processLine(context, comment, reportUnusedDisableDirectives);
                    }

                    // Send a clear mark to the post-process.
                    for (const element of extractTopLevelHTMLElements(documentFragment)) {
                        context.report({
                            loc: element.loc.end,
                            messageId: 'clear'
                        });
                    }
                }
            }
        } as RuleListener;
    }
} as RuleModule;
