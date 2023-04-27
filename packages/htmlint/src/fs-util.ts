import { readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

import type {
    RuleOptions,
    Rule
} from './typings/types';

/**
 * Application (htmlint) info.
 *
 * @type {Object}
 * @property {string} root - root path of application (htmlint) code
 */
export const app = {
    root: resolve(__dirname, '../')
};

const RULE_NAME_PATTERN = /\b(?<!\.d)\.[jt]s$/;

export const parseRules = <T extends RuleOptions>(dir: string = resolve(__dirname, 'rules')): (Rule<T> | T)[] =>
    readdirSync(dir)
        .filter(name => RULE_NAME_PATTERN.test(name))
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .map(name => require(`${ dir }/${ name }`).default);


/**
 * Get path of home(~).
 *
 * @return {string} path of home
 */
export const getHomePath = (): string => {
    const {
        env: {
            USERPROFILE = '',
            HOME = '',
            HOMEPATH = '',
            HOMEDRIVE = '',
        }
    } = process;
    const paths = [
        USERPROFILE,
        HOME,
        HOMEPATH,
        HOMEDRIVE + HOMEPATH
    ];

    let homePath = '';

    while ((homePath = paths.shift())) {
        if (existsSync(homePath)) {
            return homePath;
        }
    }

    return homePath || '';
};
