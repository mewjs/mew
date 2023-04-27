import type { ParserRule } from '../typings/types';
import { isVoidElement } from '../util';

interface Tag {
    name: string;
    pos: number;
}

export default {

    target: 'parser',

    name: 'tag-pair',

    desc: 'Tag must be paired.',

    lint(getConfig, parser, reporter) {
        // stack of unclosed tags
        let stack = [] as Tag[];

        // check & report
        const check = function (tag: Tag) {
            if (!isVoidElement(tag.name)) {
                reporter.warn(
                    tag.pos,
                    '035',
                    `Tag ${ tag.name } is not paired.`
                );
            }
        };

        // record unclosed tags
        parser.handler.on('opentag', name => {
            stack.push({
                name: name.toLowerCase(),
                pos: parser.startIndex
            });
        });

        // do close & check unclosed tags
        parser.on('closetag', name => {
            if (!getConfig()) {
                return;
            }

            name = name.toLowerCase();

            // find the matching tag
            const l = stack.length;
            let i = l - 1;
            for (; i >= 0; i--) {
                if (stack[i].name === name) {
                    break;
                }
            }

            // if the matching tag found,
            // all tags after the matching tag are unpaired
            if (i >= 0) {
                for (let j = i + 1; j < l; j++) {
                    check(stack[j]);
                }
                stack = stack.slice(0, i);
            }

        });

        // check left tags
        parser.handler.on('end', () => {
            if (!getConfig()) {
                return;
            }

            // all unclosed tags in the end are unpaired
            stack.forEach(check);
        });
    }

} as ParserRule;
