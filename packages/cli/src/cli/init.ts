import fs from 'fs';
import { join } from 'path';
import { spawn, execSync } from 'child_process';
import inquirer from 'inquirer';

import { writeConfigFile, setProperty } from '../util';
import type { Config, CliOptions } from '../types';

function isGitRepository(repoPath: string) {
    try {
        execSync('git remote', {
            cwd: repoPath,
            stdio: 'ignore',
            encoding: 'utf-8'
        });
        return true;
    }
    catch (e) {
        // do nothing
    }
    return false;
}

async function writeConfigFileWithPrompt(config: Config, fileName: string) {
    const filePath = join(process.cwd(), fileName);
    if (fs.existsSync(filePath)) {
        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: `已经存在配置文件'${ fileName }'，是否覆盖现有配置？`,
                default: false
            }
        ]);
        if (!answers.overwrite) {
            return;
        }
    }

    try {
        writeConfigFile(config, filePath);
        console.log(`write config file success to '${ filePath }'.`);
    }
    catch (e) {
        console.log('write config file failed!');
        throw e;
    }
}

function shouldUseYarn() {
    try {
        if (fs.existsSync(join(process.cwd(), 'yarn.lock'))) {
            execSync('yarn --version', { stdio: 'ignore' });
            return true;
        }
        return false;
    }
    catch (e) {
        return false;
    }
}

async function installDependencies(dependencies: string[], shouldUseYarn: boolean): Promise<true> {
    return new Promise((resolve, reject) => {
        let command: string;
        let args: string[];
        if (shouldUseYarn) {
            command = 'yarn';
            args = ['add', '--dev', ...dependencies];
        }
        else {
            command = 'npm';
            args = ['install', '--save-dev', '--loglevel', 'error', ...dependencies];
        }

        const child = spawn(command, args, { stdio: 'inherit' });
        child.on('close', code => {
            if (code === 0) {
                resolve(true);
            }
            else {
                reject(new Error(`install dependencies ${ dependencies.join() } failed`));
            }
        });
    });
}

async function configGithooks() {
    const filePath = join(process.cwd(), 'package.json');
    if (!fs.existsSync(filePath)) {
        return;
    }

    const pkg = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const dependencyKeys = [
        ...Object.keys(pkg.devDependencies || {}),
        ...Object.keys(pkg.dependencies || {}),
    ];

    const deps: string[] = [];
    if (!dependencyKeys.includes('husky')) {
        deps.push('husky');
    }
    if (!dependencyKeys.includes('lint-staged')) {
        deps.push('lint-staged');
    }

    try {
        if (deps.length > 0) {
            console.log(`git hooks dependencies '${ deps.join() }' installing...`);
            const isUseYarn = shouldUseYarn();
            await installDependencies(deps, isUseYarn);
        }

        const pkgNew = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        if (!pkgNew?.husky?.hooks?.['pre-commit']) {
            setProperty(pkgNew, ['husky', 'hooks', 'pre-commit'], 'lint-staged');
        }

        if (!pkgNew?.['lint-staged']?.['**/*.{html,less,styl,sass,scss,js,jsx,ts,tsx}']) {
            setProperty(
                pkgNew,
                ['lint-staged', '**/*.{html,less,styl,sass,scss,js,jsx,ts,tsx}'],
                pkgNew?.scripts?.lint ? 'npm run lint' : 'mew'
            );
        }

        writeConfigFile(pkgNew, filePath);
        console.log('add git hooks success');
    }
    catch (e) {
        console.error(e.message);
    }
}

/**
 * gitlab ci 脚本配置
 */
async function configGitlabCI() {
    // lerna 项目 需要分别对不同的 package 进行检查
    const isLerna = fs.existsSync(join(process.cwd(), 'lerna.json'))
        && fs.statSync(join(process.cwd(), 'packages')).isDirectory();
    const script: string[] = [];
    if (isLerna) {
        const lintCommands = fs.readdirSync(join(process.cwd(), 'packages'))
            .filter(dir => !dir.startsWith('.'))
            .map(dir => `mew-lint-diff packages/${ dir }`);

        script.push(`${ lintCommands.join(' && \\\n') }\n`);
    }
    else {
        script.push('mew-lint-diff');
    }

    const ciConfig = {
        stages: ['lint'],
        lint: {
            // TODO: real image url
            image: 'image: acr.xxx.com/library/knode-mew:latest',
            stage: 'lint',
            tags: ['lint'],
            script
        }
    };

    await writeConfigFileWithPrompt(ciConfig, '.gitlab-ci.yml');
}

type InitEnv = Record<'commonjs' | 'react' | 'mini', boolean>;

interface InitConfig extends Config {
    extends: string[];
    env: InitEnv;
    rules: Config;
}

async function processConfig(options: InitOptions) {
    const config = {
        extends: [] as string[],
        env: {},
        rules: {}
    } as InitConfig;

    if (options.moduleType === 'commonjs') {
        config.env.commonjs = true;
        config.rules['import/no-commonjs'] = 0;
        config.rules['import/unambiguous'] = 0;
    }

    // browser or nodejs
    Array.isArray(options.env) && options.env.forEach(env => {
        config.env[env] = true;
    });

    const extendConfigs = [] as string[];

    if (options.framework === 'react') {
        extendConfigs.push('plugin:@mewjs/react');
    }
    else if (options.framework === 'vue') {
        extendConfigs.push(options.typescript ? 'plugin:@mewjs/vue-typescript' : 'plugin:@mewjs/vue');
    }
    else if (options.framework === 'vue3') {
        extendConfigs.push(options.typescript ? 'plugin:@mewjs/vue3-typescript' : 'plugin:@mewjs/vue3');
    }
    else if (options.framework === 'mini') {
        extendConfigs.push(options.typescript ? 'plugin:@mewjs/miniprogram-typescript' : 'plugin:@mewjs/miniprogram');
    }

    // vue, vue3, miniprogram + typescript 单独处理
    if (options.typescript && !['vue', 'vue3', 'mini'].includes(options.framework)) {
        extendConfigs.push('plugin:@mewjs/typescript');
    }

    // 默认 esnext
    if (!extendConfigs.length) {
        extendConfigs.push('plugin:@mewjs/esnext');
    }

    if (!Object.keys(config.env).length) {
        // delete config.env;
    }

    if (!Object.keys(config.rules).length) {
        // delete config.rules;
    }

    config.extends = extendConfigs;

    await writeConfigFileWithPrompt(config, `.eslintrc.${ options.format }`);

    if (options.gitlabci) {
        await configGitlabCI();
    }

    if (options.hooks) {
        await configGithooks();
    }
}

interface InitOptions {
    moduleType: string;
    env?: string | string[];
    css?: string | string[];
    framework: string;
    typescript: boolean;
    format: string;
    gitlabci: boolean;
    hooks: boolean;
    isGitRepo: boolean;
}

/**
 * 处理命令
 *
 * @param {Object} options yargs 处理后的 cli 参数
 */
export function run(options: CliOptions | InitOptions) {

    // 使用命令行模式生成配置
    if (process.argv.length > 3) {
        if (options.moduleType === 'import/export') {
            options.moduleType = 'esm';
        }
        else if (options.moduleType === 'require/exports') {
            options.moduleType = 'commonjs';
        }

        const { env = [], css = [] } = options;
        options.env = typeof env === 'string' ? env.split(',') : env;
        options.css = typeof css === 'string' ? css.split(',') : css;

        processConfig(options as InitOptions);
        return;
    }

    const promptOptions = {
        framework: 'react',
        isGitRepo: isGitRepository(process.cwd())
    } as Partial<InitOptions>;

    // 使用问答模式生成配置
    inquirer.prompt([
        {
            type: 'list',
            name: 'moduleType',
            message: '选择项目使用的模块定义？',
            default: 'esm',
            choices: [
                { name: 'JavaScript modules (import/export)', value: 'esm' },
                { name: 'CommonJS (require/exports)', value: 'commonjs' },
                { name: '没有使用模块定义（老项目）', value: 'none' }
            ]
        },
        {
            type: 'list',
            name: 'framework',
            message: '选择项目使用的框架？',
            default: 'react',
            choices: [
                { name: 'React', value: 'react' },
                { name: 'Vue', value: 'vue' },
                { name: 'Vue3', value: 'vue3' },
                { name: 'Taro', value: 'react' },
                { name: 'uni-app', value: 'vue' },
                { name: 'MiniProgram', value: 'mini' },
                { name: '其他', value: 'none' }
            ],
            filter(framework) {
                promptOptions.framework = framework;
                return framework;
            }
        },
        {
            type: 'confirm',
            name: 'typescript',
            message: '是否使用了 Typescript',
            default: false
        },
        {
            type: 'checkbox',
            name: 'env',
            message: '选择项目运行环境?',
            get default() {
                const { framework = 'react' } = promptOptions;
                if (framework === 'none') {
                    return ['node'];
                }
                if (framework === 'mini') {
                    return ['mini/env'];
                }
                return ['browser'];
            },
            choices: [
                { name: 'Browser', value: 'browser' },
                { name: 'Node', value: 'node' },
                { name: 'MiniProgram', value: 'mini/globals' }
            ]
        },
        {
            type: 'list',
            name: 'format',
            message: '请选择使用的配置文件格式?',
            default: 'js',
            choices: ['js', 'yaml', 'json']
        },
        {
            type: 'confirm',
            name: 'gitlabci',
            message: '是否添加 gitlab 代码扫描?',
            default: true
        },
        {
            type: 'confirm',
            name: 'hooks',
            message: '是否添加 git hooks?',
            default: true,
            when() {
                return promptOptions.isGitRepo;
            }
        },
    ])
        .then(processConfig);
}

export default run;
