import type HTMLNode from '@mewjs/dom/lib';
import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',
    name: 'doctype',

    desc: 'DOCTYPE needed.',

    lint(getConfig, parser, reporter) {

        if (!getConfig()) {
            return;
        }

        let doctype = '';
        let html = '';
        let hasHTMLTag = false;
        const ruleName = this.name;

        parser.handler.on('processinginstruction', (name, value) => {
            if (name === '!doctype') {

                const index = parser.startIndex;
                let invalid: string;

                [doctype, html = '', invalid] = value.split(/\s/);
                doctype = doctype.trim();
                html = html.trim().toLowerCase();

                if (getConfig('doctype') === 'upper' && doctype !== '!DOCTYPE') {
                    reporter.warn(index, '041', 'DOCTYPE must be uppercase.');
                }

                if (invalid || html !== 'html') {
                    reporter.warn(index, '041', 'DOCTYPE must be html5.');
                }
            }
        });

        parser.on('opentagname', function checkHTMLTag(name) {
            if (name.toLowerCase() === 'html') {
                hasHTMLTag = true;
                parser.off('opentagname', checkHTMLTag);
            }
        });

        parser.on('end', () => {
            const inlineConfig = reporter.getConfigByRule(ruleName);
            if (inlineConfig?.some(({ content }) => String(content).startsWith('disable'))) {
                return;
            }

            if (!doctype && hasHTMLTag) {
                reporter.warn(0, '009', 'DOCTYPE needed.');
            }
        });
    },

    format(getConfig, document, options) {
        const doctype = document.doctype as HTMLNode;
        const html = document.querySelector('html');

        if (!html || !getConfig(html) || doctype && doctype.name === 'html') {
            return;
        }

        if (doctype) {
            (doctype as HTMLNode).name = 'html';
        }
        else {
            const doctype = document.implementation.createDocumentType('html', '', '');
            document.insertBefore(doctype, document.firstElementChild);
            document.doctype = doctype;
        }
    }

} as ParserRule;
