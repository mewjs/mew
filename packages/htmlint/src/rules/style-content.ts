import type { DocumentRule } from '../typings/types';
import { getPosition } from '../util';

export default {

    target: 'document',

    name: 'style-content',

    desc: 'Content of <style> must meet standard.',

    lint(getConfig, document, reporter, code = '') {
        document.getElementsByTagName('style').forEach(style => {
            if (!getConfig(style)) {
                return;
            }

            const linters = getConfig(style, 'linters');
            // @ts-expect-error
            const linter = linters?.style;
            if (typeof linter !== 'function') {
                return;
            }

            if (!style.childNodes.length) {
                return;
            }

            const textNode = style.childNodes[0];
            const indent = (
                code => code.slice(code.lastIndexOf('\n') + 1)
            )(
                code.slice(0, style.startIndex)
            );

            linter(
                // @ts-expect-error
                textNode.textContent,
                getPosition(code, textNode.startIndex),
                style,
                indent
            );
        });
    }

} as DocumentRule;
