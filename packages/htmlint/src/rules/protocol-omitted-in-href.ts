import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',
    name: 'protocol-omitted-in-href',

    desc: 'Protocol (http:// or https://) should be omitted from href attribute (there should be "//" instead)',

    lint(getConfig, parser, reporter) {
        parser.handler.on('opentag', (name, attrs) => {
            if (!getConfig()) {
                return;
            }

            if (name !== 'link' && name !== 'script') {
                return;
            }

            if (attrs.rel && attrs.rel === 'canonical') {
                return;
            }

            if (attrs.href && /^https?:\/\//i.test(attrs.href)) {
                reporter.warn(
                    parser.startIndex,
                    '051',
                    'Protocol (http:// or https://) should be omitted from href attribute (there should be "//" instead)'
                );
            }
        });
    }

} as ParserRule;
