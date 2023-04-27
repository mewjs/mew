interface CommentParserConfig {
    exceptions?: string[];
}
type HTMLCommentVisitor = (comment: ParsedHTMLComment) => void;
interface CommentVisitorOption {
    includeDirectives?: boolean;
}

enum HTMLCommentType {
    COMMENT = 'HTMLComment',
    OPEN = 'HTMLCommentOpen',
    OPEN_DECORATION = 'HTMLCommentOpenDecoration',
    VALUE = 'HTMLCommentValue',
    CLOSE = 'HTMLCommentClose',
    CLOSE_DECORATION = 'HTMLCommentCloseDecoration',
}

type HTMLComment = Token & {
    type: HTMLCommentType.COMMENT;
    value: string;
};
type HTMLCommentOpen = Token & {
    type: HTMLCommentType.OPEN;
};
type HTMLCommentOpenDecoration = Token & {
    type: HTMLCommentType.OPEN_DECORATION;
};
type HTMLCommentValue = Token & {
    type: HTMLCommentType.VALUE;
};
type HTMLCommentClose = Token & {
    type: HTMLCommentType.CLOSE;
};
type HTMLCommentCloseDecoration = Token & {
    type: HTMLCommentType.CLOSE_DECORATION;
};

export interface ParsedHTMLComment {
    open: HTMLCommentOpen;
    openDecoration: HTMLCommentOpenDecoration | null;
    value: HTMLCommentValue | null;
    closeDecoration: HTMLCommentCloseDecoration | null;
    close: HTMLCommentClose;
}

const COMMENT_DIRECTIVE = /^\s*eslint-(?:en|dis)able/;

const COMMENT_OPEN_TAG_LEN = 4;
const COMMENT_CLOSE_TAG_LEN = 3;

// const TYPE_HTML_COMMENT_OPEN = 'HTMLCommentOpen';

// const TYPE_HTML_COMMENT_OPEN_DECORATION = 'HTMLCommentOpenDecoration';

// const TYPE_HTML_COMMENT_VALUE = 'HTMLCommentValue';

// const TYPE_HTML_COMMENT_CLOSE = 'HTMLCommentClose';

// const TYPE_HTML_COMMENT_CLOSE_DECORATION = 'HTMLCommentCloseDecoration';

/**
 * @param {HTMLComment} comment
 * @returns {boolean}
 */
function isCommentDirective(comment: HTMLComment): boolean {
    return COMMENT_DIRECTIVE.test(comment.value);
}

type Parser = (node: Token) => ParsedHTMLComment | null;

/**
 * Define HTML comment parser
 *
 * @param {SourceCode} sourceCode The source code instance.
 * @param {CommentParserConfig | null} config The config.
 * @returns { (node: Token) => (ParsedHTMLComment | null) } HTML comment parser.
 */
function defineParser(sourceCode: SourceCode, config: CommentParserConfig | null): Parser {
    config = config || {};

    const exceptions = config.exceptions || [];

    /**
     * Get a open decoration string from comment contents.
     * @param {string} contents comment contents
     * @returns {string} decoration string
     */
    function getOpenDecoration(contents: string): string {
        let decoration = '';
        for (const exception of exceptions) {
            const { length } = exception;

            let index = 0;
            while (contents.startsWith(exception, index)) {
                index += length;
            }

            const exceptionLength = index;
            if (decoration.length < exceptionLength) {
                decoration = contents.slice(0, exceptionLength);
            }
        }
        return decoration;
    }

    /**
     * Get a close decoration string from comment contents.
     * @param {string} contents comment contents
     * @returns {string} decoration string
     */
    function getCloseDecoration(contents: string): string {
        let decoration = '';
        for (const exception of exceptions) {
            const { length } = exception;

            let index = contents.length;
            while (contents.endsWith(exception, index)) {
                index -= length;
            }

            const exceptionLength = contents.length - index;
            if (decoration.length < exceptionLength) {
                decoration = contents.slice(index);
            }
        }
        return decoration;
    }

    /**
   * Parse HTMLComment.
   * @param {Token} node a comment token
   * @returns {HTMLComment | null} the result of HTMLComment tokens.
   */
    return function parseHTMLComment(node: Token): ParsedHTMLComment | null {
        if (node.type !== HTMLCommentType.COMMENT) {
            // Is not HTMLComment
            return null;
        }

        // @ts-expect-error
        const htmlCommentText = sourceCode.getText(node);

        if (!htmlCommentText.startsWith('<!--') || !htmlCommentText.endsWith('-->')) {
            // Is not normal HTML Comment
            // e.g. Error Code: "abrupt-closing-of-empty-comment", "incorrectly-closed-comment"
            return null;
        }

        let valueText = htmlCommentText.slice(COMMENT_OPEN_TAG_LEN, -COMMENT_CLOSE_TAG_LEN);
        const openDecorationText = getOpenDecoration(valueText);
        valueText = valueText.slice(openDecorationText.length);
        const firstCharIndex = valueText.search(/\S/);
        const beforeSpace = firstCharIndex >= 0 ? valueText.slice(0, firstCharIndex) : valueText;
        valueText = valueText.slice(beforeSpace.length);

        const closeDecorationText = getCloseDecoration(valueText);
        if (closeDecorationText) {
            valueText = valueText.slice(0, -closeDecorationText.length);
        }

        const lastCharIndex = valueText.search(/\S\s*$/);
        const afterSpace = lastCharIndex >= 0 ? valueText.slice(lastCharIndex + 1) : valueText;
        if (afterSpace) {
            valueText = valueText.slice(0, -afterSpace.length);
        }

        let tokenIndex = node.range[0];

        type HTMLCommentTypes = HTMLCommentOpen
        | HTMLCommentOpenDecoration
        | HTMLCommentValue
        | HTMLCommentCloseDecoration
        | HTMLCommentClose
        | null;

        /**
       * @param {string} type
       * @param {string} value
       * @returns {HTMLCommentTypes}
       */
        const createToken = (type: HTMLCommentType, value: string): HTMLCommentTypes => {

            const range: Range = [tokenIndex, tokenIndex + value.length];
            tokenIndex = range[1];

            let loc: SourceLocation;

            return {
                type,
                value,
                range,
                get loc() {
                    if (loc) {
                        return loc;
                    }

                    return (loc = {
                        start: sourceCode.getLocFromIndex(range[0]),
                        end: sourceCode.getLocFromIndex(range[1])
                    });
                }
            } as HTMLCommentTypes;
        };

        const open = createToken(HTMLCommentType.OPEN, '<!--') as HTMLCommentOpen;

        const openDecoration = openDecorationText
            ? createToken(HTMLCommentType.OPEN_DECORATION, openDecorationText) as HTMLCommentOpenDecoration
            : null;
        tokenIndex += beforeSpace.length;

        const value = valueText
            ? createToken(HTMLCommentType.VALUE, valueText) as HTMLCommentValue
            : null;
        tokenIndex += afterSpace.length;

        const closeDecoration = closeDecorationText
            ? createToken(HTMLCommentType.CLOSE_DECORATION, closeDecorationText) as HTMLCommentCloseDecoration
            : null;

        const close = createToken(HTMLCommentType.CLOSE, '-->') as HTMLCommentClose;

        return {

            /** HTML comment open (`<!--`) */
            open,

            /** decoration of the start of HTML comments. (`*****` when `<!--*****`) */
            openDecoration,

            /** value of HTML comment. white spaces and other tokens are not included. */
            value,

            /** decoration of the end of HTML comments.  (`*****` when `*****-->`) */
            closeDecoration,

            /** HTML comment close (`-->`) */
            close
        };
    };
}

/**
 * Define HTML comment visitor
 *
 * @param {RuleContext} context The rule context.
 * @param {CommentParserConfig | null} config The config.
 * @param {HTMLCommentVisitor} visitHTMLComment The HTML comment visitor.
 * @param {CommentVisitorOption} [visitorOption] The option for visitor.
 * @returns {RuleListener} HTML comment visitor.
 */
function defineVisitor(
    context: RuleContext,
    config: CommentParserConfig | null,
    visitHTMLComment: HTMLCommentVisitor,
    visitorOption: CommentVisitorOption = {}
): RuleListener {
    const parse = defineParser(context.getSourceCode(), config);
    const tokenStore = context.parserServices.getTemplateBodyTokenStore();
    /* eslint-disable no-underscore-dangle */
    // @ts-expect-error
    const comments = tokenStore?._comments;
    if (!tokenStore || !comments) {
        return {};
    }
    /* eslint-enable no-underscore-dangle */

    for (const comment of comments) {
        if (comment.type !== 'HTMLComment') {
            continue;
        }

        if (!visitorOption.includeDirectives && isCommentDirective(comment)) {
            // ignore directives
            continue;
        }

        const tokens = parse(comment);
        if (tokens) {
            visitHTMLComment(tokens);
        }
    }

    return {};
}

export default {
    defineVisitor
};
