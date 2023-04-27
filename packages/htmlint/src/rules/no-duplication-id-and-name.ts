import type { ParserRule } from '../typings/types';

interface Item {
    pos: number;
    value: string;
}

interface Element {
    id?: Item;
    name?: Item;
}

export default {

    target: 'parser',

    name: 'no-duplication-id-and-name',

    desc: 'Element\'s id and name should be unique in page.',

    lint(getConfig, parser, reporter) {

        if (!getConfig()) {
            return;
        }

        const stack: Element[] = [];
        parser.on('opentagname', () => {
            stack.push({});
        });

        parser.on('attribdata', value => {
            const name = parser.attribname.toLowerCase();

            if (name !== 'id' && name !== 'name') {
                return;
            }

            const tag = stack[stack.length - 1];
            tag[name] = {
                value,
                pos: parser.tokenizer.sectionStart
            };
        });

        const idMap = {} as { [key: string]: Item[] };
        const nameMap = {} as { [key: string]: Item };
        parser.on('opentagend', () => {
            const {
                id,
                name
            } = stack.pop();

            const idValue = id?.value;
            const nameValue = name?.value;

            if (name && !nameMap[nameValue]) {
                nameMap[nameValue] = name;
            }

            if (id && idValue !== nameValue) {
                idMap[idValue] = idMap[idValue] || [];
                idMap[idValue].push(id);
            }
        });

        function getMessage(value: string) {
            return `Expected id and name to be unique in page but found duplication(${ value }).`;
        }

        parser.on('end', () => {
            stack.length = 0;

            Object.keys(nameMap).forEach(key => {
                if (!idMap[key]) {
                    return;
                }

                const { pos, value } = nameMap[key];

                reporter.warn(pos, '043', getMessage(value));

                idMap[key].forEach(({ pos, value }) => {
                    reporter.warn(pos, '043', getMessage(value));
                });
            });
        });
    }

} as ParserRule;
