import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'img-src',

    desc: 'Attribute "src" of <img> should not be empty.',

    lint(getConfig, document, reporter) {
        document.querySelectorAll('img[src=""]').forEach(img => {
            if (!getConfig(img)) {
                return;
            }

            reporter.warn(img.startIndex, '013', 'Attribute "src" of <img> should not be empty.');
        });
    }

} as DocumentRule;
