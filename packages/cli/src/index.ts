import { name, version } from '../package.json';
import { getOptions } from './cli';
import { getTextStream, findPath, getCLIName, PACKAGE_NAME, clearCachedConfig } from './util';
import console from './console';
import lint from './cli/lint';
import fix from './cli/fix';
import type { CliOptions, LintFile, LintError } from './types';

let leadName = getCLIName(name);

export default {
    getOptions,

    get version() {
        return version;
    },

    get leadName() {
        return leadName;
    },

    set leadName(value) {
        leadName = value;
    },

    resetConfig() {
        clearCachedConfig();
    },

    lint(options: CliOptions, done: (success: boolean, json: LintFile[]) => void) {
        return lint(options, done);
    },

    fix(options: CliOptions, done?: () => void) {
        return fix(options, done);
    },

    async lintText(
        text: string,
        fileName: string,
        type = 'js',
        options: Partial<CliOptions>
    ): Promise<{ success: boolean; errors: LintError[] }> {
        const silent = options.silent !== false;
        const cwd = options.cwd || findPath(PACKAGE_NAME, fileName);
        const opts = {
            ...options,
            ...this.getOptions(),
            _: [fileName],
            cwd,
            stream: getTextStream(text, fileName, cwd),
            silent,
            time: false,
            color: false,
            type
        };

        return new Promise(resolve =>
            this.lint(opts, (success, results) => {
                resolve({ success, errors: results?.[0]?.errors || [] });
            }));
    },

    async fixText(
        text: string,
        fileName: string,
        type = 'js',
        options: Partial<CliOptions> = {}
    ): Promise<string | null> {
        const silent = options.silent !== false;
        const cwd = options.cwd || findPath(PACKAGE_NAME, fileName);
        const opts = {
            ...options,
            ...this.getOptions(),
            _: [fileName],
            cwd,
            stream: getTextStream(text, fileName, cwd),
            silent,
            time: false,
            color: false,
            type,
            replace: false
        } as CliOptions;

        if (silent) {
            console.log = () => void 0;
        }

        return new Promise(resolve => {
            const stream = this.fix(opts);
            let content = null;
            stream.once('data', file => {
                content = file.contents.toString();
            });
            stream.once('end', () => {
                resolve(content);
            });
            stream.once('error', () => {
                resolve(null);
            });
        });
    }
};
