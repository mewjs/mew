import type { DocumentRule } from '../typings/types';

export default {

    target: 'document',

    name: 'label-for-input',

    desc: 'Most <input> should be associate with <label>.',

    lint(getConfig, document, reporter) {

        document.querySelectorAll('input').forEach(input => {
            if (!getConfig(input)
                || /^(?:reset|submit|button|image)$/i.test(input.getAttribute('type')!)
                || input.matches('label input')
            ) {
                return;
            }

            const id = input.getAttribute('id');
            const label = id && document.querySelector(`label[for=${ id }]`);

            if (!label) {
                reporter.warn(input.startIndex, '044', '<input> should be associate with <label>.');
            }

        });
    }

} as DocumentRule;
