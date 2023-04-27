/* eslint-disable no-console */
import path from 'path';
import fs from 'fs';
import mew from '@mewjs/cli';
import * as Mew from '@mewjs/cli/lib/types';

const checkFileTypes = new Set([
    'htm',
    'html',
    'vue',
    'css',
    'less',
    'sass',
    'scss',
    'styl',
    'js',
    'es',
    'es6',
    'jsx',
    'ts',
    'tsx',
    'md',
    'markdown'
]);

/**
 * 错误等级
 *
 * @enum {number}
 */
enum Severity {
    WARN = 1,
    ERROR = 2
}


const fileFilters = new Map();

export default async function lint(
    resourcePath: string,
    cwd: string
): Promise<{ errors: string[]; warnings: string[] }> {
    if (!fileFilters.has(cwd)) {
        fileFilters.set(cwd, new Mew.FileFilter(cwd));
    }
    const fileFilter = fileFilters.get(cwd);
    if (fileFilter.isIgnored(resourcePath)) {
        return Promise.resolve({
            errors: [],
            warnings: []
        });
    }

    return new Promise(resolve => {
        fs.readFile(resourcePath, (e, data) => {
            if (e) {
                console.error(e);
                resolve({
                    errors: [],
                    warnings: []
                });
                return;
            }

            let code = String(data);
            let type = path.extname(resourcePath).slice(1);
            if (!checkFileTypes.has(type)) {
                // 非 HTML 类型文件允许出现 CSS Style 标签
                type = 'html';
                code = `<!-- htmlint-disable css-in-head, style-disabled -->\n${ code }`;
            }

            mew.lintText(code, resourcePath, type, { cwd, rule: true })
                .then(result => {
                    const errors = [] as string[];
                    const warnings = [] as string[];
                    if (Array.isArray(result.errors)) {
                        result.errors.forEach(error => {
                            const severity = (error.origin || error).severity || Severity.WARN;
                            if (severity === Severity.ERROR || severity === 'error') {
                                errors.push(error.info);
                            }
                            else if (severity === Severity.WARN || severity === 'warning') {
                                warnings.push(error.info);
                            }
                        });
                    }
                    resolve({
                        errors,
                        warnings
                    });
                })
                .catch(e => {
                    console.error(e);
                    resolve({
                        errors: [],
                        warnings: []
                    });
                });
        });
    });
}

