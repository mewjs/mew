import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'css-in-head',

    desc: 'All css contents are recommended to be imported in <head>.',

    lint(getConfig, document, reporter) {
        const head = document.querySelector('head');

        document.querySelectorAll('link[rel="stylesheet"], style').forEach(css => {
            if (!getConfig(css)) {
                return;
            }

            if (!(head?.contains(css))) {
                reporter.warn(css.startIndex, '008', 'CSS contents are recommended to be imported in <head>.');
            }
        });
    },

    format(getConfig, document, options) {
        if (!getConfig()) {
            return;
        }

        const head = document.querySelector('head');
        head && document.querySelectorAll('link[rel="stylesheet"], style').forEach(css => {
            if (!getConfig(css) || head?.contains(css)) {
                return;
            }

            head.appendChild(css);
        });
    }

} as DocumentRule;
