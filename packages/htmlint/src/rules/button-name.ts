import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'button-name',

    desc: 'Attribute "name" of <button> is not recommended to be set.',

    lint(getConfig, document, reporter) {

        document.querySelectorAll('button[name]').forEach(button => {
            if (!getConfig(button)) {
                return;
            }

            reporter.warn(button.startIndex, '004', 'Attribute "name" of <button> is not recommended to be set.');
        });
    }

} as DocumentRule;
