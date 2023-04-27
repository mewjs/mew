import type { Parser } from '@mewjs/htmlparser2';
import type { ParserRule } from '../typings/types';

interface Item {
    type: string;
    from: number;
    to: number;
}

interface Items extends Array<Item> {
    index: number;
}

export default {

    target: 'parser',

    name: 'max-len',

    desc: 'Each length of line should be less then the value specified.',

    lint(getConfig, parser, reporter, code) {

        const max = (getConfig() as number) | 0;
        if (!max) {
            return;
        }

        const map = {} as Record<number, Items>;
        code.split(/\n/).reduce((pos, line) => {
            pos.line++;

            const len = line.length;
            if (len > max) {
                const item = [] as Items;
                item.index = pos.index;
                map[pos.line] = item;
            }

            pos.index += len + 1;

            return pos;
        }, { index: 0, line: 0 });

        let line = 1;

        function push(type: string, context: Parser) {
            const item = map[line];
            if (!item) {
                return;
            }

            const from = context.startIndex;
            const to = context.endIndex;
            const index = item.index + max;

            if (index <= from || index > from && index <= to) {
                const last = item[item.length - 1];
                if (!last || last.from !== from) {
                    item.push({ type, from, to });
                }
            }
        }

        parser.handler.on('comment', comment => {
            push('#comment', parser);
            line += (comment.match(/\n/g) || '').length;
        });

        parser.handler.on('opentag', name => {
            push(name, parser);
        });

        parser.handler.on('closetag', name => {
            push(name, parser);
        });

        parser.handler.on('text', text => {
            line += (text.match(/\n/g) || '').length;
        });

        parser.handler.on('end', () => {
            Object.keys(map).forEach(line => {
                map[line].forEach(node => {
                    reporter.warn(
                        node.from,
                        '048',
                        `Node \`${ node.type }\` exceeds the maximum line length of ${ max }.`
                    );
                });
            });
        });

    }

} as ParserRule;
