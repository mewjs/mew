import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'style-disabled',

    desc: 'Style tag can not be used.',

    lint(getConfig, document, reporter) {
        document.getElementsByTagName('style').forEach(element => {
            if (!getConfig(element)) {
                return;
            }

            reporter.warn(
                element.startIndex,
                '034',
                'Style tag can not be used.'
            );
        });
    }

} as DocumentRule;
