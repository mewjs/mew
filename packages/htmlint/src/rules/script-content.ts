import type { DocumentRule } from '../typings/types';
import { getPosition } from '../util';

export default {

    target: 'document',

    name: 'script-content',

    desc: 'Content of <script> must meet standard.',

    lint(getConfig, document, reporter, code = '') {
        document.querySelectorAll('script:not([type]), script[type="text/javascript"]').forEach(script => {
            if (!getConfig(script)) {
                return;
            }

            const linters = getConfig(script, 'linters');
            // @ts-expect-error
            const linter = linters?.script;
            if (typeof linter !== 'function') {
                return;
            }

            if (!script.childNodes.length) {
                return;
            }

            const textNode = script.childNodes[0];
            const indent = (
                code => code.slice(code.lastIndexOf('\n') + 1)
            )(
                code.slice(0, script.startIndex)
            );

            linter(
                // @ts-expect-error
                textNode.textContent,
                getPosition(code, textNode.startIndex),
                script,
                indent
            );
        });
    }

} as DocumentRule;
