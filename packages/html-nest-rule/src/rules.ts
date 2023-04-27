import fs from 'fs';
import path from 'path';
import type { HTMLElement } from '@mewjs/dom';

import type { Result } from './util';

export interface Rule {
    tagName: string;
    getCategories(element: HTMLElement): string[];
    validateContent(element: HTMLElement): Result[];
    validateContext(element: HTMLElement): Result[];
}

export interface Rules {
    [key: string]: Rule;
}

export const rules: Rules = Object.create(null);

const matcher = /\b(?<!\.d)\.[jt]s$/;
const parseRules = (dir: string = path.resolve(__dirname, 'tags'), initial: Rules = rules): Rules => (
    fs.readdirSync(dir).reduce((rules, name) => {
        if (matcher.test(name)) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            rules[name.replace(matcher, '')] = require(`${ dir }/${ name }`).default;
        }
        return rules;
    }, initial)
);

parseRules();
