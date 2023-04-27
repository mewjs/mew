import type HTMLNode from '@mewjs/dom';
import * as formatters from '../src/other-formatter';
import parse from '../src/parse';
import type { Configuration } from '../src/typings/types';

const indent = function (opt: Partial<Configuration> & { level: number }) {
    const repeat = function (char: string, times: number) {
        return Array.prototype.join.call({ length: times + 1 }, char);
    };

    return repeat(opt['indent-char'] === 'tab' ? '\t' : repeat(' ', opt['indent-size']), opt.level);
};

const removeBlankLineAround = function (content: string) {
    return content.replace(/(^([\s\t]*\n)+)|((\n[\s\t]*)+$)/g, '');
};

const testFormatter = function () {

    describe('for script', () => {
        const scriptFormatter = formatters.script;

        it('should be a function', () => {
            expect(typeof scriptFormatter).toBe('function');
        });

        it('should not format non-javascript content', () => {
            const node = parse('<script type="text/template">hello;\nworld!</script>').querySelector('script');
            const content = (node.childNodes[0] as HTMLNode).textContent!;
            const opt = {
                'level': 0,
                'indent-char': 'space',
                'indent-size': 4
            };
            const indentContent = function (content: string) {
                opt.level++;

                return content.split('\n').map(line => (line ? (indent(opt) + line) : line))
                    .join('\n');
            };
            const newContent = scriptFormatter(
                content,
                node,
                opt,
                {
                    indent: indentContent,
                    trim: removeBlankLineAround
                }
            );

            expect(newContent).toBe(content);
        });

        it('should format javascript', () => {
            const node = parse('<script>const a=0;\nconst b=1;</script>').querySelector('script');
            const node2 = parse('<script type="text/javascript">const a=0;</script>').querySelector('script');
            const content = (node.childNodes[0] as HTMLNode).textContent!;
            const content2 = (node2.childNodes[0] as HTMLNode).textContent!;
            const opt = {
                'level': 0,
                'indent-char': 'space',
                'indent-size': 4
            };
            const indentContent = function (content: string) {
                opt.level++;

                return content.split('\n').map(line => (line ? (indent(opt) + line) : line))
                    .join('\n');
            };

            const newContent = scriptFormatter(
                content,
                node,
                opt,
                {
                    indent: indentContent,
                    trim: removeBlankLineAround
                }
            );

            const newContent2 = scriptFormatter(
                content2,
                node2,
                opt,
                {
                    indent: indentContent,
                    trim: removeBlankLineAround
                }
            );

            expect(typeof newContent).toBe('string');
            expect(typeof newContent2).toBe('string');
        });
    });

    describe('for style', () => {
        const styleFormatter = formatters.style;

        it('should be a function', () => {
            expect(typeof styleFormatter).toBe('function');
        });

        it('should format css', () => {
            const node = parse('<style>body{margin:0;}</style>').querySelector('style');
            const content = (node.childNodes[0] as HTMLNode).textContent!;
            const opt = {
                'level': 0,
                'indent-char': 'space',
                'indent-size': 4
            };
            const indentContent = function (content: string) {
                opt.level++;

                return content.split('\n').map(line => (line ? (indent(opt) + line) : line))
                    .join('\n');
            };

            const newContent = styleFormatter(
                content,
                node,
                opt,
                {
                    indent: indentContent,
                    trim: removeBlankLineAround
                }
            );

            expect(typeof newContent).toBe('string');
        });
    });

};

describe('formatter', testFormatter);
