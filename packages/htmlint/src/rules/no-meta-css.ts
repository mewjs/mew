import type { ParserRule } from '../typings/types';

interface Config {
    minlen: number;
    threshold: number;
    whitelist: string | string[];
}

interface Item {
    pos: number;
}

interface MarkedItems {
    value: number;
    items: Item[];
}

interface MapItem {
    [key: string]: MarkedItems;
}


export default {

    target: 'parser',

    name: 'no-meta-css',

    desc: 'Classes should be semantic.',

    lint(getConfig, parser, reporter) {

        const config = getConfig() as unknown as Config;

        if (!config) {
            return;
        }

        const MIX_VALUE_PATTERN = /[\d#>:%]+/g;
        const SPECIAL_PATTERN = /\(.+\)/g;
        const COMMA_PATTERN = /\s*,\s*/;

        const COLOR = new Set(
            'red,green,blue,white,black,yellow,gray,silver,brown,sienna,orange,gold,ivory,indigo,purple,pink'
                .split(COMMA_PATTERN)
        );

        const PROPERTY = new Set(
            'left,right,center,middle,top,bottom,bold,width,height,size,margin,padding,clear,float'
                .split(COMMA_PATTERN)
        );

        const minLength = (config.minlen | 0) || 3;
        const threshold = (config.threshold | 0) || 3;
        const { whitelist } = config;

        const map: MapItem = {};
        const keys = new Set<string>();
        const ignoredKeys = new Set(
            Array.isArray(whitelist) ? whitelist : [whitelist]
        );

        function mark(name: string, pos: number) {
            if (ignoredKeys.has(name)) {
                return;
            }

            const current: MarkedItems = map[name] = map[name] || { value: .9, items: [] };

            let value = .1;
            const item: Item = { pos };

            if (current.value < 1) {
                if (COLOR.has(name) || PROPERTY.has(name)) {
                    value += 1;
                }

                let match = name.match(MIX_VALUE_PATTERN);
                if (match) {
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    value += match.length * 1.5;
                }

                match = name.match(SPECIAL_PATTERN);
                if (match) {
                    value += match.length * 2;
                }

                const { length } = name;
                if (length <= minLength) {
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    value += 1 + (minLength - length) * .5;
                }
            }

            current.value += value;
            current.items.push(item);

            if (!keys.has(name) && current.value > threshold) {
                keys.add(name);
            }
        }

        function report(name: string, item: Item) {
            reporter.warn(item.pos, '045', `Class name (${ name }) should be semantic.`);
        }

        parser.on('attribdata', value => {
            const name = parser.attribname.toLowerCase();
            if (name.toLowerCase() !== 'class') {
                return;
            }

            const pos = parser.tokenizer.sectionStart;
            value.split(/\s+/).forEach(name => {
                mark(name, pos);
            });

        });

        parser.on('end', () => {
            keys.forEach(key => {
                map[key].items.forEach(item => {
                    report(key, item);
                });
            });
        });
    }

} as ParserRule;
