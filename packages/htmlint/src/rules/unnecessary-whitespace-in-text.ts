import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',
    name: 'unnecessary-whitespace-in-text',

    desc: 'Unnecessary usage of white-space(s) in text',

    lint(getConfig, parser, reporter) {

        parser.handler.on('text', text => {
            if (!getConfig()) {
                return;
            }

            let pattern = /^.+([ \t]+)$/;
            let match = text.match(pattern);
            if (match) {
                reporter.warn(
                    parser.startIndex + match.length + 1,
                    '052',
                    'Unnecessary usage of a trailing white-space(s) in text'
                );

            }

            pattern = /\w([ \t]{2,})\w/;
            match = text.match(pattern);
            if (match) {
                reporter.warn(
                    parser.startIndex + match.length + 1,
                    '052',
                    'Unnecessary usage of a trailing white-space(s) in text'
                );

            }
        });
    }
} as ParserRule;
