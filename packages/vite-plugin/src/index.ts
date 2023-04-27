import type { Plugin } from 'vite';
import { createFilter } from '@rollup/pluginutils';
import pkg from '../package.json';
import lint from './lint';

import type { Options } from './utils';
import { checkVueFile, normalizePath } from './utils';

export default function mewPlugin(options: Options = {}): Plugin {
    const defaultOptions: Options = {
        cache: true,
        fix: false,
        include: [
            'src/**/*.js',
            'src/**/*.jsx',
            'src/**/*.ts',
            'src/**/*.tsx',
            'src/**/*.vue',
        ],
        throwOnWarning: true,
        throwOnError: true,
    };
    const opts = { ...defaultOptions, ...options };

    const filter = createFilter(opts.include, opts.exclude || /node_modules/);

    return {
        name: `${ pkg.name }@${ pkg.version }`,
        async transform(_, id) {
            const file = normalizePath(id);

            if (!filter(id) || checkVueFile(id)) {
                return null;
            }

            const { errors, warnings } = await lint(file, process.cwd());
            const hasWarnings = opts.throwOnWarning && warnings.length;
            const hasErrors = opts.throwOnError && errors.length;

            if (hasWarnings) {
                this.warn(`\n${ warnings.join('\n') }`);
            }

            if (hasErrors) {
                this.error(`\n${ errors.join('\n') }`);
            }

            return null;
        },
    };
}
