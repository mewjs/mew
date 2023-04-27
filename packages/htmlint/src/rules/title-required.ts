import type { DocumentRule, Node } from '../typings/types';

export default {

    target: 'document',

    name: 'title-required',

    desc: '<title> required.',

    lint(getConfig, document, reporter) {
        const head = document.querySelector('head');
        if (!head || !getConfig(head)) {
            return;
        }

        const title = head.querySelector('title');
        const charsetMeta = head.querySelector('meta[charset]');

        if (!title) {
            reporter.warn(head.startIndex, '024', '<title> required.');
        }
        else if (!charsetMeta || title.previousElementSibling !== charsetMeta) {
            reporter.warn(title.startIndex, '025', '<title> should be just after <meta> charset.');
        }
    },

    format(getConfig, document, options) {
        const head = document.querySelector('head');
        if (!head || !getConfig(head)) {
            return;
        }

        let title = head.querySelector('title') as Node;
        const charsetMeta = head.querySelector('meta[charset]');

        if (!title) {
            title = document.createElement('title');
        }

        const firstChild = charsetMeta?.nextSibling || head.firstChild;
        if (firstChild) {
            head.insertBefore(title, firstChild);
        }
        else {
            head.appendChild(title);
        }
    }

} as DocumentRule;
