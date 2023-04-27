import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'img-width-height',

    desc: 'Attribute "width" & "height" of <img> is recommended to be set.',

    lint(getConfig, document, reporter) {
        document.querySelectorAll('img').forEach(img => {
            if (!getConfig(img)) {
                return;
            }

            const width = img.getAttribute('width');
            const height = img.getAttribute('height');

            if (!width && !height) {
                reporter.warn(img.startIndex, '015', 'Attribute "width" & "height" of <img> is recommended to be set.');
            }
            else if (!width) {
                reporter.warn(img.startIndex, '016', 'Attribute "width" of <img> is recommended to be set.');
            }
            else if (!height) {
                reporter.warn(img.startIndex, '017', 'Attribute "height" of <img> is recommended to be set.');
            }
        });

    }

} as DocumentRule;
