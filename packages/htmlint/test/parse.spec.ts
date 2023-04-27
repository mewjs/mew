import fs from 'fs';
import path from 'path';
import type { HTMLElement } from '@mewjs/dom';
import parse from '../src/parse';

const testCasePath = path.resolve(__dirname, './fixture/all.html');
const testCase = fs.readFileSync(testCasePath, {
    encoding: 'utf-8'
});

describe('parse', () => {
    const document = parse(testCase);

    it('should return a dom tree', () => {
        expect(document.nodeName).toBe('#document');

        const html = document.firstElementChild as HTMLElement;
        expect(html.tagName).toBe('HTML');
        expect((html.firstElementChild as HTMLElement).tagName).toBe('HEAD');
        expect((html.lastElementChild as HTMLElement).tagName).toBe('BODY');

        const imgs = document.querySelectorAll('img');
        expect(imgs.length).toBe(3);
        expect(imgs[0].id).toBe('img1');
        expect(imgs[1].id).toBe('img2');
        expect(imgs[2].id).toBe('img3');
    });

    it('should record positions', () => {
        const titlePos = document.querySelector('title').startIndex;
        expect(titlePos).toBe(61);

        const divPos = document.querySelector('#div').startIndex;
        expect(divPos).toBe(751);

        const img1Pos = document.querySelector('#img1').startIndex;
        expect(img1Pos).toBe(999);
    });
});
