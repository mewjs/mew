import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'charset',

    desc: '<meta charset> recommended.',

    lint(getConfig, document, reporter) {
        const head = document.querySelector('head');
        if (!head || !getConfig(head)) {
            return;
        }

        const charsetMeta = head.querySelector('meta[charset]');
        if (!charsetMeta) {
            reporter.warn(head.startIndex, '006', '<meta charset> recommended.');
        }
        else if (charsetMeta !== head.firstElementChild) {
            reporter.warn(charsetMeta.startIndex, '007', '<meta> charset should be the first element child of <head>.');
        }
    },

    format(getConfig, document, options) {
        const head = document.querySelector('head');
        if (!head || !getConfig(head)) {
            return;
        }

        let charsetMeta = document.querySelector('meta[charset]');

        if (!charsetMeta) {
            charsetMeta = document.createElement('meta');
            charsetMeta.setAttribute('charset', 'utf-8');
        }

        if (charsetMeta !== head.firstElementChild) {
            if (head.firstElementChild) {
                head.insertBefore(charsetMeta!, head.firstElementChild);
            }
            else {
                head.appendChild(charsetMeta!);
            }
        }
    }

} as DocumentRule;
