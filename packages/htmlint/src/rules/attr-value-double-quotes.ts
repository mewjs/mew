import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',
    name: 'attr-value-double-quotes',

    desc: 'Attribute value must be closed by double quotes.',

    lint(getConfig, parser, reporter) {
        parser.on('attribname', () => {
            if (!getConfig()) {
                return;
            }

            // @ts-expect-error
            const { buffer, _index: index } = parser.tokenizer;
            const quote = buffer[index + 1];

            // character after attribute name should be '='
            // ( get rid of boolean attribute )
            // and character starting attribute value should be '"'
            if (buffer[index] === '=' && quote !== '"') {
                reporter.warn(
                    index + 1,
                    '028',
                    'Attribute value must be closed by double quotes.'
                );
            }
        });
    }

} as ParserRule;
