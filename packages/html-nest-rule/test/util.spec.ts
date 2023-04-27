import emmet from 'emmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from '@mewjs/htmlint';
import type { HTMLElement } from '@mewjs/dom';
import type HTMLNode from '@mewjs/dom';

import { rules } from '../src';
import type { Expect } from '../src/util';
import {
    getRule,
    getNodeInfo,
    getNodeCategoriesInfo,
    getSequenceInfo,
    getAncestors,
    getCategories,
    isTag,
    isNotTag,
    isCategory,
    isNotCategory,
    walkDescendants,
    validateCategory,
    validateChildrenSequence,
    is,
    isNot
} from '../src/util';

function getFirstTag(domExpression: string) {
    return domExpression.match(/^[\w-]+/)![0];
}

function getElement(domExpression: string, query?: string) {
    const htmlCode = emmet.expandAbbreviation(domExpression, { html: 'xhtml' });
    const document = parse(htmlCode);
    return document.querySelector(query || getFirstTag(domExpression));
}

describe('method getRule', () => {

    it('should get correct rule for known elements', () => {
        ['html', 'p', 'div', 'span', 'script', 'math', 'svg'].forEach(tag => {
            expect(getRule(getElement(tag))).toBe(rules[tag]);
        });
    });

    it('should return undefined for unknown elements', () => {
        expect(getRule(getElement('self-defined-tag'))).toBe(void 0);
    });
});

describe('method getCategories', () => {

    it('should get correct rule for known elements', () => {
        ['html', 'p', 'div', 'span', 'script', 'math', 'svg'].forEach(tag => {
            const element = getElement(tag);
            expect(getCategories(element)).toEqual(getRule(element)!.getCategories(element));
        });
    });

    it('should return empty list for unknown elements', () => {
        expect(getCategories(getElement('self-defined-tag'))).toEqual([]);
    });
});

describe('method nodeInfo', () => {

    it('should get node info description for given elements', () => {
        ['html', 'p', 'div', 'span', 'script', 'math', 'svg'].forEach(tag => {
            expect(typeof getNodeInfo(getElement(tag))).toBe('string');
        });
    });
});

describe('method nodeCategoriesInfo', () => {

    it('should get node info description for given elements', () => {
        ['html', 'p', 'div', 'span', 'script', 'math', 'svg'].forEach(tag => {
            expect(typeof getNodeCategoriesInfo(getElement(tag))).toBe('string');
        });
    });
});

describe('method sequenceInfo', () => {

    it('should get node info description for given elements', () => {
        ['html>head+body', 'body>p+div', 'div>p*2+div', 'span>i+{hello!}+strong', 'i'].forEach(tag => {
            expect(typeof getSequenceInfo(getElement(tag).children as HTMLNode[])).toBe('string');
        });
    });
});

describe('method isCategory & isNotCategory', () => {

    it('should get correct result for category match', () => {
        expect(isCategory('interactive content', getElement('audio[controls]'))).toBe(true);
        expect(isCategory('interactive content|flow content', getElement('audio[controls]'))).toBe(true);
        expect(isNotCategory('interactive content', getElement('audio'))).toBe(true);
        expect(isNotCategory('interactive content|flow content', getElement('audio'))).toBe(false);
    });

    it('should return true for unknown elements', () => {
        expect(isCategory('interactive content', getElement('self-defined-tag'))).toBe(true);
        expect(isCategory('interactive content|flow content', getElement('self-defined-tag'))).toBe(true);
        expect(isNotCategory('interactive content', getElement('self-defined-tag'))).toBe(false);
        expect(isNotCategory('interactive content|flow content', getElement('self-defined-tag'))).toBe(false);
    });
});

describe('method isTag & isNotTag', () => {

    it('should get correct result for tag match', () => {
        expect(isTag('p', getElement('p'))).toBe(true);
        expect(isTag('div', getElement('div'))).toBe(true);
        expect(isTag('span', getElement('span'))).toBe(true);
        expect(isTag('p|div|span,', getElement('p'))).toBe(true);
        expect(isTag('p|div|span,', getElement('p>span'))).toBe(true);

        expect(isNotTag('p', void 0)).toBe(true);
        expect(isNotTag('span', getElement('p'))).toBe(true);
        expect(isNotTag('p|span', getElement('p'))).toBe(false);
        expect(isNotTag('div|span', getElement('p'))).toBe(true);
    });
});

describe('method getAncestors', () => {

    function getAncestorsInfo(element: HTMLNode) {
        return getAncestors(element).reverse()
            .map(ancestor => ancestor.tagName.toLowerCase())
            .join(',');
    }

    function getTargetElement(domExpression: string) {
        return getElement(domExpression, '#target');
    }

    it('should get ancestors for given element', () => {
        expect(
            getAncestorsInfo(
                getTargetElement('html>head+body>script+div>(p#target>i)+ul>li*2')
            )
        ).toBe('html,body,div');
        expect(
            getAncestorsInfo(
                getTargetElement('html>head>meta+title+script#target')
            )
        ).toBe('html,head');
        expect(
            getAncestorsInfo(
                getTargetElement('html>head+body>p+ol>li>(h5#target>span*2)+p')
            )
        ).toBe('html,body,ol,li');
        expect(
            getAncestorsInfo(
                getTargetElement('body#target')
            )
        ).toBe('');
    });
});

describe('method walkDescendants', () => {

    function getDescendantsInfo(element: HTMLElement) {
        const descendants = [] as string[];
        walkDescendants(element, descendant => {
            descendants.push(descendant.tagName.toLowerCase());
        });
        return descendants.join(',');
    }

    it('should get ancestors for given element', () => {
        expect(
            getDescendantsInfo(
                getElement('html>head+body>script+div>(p>i)+ul>li*2')
            )
        ).toBe('head,body,script,div,p,i,ul,li,li');
        expect(
            getDescendantsInfo(
                getElement('html>head>meta+title+script')
            )
        ).toBe('head,meta,title,script');
        expect(
            getDescendantsInfo(
                getElement('html>head+body>p+ol>li>(h5>span*2)+p')
            )
        ).toBe('head,body,p,ol,li,h5,span,span,p');
        expect(
            getDescendantsInfo(
                getElement('body')
            )
        ).toBe('');
    });
});

describe('method validateCategory', () => {
    function validateChildrenCategory(expected: string, element: HTMLNode) {
        return validateCategory(expected, element.children as HTMLNode[]).length;
    }

    it('should get correct result for category match', () => {
        expect(validateChildrenCategory('interactive content', getElement('div>a+textarea'))).toBe(0);
        expect(validateChildrenCategory('interactive content', getElement('div>a+textarea+p'))).toBe(1);
        expect(validateChildrenCategory('interactive content', getElement('div>a+textarea+p+span'))).toBe(2);
        expect(validateChildrenCategory('interactive content', getElement('div>a+self-defined-tag'))).toBe(0);
    });
});

// eslint-disable-next-line max-lines-per-function
describe('method validateChildrenSequence', () => {

    function shouldReport(expected: Expect, domExpression: string) {
        const result = validateChildrenSequence(expected, getElement(domExpression));
        expect(result.length).toBe(1);
        expect(result[0].expect).toBe(expected.desc);
    }

    function shouldNotReport(expected: Expect, domExpression: string) {
        const result = validateChildrenSequence(expected, getElement(domExpression));
        expect(result.length).toBe(0);
    }

    it('should validate correctly for ?', () => {
        shouldNotReport({
            desc: 'test',
            sequence: [['a|p', '?']]
        }, 'div');

        shouldNotReport({
            desc: 'test',
            sequence: [['a|p', '?']]
        }, 'div>a');

        shouldReport({
            desc: 'test',
            sequence: [['a|p', '?']]
        }, 'div>a*2');

        shouldReport({
            desc: 'test',
            sequence: [['a|p', '?']]
        }, 'div>a+p');
    });

    it('should validate correctly for *', () => {
        shouldNotReport({
            desc: 'test',
            sequence: [['a|p', '*']]
        }, 'div');

        shouldNotReport({
            desc: 'test',
            sequence: [['a|p', '*']]
        }, 'div>a');

        shouldNotReport({
            desc: 'test',
            sequence: [['a|p', '*']]
        }, 'div>a*2');

        shouldNotReport({
            desc: 'test',
            sequence: [['a|p', '*']]
        }, 'div>a+p');
    });

    it('should validate correctly for *', () => {
        shouldReport({
            desc: 'test',
            sequence: [['a|p', '+']]
        }, 'div');

        shouldNotReport({
            desc: 'test',
            sequence: [['a|p', '+']]
        }, 'div>a');

        shouldNotReport({
            desc: 'test',
            sequence: [['a|p', '+']]
        }, 'div>a*2');

        shouldNotReport({
            desc: 'test',
            sequence: [['a|p', '+']]
        }, 'div>a+p');
    });

    it('should validate correctly for num', () => {
        shouldReport({
            desc: 'test',
            sequence: [['a|p', 1]]
        }, 'div');

        shouldNotReport({
            desc: 'test',
            sequence: [['a|p', 1]]
        }, 'div>a');

        shouldReport({
            desc: 'test',
            sequence: [['a|p', 1]]
        }, 'div>a*2');

        shouldReport({
            desc: 'test',
            sequence: [['a|p', 1]]
        }, 'div>a+p');
    });

    it('should validate correctly for category requirement', () => {
        shouldReport({
            desc: 'test',
            sequence: [['p|category:interactive content', 2]]
        }, 'div');

        shouldNotReport({
            desc: 'test',
            sequence: [['p|category:interactive content', 2]]
        }, 'div>p+a');

        shouldNotReport({
            desc: 'test',
            sequence: [['p|category:interactive content', 2]]
        }, 'div>a*2');

        shouldNotReport({
            desc: 'test',
            sequence: [['p|category:interactive content', 2]]
        }, 'div>p*2');
    });

    it('should validate correctly for method requirement', () => {
        shouldReport({
            desc: 'test',
            sequence: [[isTag('p'), 1]]
        }, 'div');

        shouldNotReport({
            desc: 'test',
            sequence: [[isTag('p'), 1]]
        }, 'div>p');

        shouldReport({
            desc: 'test',
            sequence: [[isTag('p'), 1]]
        }, 'div>a');

        shouldReport({
            desc: 'test',
            sequence: [[isTag('p'), 1]]
        }, 'div>a+p');
    });

    it('should validate correctly for multi sequence requirement', () => {
        shouldReport({
            desc: 'test',
            sequence: [
                ['p', '*'],
                ['category:interactive content', '+'],
                ['div|category:embedded content', 1]
            ]
        }, 'div');

        shouldReport({
            desc: 'test',
            sequence: [
                ['p', '*'],
                ['category:interactive content', '+'],
                ['div|category:embedded content', 1]
            ]
        }, 'div>p+a');

        shouldReport({
            desc: 'test',
            sequence: [
                ['p', '*'],
                ['category:interactive content', '+'],
                ['div|category:embedded content', 1]
            ]
        }, 'div>p+div');

        shouldNotReport({
            desc: 'test',
            sequence: [
                ['p', '*'],
                ['category:interactive content', '+'],
                ['div|category:embedded content', 1]
            ]
        }, 'div>a+div');

        shouldNotReport({
            desc: 'test',
            sequence: [
                ['p', '*'],
                ['category:interactive content', '+'],
                ['div|category:embedded content', 1]
            ]
        }, 'div>p*2+a+div');

        shouldNotReport({
            desc: 'test',
            sequence: [
                ['p', '*'],
                ['category:interactive content', '+'],
                ['div|category:embedded content', 1]
            ]
        }, 'div>p*2+a*2+div');

        shouldNotReport({
            desc: 'test',
            sequence: [
                ['p', '*'],
                ['category:interactive content', '+'],
                ['div|category:embedded content', 1]
            ]
        }, 'div>a+audio');

    });
});

describe('define for inter-element whitespace', () => {
    const name = 'inter-element whitespace';
    const match = is(name);
    const disMatch = isNot(name);

    it('should match correctly', () => {

        expect(match(void 0)).toBe(true);

        [
            'span',
            'span{\u0020}',
            'span{\u0009}',
            'span{\u000a}',
            'span{\u000c}',
            'span{\u000d}',
            'span{\u0020\u0009}',
            'span{\u0020\u0009\u000a\u000c\u000d}'
        ].forEach(testCase => {
            expect(match(getElement(testCase).childNodes[0] as HTMLNode)).toBe(true);
        });

        [
            'span{hello!}',
            'span{hello!\u0020}'
        ].forEach(testCase => {
            expect(disMatch(getElement(testCase).childNodes[0])).toBe(true);
        });

        [
            'span',
            'p',
            'div'
        ].forEach(testCase => {
            expect(disMatch(getElement(testCase))).toBe(true);
        });
    });
});

describe('define for media element', () => {
    const name = 'media element';
    const match = is(name);
    const disMatch = isNot(name);

    it('should match correctly', () => {
        [
            'audio',
            'audio[controls]',
            'video',
            'video[controls]'
        ].forEach(testCase => {
            expect(match(getElement(testCase))).toBe(true);
        });

        expect(disMatch(void 0)).toBe(true);

        [
            'span',
            'p',
            'div'
        ].forEach(testCase => {
            expect(disMatch(getElement(testCase))).toBe(true);
        });
    });
});

describe('unfound define', () => {
    const name = 'some unfound define';
    const disMatch = isNot(name);

    it('should never match', () => {
        [
            'span',
            'span{hello!}'
        ].forEach(testCase => {
            expect(disMatch(getElement(testCase).childNodes[0])).toBe(true);
        });

        [
            'span',
            'p',
            'div'
        ].forEach(testCase => {
            expect(disMatch(getElement(testCase))).toBe(true);
        });
    });
});
