import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',
    name: 'no-space-before-tag-end',

    desc: 'There should be no whitespace before tag end',

    lint(getConfig, parser, reporter) {
        const whiteSpace = new Set([' ', '\t', '\r', '\n']);

        parser.handler.on('opentag', () => {
            if (!getConfig()) {
                return;
            }

            // @ts-expect-error
            const { _index: index, buffer } = parser.tokenizer;
            const char = buffer[index - 1];

            if (whiteSpace.has(char)) {
                reporter.warn(
                    index - 1,
                    '050',
                    'There should be no whitespace before tag end'
                );
            }
        });
    }

} as ParserRule;
