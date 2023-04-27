import Manis from '@mewjs/manis';
import type { FinderOptions, ManisOptions } from '@mewjs/manis/lib/types';
import type { Configuration } from './typings/types';
import { cacheable } from './util';
import defaultConfig from './default/config';

/**
 * Name of the config file.
 */
const CONFIG_FILENAME = '.htmlintrc';

export const fileName = CONFIG_FILENAME;

/**
 * Parse given config text content.
 *
 * @param {string} text - given config text content
 * @return {?Configuration} the config content
 */
export function parse(text: string): Configuration {
    return Manis.loader(text, '') as Configuration;
}

/**
 * Load config for given file.
 *
 * @param {string} filePath - path of given file
 * @param {boolean=} refresh - if skips cache
 * @param {boolean=} orphan - if orphan config
 * @return {Configuration} the config content
 */
export const load = cacheable((filePath: string, refresh = false): Configuration => {
    const options = {
        orphan: true
    } as Partial<FinderOptions>;

    const manis = new Manis({
        // 支持 root 配置属性
        enableRoot: true,
        files: [
            CONFIG_FILENAME,
            { name: 'package.json', get: 'htmlint' },
            `${ CONFIG_FILENAME }.json`,
            `${ CONFIG_FILENAME }.yml`,
            `${ CONFIG_FILENAME }.yaml`,
            `${ CONFIG_FILENAME }.js`
        ]
    } as Partial<ManisOptions>, options);
    manis.setDefault(defaultConfig, options);
    manis.setUserConfig();

    return manis.from(filePath) as Configuration;
});
