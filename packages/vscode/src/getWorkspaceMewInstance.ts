import * as path from 'path';
import { Files } from 'vscode-languageserver/node';

import { IS_DEBUG } from './const';
import loadNodeModule from './lib/loadNodeModule';
import logger from './lib/logger';

const MEW_PACKAGE_NAME = '@mewjs/cli';

function tracer(message: string): void {
    IS_DEBUG && logger.log(message);
}

function expectMessage(path: string) {
    return `Mew not found in debug path: ${ path }, please install ${ MEW_PACKAGE_NAME } via `
    + `\`npm install ${ MEW_PACKAGE_NAME }\` or \`yarn add ${ MEW_PACKAGE_NAME }\``;
}

export async function getWorkspaceMewPath(workspaceRoot: string, nodePath: string = null) {
    let mewModulePath = null;
    // 优先查找指定 nodePath 目录的 mew
    if (nodePath) {
        tracer(`nodePath:${ nodePath }`);

        try {
            mewModulePath = await Files.resolve(MEW_PACKAGE_NAME, nodePath, nodePath, tracer);
        }
        catch (e) {
            IS_DEBUG && logger.log(expectMessage(nodePath));
        }
    }

    // 其次查找 当前工作目录的 mew
    if (!mewModulePath) {
        tracer(`workspace:${ workspaceRoot }`);

        try {
            mewModulePath = await Files.resolve(MEW_PACKAGE_NAME, workspaceRoot, workspaceRoot, tracer);
        }
        catch (e) {
            IS_DEBUG && logger.log(expectMessage(workspaceRoot));
        }
    }

    // global npm
    if (!mewModulePath) {
        const nodePath = Files.resolveGlobalNodePath(tracer);
        tracer(`globalNpmPath:${ nodePath }`);

        try {
            mewModulePath = await Files.resolve(MEW_PACKAGE_NAME, nodePath, workspaceRoot, tracer);
        }
        catch (e) {
            IS_DEBUG && logger.log(expectMessage(nodePath));
        }
    }

    // global yarn
    if (!mewModulePath) {
        nodePath = Files.resolveGlobalYarnPath(tracer);
        tracer(`globalYarnPath:${ nodePath }`);

        try {
            mewModulePath = await Files.resolve(MEW_PACKAGE_NAME, nodePath, workspaceRoot, tracer);
        }
        catch (e) {
            IS_DEBUG && logger.log(expectMessage(nodePath));
        }
    }

    // local debug
    if (!mewModulePath && IS_DEBUG) {
        nodePath = path.dirname(__dirname);

        try {
            mewModulePath = await Files.resolve(MEW_PACKAGE_NAME, nodePath, nodePath, tracer);
        }
        catch (e) {
            IS_DEBUG
                && logger.log(expectMessage(nodePath));
        }
    }

    return mewModulePath;
}

/**
 * 获取适用于工作目录的mew实例
 *
 * @param workspaceRoot 工作目录根目录
 * @param nodePath 指定的 mew 加载使用的 nodePath
 */
export default async function getWorkspaceMewInstance(workspaceRoot: string, nodePath: string = null): Promise<any> {
    const mewModulePath = await getWorkspaceMewPath(workspaceRoot, nodePath);
    if (!mewModulePath) {
        return null;
    }

    logger.log(`Node Version: ${ process.version }`);
    const mewInstance: { default: any } = loadNodeModule(mewModulePath);
    const mew = mewInstance ? (mewInstance.default || mewInstance) : null;
    if (mew) {
        logger.log(`Mew Version: ${ mew.version }`);
        logger.log(`Mew Path: ${ mewModulePath }`);
    }
    else {
        logger.log(expectMessage(nodePath));
    }
    return mew;
}
