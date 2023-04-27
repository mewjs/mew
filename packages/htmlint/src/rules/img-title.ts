import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'img-title',

    desc: 'Attribute "title" of <img> is not recommended to be set.',

    lint(getConfig, document, reporter) {
        document.querySelectorAll('img[title]').forEach(img => {
            if (!getConfig(img)) {
                return;
            }

            reporter.warn(img.startIndex, '014', 'Attribute "title" of <img> is not recommended to be set.');
        });

    }

} as DocumentRule;
