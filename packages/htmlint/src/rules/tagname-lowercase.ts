import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',
    name: 'tagname-lowercase',

    desc: 'Tagname must be lowercase.',

    lint(getConfig, parser, reporter) {

        // check & report
        const check = function (name: string) {
            if (name === name.toLowerCase() || !getConfig()) {
                return;
            }

            reporter.warn(
                parser.tokenizer.sectionStart,
                '036',
                'Tag name must be lowercase.'
            );
        };

        parser.on('opentagname', check);
        parser.on('closetag', check);
    }

} as ParserRule;
