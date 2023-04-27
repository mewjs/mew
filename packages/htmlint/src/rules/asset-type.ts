import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'asset-type',

    desc: 'Default value of attribute "type" (<link>/<style>/<script>) does not need to be set.',

    lint(getConfig, document, reporter) {
        document.querySelectorAll('link[type="text/css"], style[type="text/css"]').forEach(element => {
            if (!getConfig(element)) {
                return;
            }

            reporter.warn(
                element.startIndex,
                '001',
                'Default value of attribute "type" ("text/css") does not need to be set.'
            );
        });

        document.querySelectorAll('script[type="text/javascript"]').forEach(element => {
            if (!getConfig(element)) {
                return;
            }

            reporter.warn(
                element.startIndex,
                '002',
                'Default value of attribute "type" ("text/javascript") does not need to be set.'
            );
        });
    },

    format(getConfig, document, options) {
        document.querySelectorAll(
            'link[type="text/css"], style[type="text/css"], script[type="text/javascript"]'
        ).forEach(element => {
            if (!getConfig(element)) {
                return;
            }

            element.removeAttribute('type');
        });
    }

} as DocumentRule;
