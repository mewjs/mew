import { parseDocument } from 'htmlparser2';

import type HTMLNode from '../src';
import { NodeType, HTMLElement, Attribute, transformRecursively } from '../src';

describe('Element', () => {
    describe('init', () => {
        it('should init a Element instance with given node', () => {
            const ele = HTMLElement.init({
                name: 'test-element'
            });
            expect(ele instanceof HTMLElement).toBe(true);
            expect(Object.getPrototypeOf(ele)).toBe(HTMLElement.prototype);
        });

        it('should do nothing if given null', () => {
            expect(HTMLElement.init(null)).toBe(null);
        });

        it('should not init single instance', () => {
            const ele = HTMLElement.init({
                name: 'test-element'
            });
            const ele2 = HTMLElement.init(ele);
            expect(ele).toBe(ele2);
        });
    });
});

describe('element', () => {
    const p = transformRecursively(
        parseDocument(
            '<p><span></span>'
            + '<a id="x" class="y z" href="#" data-role="test" disabled>'
            + '<img id="c1" class="cls cls2">'
            + '<span id="c2" class="cls"></span>'
            + '</a>'
            + '<i></i></p>'
        ).children[0] as HTMLNode
    );

    it('should behave like a element(<a>)', () => {

        let node = p.childNodes[0] as HTMLElement;

        // as an element
        expect(node.localName).toBe('span');
        expect(node.tagName).toBe('SPAN');
        expect(node.classList.length).toBe(0);
        expect(node.lastElementChild).toBe(null);

        node = p.childNodes[1] as HTMLElement;

        // as a node
        expect(node.nodeName).toBe('A');
        expect(node.nodeType).toBe(NodeType.ELEMENT_NODE);

        expect((node.parentNode as HTMLElement).tagName).toBe('P');
        expect(node.parentElement).toBe(node.parentNode);
        expect((node.previousSibling as HTMLElement).tagName).toBe('SPAN');
        expect((node.nextSibling as HTMLElement).tagName).toBe('I');

        // as an element
        expect(node.localName).toBe('a');
        expect(node.tagName).toBe('A');
        expect(node.id).toBe('x');
        expect(node.className).toBe('y z');
        expect(node.classList.length).toBe(2);
        expect(node.classList[0]).toBe('y');
        expect(node.classList[1]).toBe('z');

        expect(node.attributes[0].name).toBe('id');
        expect(node.attributes[0].value).toBe('x');
        expect(node.attributes[1].name).toBe('class');
        expect(node.attributes[1].value).toBe('y z');
        expect(node.attributes[2].name).toBe('href');
        expect(node.attributes[2].value).toBe('#');
        expect(node.attributes[3].name).toBe('data-role');
        expect(node.attributes[3].value).toBe('test');
        expect(node.attributes[4].name).toBe('disabled');
        expect(node.attributes[4].value).toBe('');

        expect(node.children.length).toBe(2);
        expect(node.children[0]).toBe(node.firstElementChild);
        expect(node.children[1]).toBe(node.lastElementChild);
        expect(node.childElementCount).toBe(2);
        expect((node.children[0] as HTMLElement).id).toBe('c1');
        expect((node.children[1] as HTMLElement).id).toBe('c2');

        expect(node.previousElementSibling.tagName).toBe('SPAN');
        expect(node.nextElementSibling.tagName).toBe('I');

        expect(node.getAttribute('href')).toBe('#');
        const hrefAttributeNode = node.getAttributeNode('href')!;
        expect(hrefAttributeNode.name).toBe('href');
        expect(hrefAttributeNode.value).toBe('#');
        expect(node.hasAttribute('href')).toBe(true);
        expect(node.hasAttribute('disabled')).toBe(true);
        expect(node.hasAttribute('enabled')).toBe(false);

        expect(node.matches('p a')).toBe(true);
        expect(node.matches('p span')).toBe(false);
        expect(node.matches('p #x')).toBe(true);
        expect(node.matches('.y')).toBe(true);
        expect(node.matches('.y.z')).toBe(true);
        expect(node.firstElementChild.matches('a img')).toBe(true);
        expect(node.firstElementChild.matches('#x #c1')).toBe(true);
        expect(node.firstElementChild.matches('.y.z .cls')).toBe(true);
        expect(node.firstElementChild.matches('.y.z #c2')).toBe(false);

        const elementsOfTagNameImg = node.getElementsByTagName('img');
        expect(elementsOfTagNameImg.length).toBe(1);
        expect(elementsOfTagNameImg[0].id).toBe('c1');

        const elementsOfClassNameCls = node.getElementsByClassName('cls');
        expect(elementsOfClassNameCls.length).toBe(2);
        expect(elementsOfClassNameCls[0].id).toBe('c1');
        expect(elementsOfClassNameCls[1].id).toBe('c2');

        const elementsOfClassNameClsCls2 = node.getElementsByClassName('cls cls2');
        expect(elementsOfClassNameClsCls2.length).toBe(1);
        expect(elementsOfClassNameClsCls2[0].id).toBe('c1');

        const elementOfIdC2 = node.querySelector('#c2')!;
        expect(elementOfIdC2.id).toBe('c2');

        const elementsOfIdC2 = node.querySelectorAll('#c2');
        expect(elementsOfIdC2.length).toBe(1);
        expect(elementsOfIdC2[0].id).toBe('c2');
    });
});

describe('element write ops', () => {
    const a = transformRecursively(
        parseDocument(
            '<a id="x" class="y z" href="#" data-role="test" disabled></a>'
        ).children[0] as HTMLNode
    ) as HTMLElement;


    it('should work well', () => {
        expect(a.getAttribute('id')).toBe('x');
        expect(a.getAttributeNode('id')!.name).toBe('id');
        expect(a.getAttributeNode('id')!.value).toBe('x');
        a.setAttribute('id', 'xx');
        expect(a.getAttribute('id')).toBe('xx');
        expect(a.getAttributeNode('id')!.name).toBe('id');
        expect(a.getAttributeNode('id')!.value).toBe('xx');

        a.removeAttribute('id');
        expect(a.hasAttribute('id')).toBe(false);
        expect(a.getAttribute('id')).toBe(null);
        expect(a.getAttributeNode('id')).toBe(null);

        let oldAttribute = a.setAttributeNode(new Attribute('data-role', 'test2'));
        expect(oldAttribute!.name).toBe('data-role');
        expect(oldAttribute!.value).toBe('test');
        expect(a.getAttribute('data-role')).toBe('test2');

        oldAttribute = a.removeAttributeNode(a.getAttributeNode('disabled')!);
        expect(oldAttribute!.name).toBe('disabled');
        expect(oldAttribute!.value).toBe('');
        expect(a.hasAttribute('disabled')).toBe(false);
    });
});
