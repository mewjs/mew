import fetch from 'node-fetch';

import console from '../console';
import { Severity } from '../util';
import { version } from '../../package.json';
import type { LintResult } from '../types';

interface CIParams {
    namespace: string;
    project: string;
    username?: string;
    branch?: string;
    tag?: string;
}

/**
 * 获取项目信息
 *
 * @return {CIParams}
 */
export function getCIParams(): CIParams {
    let namespace = '';
    let project = '';
    // gitlab ci
    if (process.env.CI_PROJECT_NAME && process.env.CI_PROJECT_NAMESPACE) {
        namespace = process.env.CI_PROJECT_NAMESPACE;
        project = process.env.CI_PROJECT_NAME;
    }
    else if (process.env.GIT_URL) {
        [, namespace, project] = process.env.GIT_URL.match(/[:/]([\w-]+)\/([\w-]+)(?:\.git)?$/) || [];
    }

    return {
        project,
        namespace,
        username: process.env.GITLAB_USER_LOGIN || process.env.GITLAB_USER_NAME || process.env.GIT_AUTHOR_NAME,
        branch: process.env.CI_COMMIT_BRANCH || process.env.GIT_BRANCH,
        tag: process.env.CI_COMMIT_TAG || process.env.BUILD_TAG
    };
}

/**
 * 将 mew 执行结果发送到远程 url
 *
 * @param {boolean} success 执行结果
 * @param {LintResult} result 错误信息
 * @param {number} time 检查耗时
 */
export async function ciReport(success: boolean, result: LintResult, time: number) {
    const url = process.env.CI_REPORT_URL || '';
    const fileCount = result.length;
    // 统计规则错误个数
    const rulesCount = Object.create(null);
    let errorCount = 0;
    let warningCount = 0;

    for (const { errors = [] } of result) {
        for (const { origin = { severity: 1 }, rule } of errors) {
            if (!rulesCount[rule]) {
                rulesCount[rule] = 0;
            }
            rulesCount[rule] += 1;

            const severity = (origin.severity === Severity.ERROR || origin.severity === 'error')
                ? Severity.ERROR
                : Severity.WARN;

            if (severity === Severity.ERROR) {
                errorCount++;
            }
            else {
                warningCount++;
            }
        }
    }
    const body = {
        ...getCIParams(),
        mewVersion: version,
        code: success ? 0 : 1,
        errors: errorCount,
        warnings: warningCount,
        rules: rulesCount,
        files: fileCount,
        time
    };

    try {
        const controller = new AbortController();
        /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
        setTimeout(() => controller.abort(), 1500);

        await fetch(url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // node-fetch 版本的 signal 定义不匹配
                // @ts-expect-error
                signal: controller.signal,
                body: JSON.stringify(body)
            });
    }
    catch (e) {
        console.warn(`mew report lint result error: ${ e.message }`);
    }
}
