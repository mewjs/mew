import fs from 'fs';

import type { Result } from './reporter';
import { load } from './config';
import { hint, format } from './htmlint';

export type { FormatMapper } from './htmlint';
export { addRule, hint, hintAsync, format, formatAsync } from './htmlint';

export { default as parse } from './parse';

export type ReadFileOptions = BufferEncoding | { encoding: BufferEncoding; flag?: string };

/**
 * Do hint with given filePath & option for readFile.
 *
 * @param {string} filePath - path of the target file
 * @param {ReadFileOptions=} options - option for readFile
 * @param {Partial<Configuration>} config
 * @return {Result[]} the hint result, list of reports
 */
export function hintFile(
    filePath: string,
    options: ReadFileOptions = 'utf-8',
    configuration = load(filePath)
): Result[] {

    const content = fs.readFileSync(filePath, options);

    return hint(content, configuration);
}

/**
 * Do format with given filePath & option for readFile
 *
 * @param {string} filePath - path of the target file
 * @param {Object=} options - option for readFile
 * @return {string} the formatted code
 */
export function formatFile(filePath: string, options: ReadFileOptions = 'utf-8'): string {
    const content = fs.readFileSync(filePath, options);
    const configuration = load(filePath);

    return format(content, configuration);
}
