import type { DocumentRule } from '../typings/types';

const booleanAttributes = [
    'allowfullscreen',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'itemscope',
    'loop',
    'multiple',
    'muted',
    'novalidate',
    'open',
    'readonly',
    'required',
    'reversed',
    'scoped',
    'seamless',
    'selected',
    'sortable',
    'typemustmatch'
];

const booleanAttributeSelectors = booleanAttributes.map(name => `[${ name }]`).join(',');

export default {

    target: 'document',

    name: 'bool-attribute-value',

    desc: 'Value of boolean attributes should not be set.',

    lint(getConfig, document, reporter) {
        document.querySelectorAll(booleanAttributeSelectors).forEach(element => {
            if (!getConfig(element)) {
                return;
            }

            booleanAttributes.forEach(attribute => {
                if (element.getAttribute(attribute)) {
                    reporter.warn(
                        element.startIndex,
                        '003',
                        `Value of boolean attribute "${ attribute }" should not be set.`
                    );
                }
            });
        });
    },

    format(getConfig, document, options) {
        options['bool-attribute-value'] = getConfig() ? 'remove' : 'preserve';
    }

} as DocumentRule;
