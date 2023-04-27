import type { ParserRule } from '../typings/types';

export default {

    target: 'parser',
    name: 'no-bom',

    desc: 'HTML file should save with UTF-8 encoding without BOM.',

    lint(getConfig, parser, reporter, code = '') {

        if (!getConfig()) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (code.charCodeAt(0) === 0xFEFF) {
            reporter.warn(0, '046', 'Unexpected Unicode BOM (Byte Order Mark).');
        }
    }

} as ParserRule;
