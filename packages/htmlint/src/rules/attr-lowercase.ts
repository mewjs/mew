import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',

    name: 'attr-lowercase',

    desc: 'Attribute name must be lowercase.',

    lint(getConfig, parser, reporter) {
        parser.on('attribname', (name: string) => {
            if (!getConfig()) {
                return;
            }

            if (name !== name.toLowerCase()) {
                reporter.warn(
                    parser.startIndex,
                    '029',
                    'Attribute name must be lowercase.'
                );
            }
        });
    }

} as ParserRule;
