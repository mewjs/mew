import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'button-type',

    desc: 'Attribute "type" of <button> is recommended to be set.',

    lint(getConfig, document, reporter) {
        document.querySelectorAll('button:not([type]), button[type=""]').forEach(button => {
            if (!getConfig(button)) {
                return;
            }

            reporter.warn(button.startIndex, '005', 'Attribute "type" of <button> is recommended to be set.');
        });
    }

} as DocumentRule;
