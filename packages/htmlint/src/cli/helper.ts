import fs from 'fs';
import path from 'path';
import type { WalkNext, WalkStats } from 'walk';
import walk from 'walk';
import yargs from 'yargs';
import { parse } from '../config';
import type { Configuration } from '../typings/types';

/**
 * Deal with error & exit.
 *
 * @param {string} msg - error message
 */
export function dealError(msg: string) {
    console.log(`Error: ${ msg }\n`);
    yargs.showHelp();
    process.exit(1);
}

/**
 * Read file.
 *
 * @param {string} filePath - path of given file
 * @return {string} file content
 */
export function readFile(filePath: string): string {
    return fs.readFileSync(filePath, { encoding: 'utf-8' });
}

/**
 * Load content of specified config file.
 *
 * @param {string} configFilePath - path of specified config file
 * @return {?Object} the config content
 */
export function loadSpecifiedConfig(configFilePath: string): Configuration | null {
    try {
        return parse(readFile(configFilePath));
    }
    catch (e) {
        dealError(`Load config (${ configFilePath }) failed: ${ e.message }`);
        return null;
    }
}

const HTML_EXT_PATTERN = /\.html?$/;

/**
 * Get target files with given targets (file / directory path).
 *
 * @param {string[]} targets - list of given targets
 * @return {string[]} list of target files' path
 */
export function getTargetFiles(targets: string[]): string[] {
    return targets.reduce((files: string[], target: string) => {
        const stat = fs.statSync(target);

        if (stat.isFile()) {
            files.push(target);
        }

        if (stat.isDirectory()) {
            walk.walkSync(target, {
                followLinks: false,
                filters: ['node_modules', 'bower_components', 'Temp', '_Temp'],
                listeners: {
                    file(root: string, fileStat: WalkStats, next: WalkNext) {
                        const filePath = path.join(root, fileStat.name);

                        // filter with suffix (.html)
                        if (HTML_EXT_PATTERN.test(filePath)) {
                            files.push(filePath);
                        }
                        next();
                    }
                }
            });
        }

        return files;
    }, []);
}
