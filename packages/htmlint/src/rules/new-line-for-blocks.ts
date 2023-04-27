import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',
    name: 'new-line-for-blocks',

    desc: 'There should be a new line for every block, list, or table element',

    lint(getConfig, parser, reporter) {

        const blockLevelElements = new Set(['address',
            'article',
            'aside',
            'blockquote',
            'br',
            'canvas',
            'dd',
            'div',
            'dl',
            'fieldset',
            'figcaption',
            'figure',
            'footer',
            'form',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'header',
            'hgroup',
            'hr',
            'li',
            'main',
            'nav',
            'noscript',
            'ol',
            'output',
            'p',
            'pre',
            'section',
            'table',
            'tfoot',
            'ul',
            'video']);

        const stack = [];

        parser.handler.on('opentag', name => {
            if (!getConfig()) {
                return;
            }

            if (blockLevelElements.has(name)) {

                let index = parser.startIndex - 1;

                let indentSize = 0;
                let newLineFound = false;
                for (;index >= 0 && !newLineFound; index--) {
                    // @ts-expect-error
                    const buffer = parser.tokenizer.buffer[index];
                    if (buffer !== ' ' && buffer !== '\t' && buffer !== '\r' && buffer !== '\n') {
                        break;
                    }
                    if (buffer === '\n') {
                        newLineFound = true;
                        break;
                    }
                    indentSize++;
                }

                if (!newLineFound) {
                    reporter.warn(
                        parser.startIndex,
                        '049',
                        `There should be a new line for <${ name }> (for every block, list, or table element)`
                    );
                }

                let parentTag = '';
                let parentIndentSize = 0;
                if (stack.length > 0) {
                    parentTag = stack[stack.length - 1].name;
                    parentIndentSize = stack[stack.length - 1].indentSize;
                }

                if (blockLevelElements.has(parentTag)
                    && indentSize <= parentIndentSize) {
                    reporter.warn(
                        parser.startIndex,
                        '049',
                        `Properly indent <${ name }> element when it is a child element of <${
                            parentTag }> (of every block, list, or table element)`
                    );
                }

                stack.push({ name, indentSize });
            }
        });

        parser.on('closetag', name => {
            if (!getConfig()) {
                return;
            }

            if (blockLevelElements.has(name)) {
                stack.pop();
            }
        });
    }

} as ParserRule;
