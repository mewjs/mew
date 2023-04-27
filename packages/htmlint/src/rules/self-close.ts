import type { ParserRule } from '../typings/types';
import { isVoidElement } from '../util';

export default {

    target: 'parser',

    name: 'self-close',

    desc: 'Should void tags close themselves with "/".',

    lint(getConfig, parser, reporter) {
        let current = {
            pos: -1,
            tag: ''
        };

        parser.on('opentagname', name => {
            current = {
                pos: parser.tokenizer.sectionStart - 1,
                tag: name.toLowerCase()
            };
        });

        // parser.on('selfclosingtag', () => {
        //     if (!current) {
        //         return;
        //     }

        //     const config = getConfig();
        //     if (config === 'no-close') {
        //         reporter.warn(
        //             current.pos,
        //             '039',
        //             'Void tags should not close themselves with "/".'
        //         );
        //     }
        // });

        parser.on('opentagend', () => {
            if (!current || !isVoidElement(current.tag)) {
                return;
            }

            const config = getConfig();
            // @ts-expect-error
            const selfClosed = parser.tokenizer.buffer[parser.endIndex - 1] === '/';

            if (selfClosed && config === 'no-close') {
                reporter.warn(
                    current.pos,
                    '039',
                    'Void tags should not close themselves with "/".'
                );
            }

            if (!selfClosed && config === 'close') {
                reporter.warn(
                    current.pos,
                    '040',
                    'Void tags should close themselves with "/".'
                );
            }
        });
    },

    format(getConfig, document, options) {
        options['self-close'] = { close: 'close' }[getConfig() as string] || 'no-close';
    }
} as ParserRule;
