import fs from 'fs';
import path from 'path';
import { hint } from '../../../src';

interface Position {
    line: number;
    column: number;
}

interface Result {
    content: string;
    pos: Position;
    element: Element;
    indent: string;
}

const rule = path.basename(__dirname);

describe(`hint rule ${ rule }`, () => {
    const code = fs.readFileSync(path.join(__dirname, 'case.html'), {
        encoding: 'utf-8'
    });

    const result: Result[] = [];

    const scriptLinter = function (content, pos, element, indent) {
        result.push({
            content,
            pos,
            element,
            indent
        });
    };

    hint(code, {
        'script-content': true,
        'linters': {
            script: scriptLinter
        }
    });

    hint(code, {
        linters: {
            script: scriptLinter
        }
    });

    hint(code, { 'script-content': true });

    it('should call linter on script', () => {
        expect(result.length).toBe(3);

        expect(result[0].content).toBe('const a = 1;');
        expect(result[0].pos.line).toBe(1);
        expect(result[0].pos.column).toBe(9);
        expect(result[0].element.tagName).toBe('SCRIPT');
        expect(result[0].indent).toBe('');

        expect(result[1].content).toBe('\n\t    const a = 1;\n\t');
        expect(result[1].pos.line).toBe(2);
        expect(result[1].pos.column).toBe(10);
        expect(result[1].element.tagName).toBe('SCRIPT');
        expect(result[1].indent).toBe('\t');

        expect(result[2].content).toBe('\n    const a = {\n        index: 1\n    };\n    ');
        expect(result[2].pos.line).toBe(5);
        expect(result[2].pos.column).toBe(36);
        expect(result[2].element.tagName).toBe('SCRIPT');
        expect(result[2].indent).toBe('    ');
    });
});
