import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';
import File from 'vinyl';
import mew from '../../src/index';
import type { CliOptions, LintError, LintFile } from '../../src/types';

const FIXTURES_FILES = path.resolve(__dirname, '../fixtures/files');

export async function lint(
    fileName: string,
    type = 'js',
    options: Partial<CliOptions> = {}
): Promise<LintError[]> {
    fileName = path.resolve(FIXTURES_FILES, fileName);
    const content = fs.readFileSync(fileName, 'utf-8');
    const { errors } = await mew.lintText(content, fileName, type, options);
    return errors;
}


export async function fix(
    fileName: string,
    type = 'js',
    options: Partial<CliOptions> = {}
) {
    fileName = path.resolve(FIXTURES_FILES, fileName);
    const content = fs.readFileSync(fileName, 'utf-8');

    return mew.fixText(content, fileName, type, options);
}

function getDocStream(path: string, text: string) {
    const strBuffer = Buffer.from(text);
    const strFile = new File({
        contents: strBuffer,
        path,
        /* eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error */
        // @ts-ignore
        stat: {
            size: strBuffer.byteLength
        }
    });
    const strStream = new Readable({ objectMode: true });

    strStream.push(strFile);
    strStream.push(null);

    return strStream;
}

export async function lintStream(
    fileName: string,
    opts: Partial<CliOptions> = { type: 'js' }
): Promise<LintFile | null> {
    fileName = path.resolve(FIXTURES_FILES, fileName);
    const content = fs.readFileSync(fileName, 'utf-8');
    const options = {
        stream: getDocStream(fileName, content),
        _: [fileName],
        ...opts
    } as CliOptions;

    return new Promise(resolve => {
        mew.lint(options, (success, json) => {
            if (!json.length) {
                resolve(null);
                return;
            }
            resolve(json[0]);
        });
    });
}

export async function fixStream(fileName: string, opts: Partial<CliOptions> = { type: 'js' }) {
    fileName = path.resolve(FIXTURES_FILES, fileName);
    const content = fs.readFileSync(fileName, 'utf-8');
    const options = {
        stream: getDocStream(fileName, content),
        _: [fileName],
        ...opts
    } as CliOptions;
    const stream = mew.fix(options);

    return new Promise(resolve => {
        stream.on('data', (file: LintFile) => {
            const formattedText = file.contents?.toString();
            resolve(formattedText);
        });
        stream.on('error', () => {
            resolve(null);
        });
    });
}
