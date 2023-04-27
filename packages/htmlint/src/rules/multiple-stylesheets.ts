import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',
    name: 'multiple-stylesheets',

    desc: 'More than one style-sheet is included (combining all style-sheets into one neat CSS file would be cleaner)',

    lint(getConfig, parser, reporter) {

        let stylesheetCount = 0;

        parser.handler.on('opentag', (name, attrs) => {
            if (!getConfig()) {
                return;
            }

            if (name === 'link' && attrs.rel === 'stylesheet') {
                if (stylesheetCount === 1) {
                    reporter.warn(
                        parser.startIndex,
                        '028',
                        'More than one style-sheet is included (combining '
                        + 'all style-sheets into one neat CSS file would be cleaner)'
                    );
                }

                stylesheetCount++;
            }
        });
    }
} as ParserRule;
