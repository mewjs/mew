import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'lowercase-id-with-hyphen',

    desc: 'Id should be lowercase words connected with hyphens.',

    lint(getConfig, document, reporter) {
        document.querySelectorAll('[id]').forEach(element => {
            if (!getConfig(element)) {
                return;
            }

            if (element.id.toLowerCase() !== element.id) {
                reporter.warn(element.startIndex, '020', 'Id should be lowercase words.');
            }
            if (element.id.includes('_')) {
                reporter.warn(element.startIndex, '021', 'Id parts should be connected with "-" insteadof "_".');
            }
        });
    }

} as DocumentRule;
