import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'script-in-tail',

    desc: 'All javascript contents are recommended to be imported in the tail of <body>.',

    lint(getConfig, document, reporter) {
        const html = document.querySelector('html');
        const body = document.querySelector('body');

        if (!(html || body)) {
            return;
        }

        const isInTail = function (element) {
            const { tagName } = element;

            // should: no parent, or parent is <html>, or parent is <body>
            if (
                !document.children.includes(element)
                && (!html || !html.children.includes(element))
                && (!body || !body.children.includes(element))
            ) {
                return false;
            }

            // should: no followed elements unless with the same tag
            while ((element = element.nextElementSibling)) {
                if (element.tagName !== tagName) {
                    return false;
                }
            }

            return true;
        };

        document.querySelectorAll('script:not([type]), script[type="text/javascript"]').forEach(script => {
            if (!getConfig(script)) {
                return;
            }

            if (!isInTail(script)) {
                reporter.warn(
                    script.startIndex,
                    '023',
                    'JavaScript contents are recommended to be imported in the tail of <body>.'
                );
            }
        });
    }

} as DocumentRule;
