import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'ie-edge',

    desc: '<meta http-equiv="X-UA-Compatible" content="IE=Edge"> recommended.',

    lint(getConfig, document, reporter) {
        const head = document.querySelector('head');
        if (!head || !getConfig(head)) {
            return;
        }

        let hasEdgeMeta = false;
        head.querySelectorAll('meta').forEach(meta => {
            if (
                (meta.getAttribute('http-equiv') || '').toLowerCase() === 'x-ua-compatible'
                && (meta.getAttribute('content') || '').toLowerCase() === 'ie=edge'
            ) {
                hasEdgeMeta = true;
            }
        });

        if (!hasEdgeMeta) {
            reporter.warn(head.startIndex, '011', '<meta http-equiv="X-UA-Compatible" content="IE=Edge"> recommended.');
        }
    },

    format(getConfig, document, options) {
        const head = document.querySelector('head');
        if (!head || !getConfig(head)) {
            return;
        }

        const edgeMeta = head.querySelector('meta[http-equiv="X-UA-Compatible"]');

        if (edgeMeta) {
            edgeMeta.setAttribute('content', 'IE=Edge');
        }
        else {
            const edgeMeta = document.createElement('meta');
            edgeMeta.setAttribute('http-equiv', 'X-UA-Compatible');
            edgeMeta.setAttribute('content', 'IE=Edge');

            const title = head.querySelector('title');
            if (title?.nextSibling) {
                head.insertBefore(edgeMeta, title.nextSibling);
            }
            else {
                head.appendChild(edgeMeta);
            }
        }
    }

} as DocumentRule;
