import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'lowercase-class-with-hyphen',

    desc: 'ClassName should be lowercase words connected with hyphens.',

    lint(getConfig, document, reporter) {
        document.querySelectorAll('[class]').forEach(element => {
            if (!getConfig(element)) {
                return;
            }

            if (element.className.toLowerCase() !== element.className) {
                reporter.warn(element.startIndex, '018', 'ClassName should be lowercase words.');
            }
            if (element.className.includes('_')) {
                reporter.warn(element.startIndex, '019', 'ClassName parts should be connected with "-" insteadof "_".');
            }
        });
    }

} as DocumentRule;
