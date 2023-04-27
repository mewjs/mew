import {
    format,
    indent,
    isIn
} from '../src/util';

describe('format', () => {

    describe('format tpl', () => {
        const result = format(
            // eslint-disable-next-line no-template-curly-in-string
            '${a},${b},${c},${d},${e},${f}',
            {
                a: 1,
                b: '2',
                c: null,
                d: true,
                e: false
            }
        );

        it('should return right result', () => {
            expect(result).toBe('1,2,,true,false,');
        });
    });
});

describe('indent', () => {

    describe('output indent', () => {
        const result1 = indent(-1, 'space', 2);
        const result2 = indent(0, 'space', 2);
        const result3 = indent(1, 'space', 2);
        const result4 = indent(2, 'space', 2);
        const result5 = indent(2, 'space', 4);
        const result6 = indent(1, 'tab');
        const result7 = indent(2, 'tab');

        it('should return right result', () => {
            expect(result1).toBe('');
            expect(result2).toBe('');
            expect(result3).toBe('  ');
            expect(result4).toBe('    ');
            expect(result5).toBe('        ');
            expect(result6).toBe('\t');
            expect(result7).toBe('\t\t');
        });
    });
});

describe('isIn', () => {

    describe('judge if in an array', () => {
        const result1 = isIn(1, []);
        const result2 = isIn(1, [1]);
        const result3 = isIn(1, [1, 2]);
        const result4 = isIn(2, [1, 2]);
        const result5 = isIn(3, [1, 2]);
        const result6 = isIn(void 0, [1, 2, void 0]);
        const result7 = isIn(null, [1, 2, null]);
        const result8 = isIn(null, [1, 2]);

        it('should return right result', () => {
            expect(result1).toBe(false);
            expect(result2).toBe(true);
            expect(result3).toBe(true);
            expect(result4).toBe(true);
            expect(result5).toBe(false);
            expect(result6).toBe(true);
            expect(result7).toBe(true);
            expect(result8).toBe(false);
        });
    });
});
