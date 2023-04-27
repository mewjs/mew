import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'html-lang',

    desc: 'Attribute "lang" of <html> recommended to be set.',

    lint(getConfig, document, reporter) {
        const html = document.querySelector('html');

        if (!html || !getConfig(html)) {
            return;
        }

        if (!html.getAttribute('lang')) {
            reporter.warn(html.startIndex, '010', 'Attribute "lang" of <html> recommended to be set.');
        }

    },

    format(getConfig, document, options) {
        const html = document.querySelector('html');

        if (!html || !getConfig(html) || html.getAttribute('lang')) {
            return;
        }

        // TODO: configurable
        html.setAttribute('lang', 'zh-CN');
    }

} as DocumentRule;
