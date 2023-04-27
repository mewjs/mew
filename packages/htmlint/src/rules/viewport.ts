import type { HTMLElement } from '@mewjs/dom/lib';
import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'viewport',

    desc: '<meta name="viewport" content="..."> recommended.',

    lint(getConfig, document, reporter) {
        const head = document.querySelector('head');
        if (!head || !getConfig(head)) {
            return;
        }

        const viewportMeta = head.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            reporter.warn(head.startIndex, '027', '<meta name="viewport" content="..."> recommended.');
        }
    },

    format(getConfig, document, options) {
        const head = document.querySelector('head');
        if (!head || !getConfig(head)) {
            return;
        }

        let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLElement;

        if (viewportMeta && viewportMeta.parentNode === head) {
            return;
        }

        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.setAttribute('name', 'viewport');
            viewportMeta.setAttribute('content', 'width=device-width,minimum-scale=1.0,maximum-scale=1.0');
        }

        head.appendChild(viewportMeta);
    }

} as DocumentRule;
