import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'rel-stylesheet',

    desc: 'Attribute "rel" of <link> should be set as "stylesheet".',

    lint(getConfig, document, reporter) {
        document.querySelectorAll('link').forEach(element => {
            if (!getConfig(element)) {
                return;
            }

            if (!element.getAttribute('rel')) {
                reporter.warn(element.startIndex, '022', 'Attribute "rel" of <link> should be set as "stylesheet".');
            }
        });

    },

    format(getConfig, document, options) {
        document.querySelectorAll('link').forEach(element => {
            if (!getConfig(element)) {
                return;
            }

            if (!element.getAttribute('rel')) {
                element.setAttribute('rel', 'stylesheet');
            }
        });
    }

} as DocumentRule;
