import type { ParserRule } from '../typings/types';

interface Config {
    keys: string | string[];
}

export default {

    target: 'parser',

    name: 'no-hook-class',

    desc: 'Classes should be not hooked for script.',

    lint(getConfig, parser, reporter) {

        let config = getConfig() as unknown as Config;

        if (!config) {
            return;
        }

        const regTest = /^\/.*\/$/;
        let keys = build(config.keys);

        function build(keys: string | string[]) {
            return (Array.isArray(keys) ? keys : [keys])
                .map(key => (regTest.test(key) ? new RegExp(key.slice(1, -1)) : key));
        }

        function isHook(name: string) {
            return keys.some(key => key === name || name.match(key));
        }

        function report(name: string, pos: number) {
            reporter.warn(pos, '047', `Class name(${ name }) should be not hooked for script.`);
        }

        parser.on('attribdata', value => {
            const name = parser.attribname.toLowerCase();
            if (name.toLowerCase() !== 'class') {
                return;
            }

            const newConfig = getConfig() as unknown as Config;
            if (!newConfig) {
                return;
            }

            if (newConfig.keys !== config.keys) {
                config = newConfig;
                keys = build(newConfig.keys);
            }

            const pos = parser.tokenizer.sectionStart;
            value.split(/\s+/).forEach(name => {
                if (isHook(name)) {
                    report(name, pos);
                }
            });

        });
    }

} as ParserRule;
