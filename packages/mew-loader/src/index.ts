/* eslint-disable @typescript-eslint/no-var-requires, no-console, prefer-template */
import path from 'path';
import loaderUtils from 'loader-utils';
import glob from 'resolve-glob';

const cwdBaseDir = process.cwd();

// 主版本大于 12 开启 worker 模式
/* eslint-disable-next-line arrow-body-style */
const lint = (majorVersion => {
    return process.env.MEW_ENV !== 'noworker' && majorVersion >= 12
        ? require('./worker')
        : require('./lint').default;
})(+(process.version.match(/^v(\d+)\./) || [])[1]);

let excludeFiles: string[];

export function pitch(this: any) {
    const { resourcePath } = this;
    if (/node_modules/.test(resourcePath)) {
        return;
    }
    let excluded = false;
    // match webpack4
    const webpackConfOpt = this.options || {};
    const options = {
        failOnError: true,
        failOnWarning: false,
        silent: false,
        ...(webpackConfOpt.mew || {}),
        ...(loaderUtils.getOptions(this) || {})
    };

    const judgeAndContinue = () => {
        if (excludeFiles?.includes(resourcePath)) {
            excluded = true;
        }
    };

    if (typeof options?.exclude === 'string') {
        if (excludeFiles) {
            judgeAndContinue();
        }
        else {
            const exclude = options.exclude.split(',');
            // 缓存排除文件列表
            excludeFiles = glob.sync(exclude);
            judgeAndContinue();
        }
    }

    if (excluded) {
        return;
    }

    // 设置 mew lint 相关选项
    this.data.mew = {
        options,
        lint: lint(resourcePath, this.rootContext)
    };
}

export default function mewLoader(this: any, resource, map) {
    const { resourcePath, resourceQuery, emitError } = this;
    if (!this.data.mew || resourceQuery) {
        return resource;
    }

    // 利用缓存来提高效率
    this.cacheable();

    const resolve = this.async();
    const { options, lint } = this.data.mew;

    delete this.data.mew;

    lint
        .then(({ errors, warnings }) => {
            if (!options.silent) {
                console.log(
                    '\nmew',
                    errors.length ? '\x1b[31mlint\x1b[0m' : '\x1b[32mlint\x1b[0m',
                    path.relative(cwdBaseDir, resourcePath),
                    `(${ errors.length } error${ errors.length > 1 ? 's' : '' }, `
                    + `${ warnings.length } warning${ warnings.length > 1 ? 's' : '' })`
                );
            }

            if ((options.failOnError && errors.length) || (options.failOnWarning && warnings.length)) {
                emitError(new Error('Module failed because of mew '
                    + ((options.failOnError && errors.length) ? 'error' : 'warning')
                    + '.\n'
                    + errors.concat(warnings).join('\n')));
                // resource = '';
            }
            resolve(null, resource, map);
        })
        .catch(e => {
            resolve(e);
        });
}
