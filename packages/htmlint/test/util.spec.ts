import { ElementType } from 'domelementtype';
import {
    isElement,
    extend,
    extendAttribute,
    cacheable,
    getPosition,
    extractCommentInfo

} from '../src/util';

describe('isElement', () => {

    it('should return true if passed an element node', () => {
        expect(isElement({
            type: ElementType.Tag
        })).toBe(true);
        expect(isElement({
            type: ElementType.Script
        })).toBe(true);
        expect(isElement({
            type: ElementType.Style
        })).toBe(true);
    });

    it('should return false if passed an none-element node', () => {
        expect(isElement({
            type: ElementType.Comment
        })).toBe(false);
        expect(isElement({
            type: ElementType.Text
        })).toBe(false);
        expect(isElement({
            type: ElementType.Doctype
        })).toBe(false);
    });
});

describe('extend', () => {

    describe('extend object', () => {
        let result = extend(
            {
                a: 1,
                b: 1
            },
            {
                b: 2,
                c: 3
            }
        );
        result = extend(result, Object.create({ d: 4 }));

        it('should return right result', () => {
            expect(result.a).toBe(1);
            expect(result.b).toBe(2);
            expect(result.c).toBe(3);
            expect('d' in result).toBeFalsy();
        });
    });
});

describe('extendAttribute', () => {

    describe('extend attributes', () => {
        interface A {
            a: number;
            b: number;
        }

        interface B {
            readonly b: number;
            c: any;
        }

        const a: A = {
            a: 1,
            b: 1
        };

        const b = {
            b: {
                get() {
                    return 2;
                }
            },
            c: {
                get(this: A & B) {
                    return this.b + 1;
                },
                set(this: A & B, value: number) {
                    this.a = value - 2;
                }
            }
        };
        let result = extendAttribute(a, b);

        result = extendAttribute(result, Object.create({ d: 4 }));

        it('should return right result', () => {
            expect(result.a).toBe(1);
            expect(result.b).toBe(2);
            expect(result.c).toBe(3);

            // @ts-expect-error
            result.c = 4;
            expect(result.a).toBe(2);

            expect('d' in result).toBeFalsy();
        });
    });
});

describe('cacheable', () => {

    describe('valueOf', () => {
        let count = 0;
        const valueOf = cacheable(key => {
            count++;
            return key;
        });

        it('should return right result', () => {
            expect(valueOf('1')).toBe('1');
            expect(valueOf('2')).toBe('2');
        });

        it('should cache result', () => {
            expect(valueOf('1')).toBe('1');
            expect(count).toBe(2);
        });

        it('should run getter again if refresh required', () => {
            expect(valueOf('1', true)).toBe('1');
            expect(count).toBe(3);
        });

        it('should clean cached data while method clear called', () => {
            valueOf.clear();
            expect(valueOf('1')).toBe('1');
            expect(valueOf('2')).toBe('2');
            expect(count).toBe(5);
        });
    });
});

describe('getPosition', () => {
    const content = [
        'This is content for test getPosition.',
        'Words written here may make no sense.',
        'The end.'
    ].join('\n');
    const position = getPosition(content);
    const pos = getPosition(content, content.indexOf('The end.') + 2);

    it('should return a function given one argument', () => {
        expect(typeof position).toBe('function');
    });

    it('should return position info given two argument', () => {
        expect(typeof pos).toBe('object');
    });

    it('should position right', () => {
        const pos0 = position(0);
        expect(pos0.line).toBe(1);
        expect(pos0.column).toBe(1);

        const posOfWritten = position(content.indexOf('written'));
        expect(posOfWritten.line).toBe(2);
        expect(posOfWritten.column).toBe(7);

        const posOfTheEndPlus2 = position(content.indexOf('The end.') + 2);
        expect(posOfTheEndPlus2.line).toBe(3);
        expect(posOfTheEndPlus2.column).toBe(3);

        expect(pos.line).toBe(3);
        expect(pos.column).toBe(3);
    });
});

describe('extractCommentInfo', () => {
    const commentInfo = [
        'htmlint-enable',
        ' htmlint-disable ',
        'htmlint-disable img-alt, img-src, attr-value-double-quotes',
        'htmlint "img-width-height": true',
        'htmlint img-width-height: true',
        'htmlint img-width-height: true, self-close: "no-close"'
    ].map(extractCommentInfo);

    it('should support disable & enable', () => {
        expect(typeof commentInfo[0]).toBe('object');
        expect(commentInfo[0].operation).toBe('enable');
        expect(commentInfo[0].content).toBe(null);

        expect(typeof commentInfo[1]).toBe('object');
        expect(commentInfo[1].operation).toBe('disable');
        expect(commentInfo[1].content).toBe(null);
    });

    it('should support content', () => {
        expect(typeof commentInfo[2]).toBe('object');
        expect(commentInfo[2].operation).toBe('disable');
        expect((commentInfo[2].content as string[]).length).toBe(3);
        expect(commentInfo[2].content[0]).toBe('img-alt');
        expect(commentInfo[2].content[1]).toBe('img-src');
        expect(commentInfo[2].content[2]).toBe('attr-value-double-quotes');
    });

    it('should support config', () => {
        expect(typeof commentInfo[3]).toBe('object');
        expect(commentInfo[3].operation).toBe('config');
        expect(Object.keys(commentInfo[3].content).length).toBe(1);
        expect(commentInfo[3].content['img-width-height']).toBe(true);

        expect(typeof commentInfo[4]).toBe('object');
        expect(commentInfo[4].operation).toBe('config');
        expect(Object.keys(commentInfo[4].content).length).toBe(1);
        expect(commentInfo[4].content['img-width-height']).toBe(true);
    });

    it('should support multi-config', () => {
        expect(typeof commentInfo[5]).toBe('object');
        expect(commentInfo[5].operation).toBe('config');
        expect(Object.keys(commentInfo[5].content).length).toBe(2);
        expect(commentInfo[5].content['img-width-height']).toBe(true);
        expect(commentInfo[5].content['self-close']).toBe('no-close');
    });

});

