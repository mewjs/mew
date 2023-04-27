import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',

    name: 'spec-char-escape',

    desc: 'Special characters must be escaped..',

    lint(getConfig, parser, reporter) {
        const specialChars = new Set(['<', '>']);

        // exclude-tags
        const excludeTags = new Set(['script', 'style']);

        parser.on('text', value => {
            if (!getConfig()) {
                return;
            }

            const currentTag = parser.stack[parser.stack.length - 1];

            // if should be excluded
            if (excludeTags.has(currentTag)) {
                return;
            }

            const startIndex = parser.tokenizer.sectionStart;

            // check for special chars
            for (let i = 0, l = value.length; i < l; i++) {
                if (specialChars.has(value[i])) {
                    reporter.warn(
                        startIndex + i,
                        '033',
                        'Special characters must be escaped.'
                    );
                }
            }
        });
    }

} as ParserRule;
