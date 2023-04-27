import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',
    name: 'attr-no-duplication',

    desc: 'Attribute name can not been duplication.',

    lint(getConfig, parser, reporter) {
        const attributes = new Set();

        // clear attributes on opening new tag
        parser.on('opentagname', () => {
            attributes.clear();
        });

        // check on new attribute name
        parser.on('attribname', name => {
            if (!getConfig()) {
                return;
            }

            name = name.toLowerCase();

            if (attributes.has(name)) {
                reporter.warn(
                    parser.startIndex,
                    '030',
                    'Attribute name can not been duplication.'
                );
            }
            else {
                attributes.add(name);
            }
        });
    }

} as ParserRule;
