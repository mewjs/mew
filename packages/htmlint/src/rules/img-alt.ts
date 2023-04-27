import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'img-alt',

    desc: 'Attribute "alt" of <img> is recommended to be set.',

    lint(getConfig, document, reporter) {
        document.querySelectorAll('img:not([alt]), img[alt=""]').forEach(img => {
            if (!getConfig(img)) {
                return;
            }

            reporter.warn(img.startIndex, '012', 'Attribute "alt" of <img> is recommended to be set.');
        });
    }

} as DocumentRule;
