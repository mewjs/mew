import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',

    name: 'id-class-ad-disabled',

    desc: 'Id and class can not use ad-relative keyword, it will be blocked by adblock software.',

    lint(getConfig, parser, reporter) {
        const config = getConfig();
        if (!config) {
            return;
        }

        const keywords = Array.isArray(config) ? config : ['ad'];
        const AD_PATTERN = new RegExp(`(?:${ keywords.join('|') })`, 'g');


        parser.on('attribdata', value => {
            const name = parser.attribname;

            if (name === 'id' || name === 'class') {
                const pos = parser.tokenizer.sectionStart;

                let match = AD_PATTERN.exec(value);
                while (match) {
                    reporter.warn(
                        pos + match.index,
                        '031',
                        `Id and class can't use ad-relative keyword(${ match[0] }), \
                        it'll be blocked by adblock software.`
                    );

                    match = AD_PATTERN.exec(value);
                }
            }
        });
    }

} as ParserRule;
