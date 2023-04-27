import { statSync } from 'fs';
import { resolve, dirname } from 'path';
import EventEmitter from 'events';
import { load, loadAll, dump } from 'js-yaml';

import Finder from './finder';
import {
    typeOf,
    extend,
    mix,
    pick,
    findUp,
    homeDirectory,
    defaultLoader
} from './util';
import type {
    ConfigType,
    Config,
    Helper,
    IFinder,
    IManis,
    FinderOptions,
    ManisOptions
} from './types';

const helper: Helper = {

    /**
     * 设置默认值
     * 默认值优先级最低
     *
     * @param manis Manis 实例
     * @param dataType 配置的类型，defaultConfig | userConfig
     * @param pathOrValue 默认的配置文件路径或默认值
     * @param finderOptions 用于查找默认配置的 finder 的配置
     */
    setConfig(
        manis: IManis,
        dataType: ConfigType,
        pathOrValue: string | Config,
        finderOptions?: Partial<FinderOptions>
    ) {
        if (typeof pathOrValue !== 'string') {
            manis[dataType] = mix(manis[dataType] as Config, pathOrValue);
            return;
        }

        const match = (pathOrValue as string).match(/^(.*[/\\])([^/\\]+)$/);
        if (!match) {
            throw new Error('Invalid path.');
        }

        let finder: IFinder | undefined;
        const name = match[2];


        if (finderOptions && typeOf(finderOptions) === 'object') {
            finder = new Finder({ ...finderOptions, name });
        }
        else {
            finder = manis.finders.find(finder => finder.name.toLowerCase() === name);

            if (finder) {
                finder = Object.create(finder);
            }
            else {
                finder = new Finder({ name });
            }

        }

        manis[dataType] = mix(manis[dataType], finder!.from(match[1]));
    }
};

/**
 * Manis
 */
export default class Manis extends EventEmitter implements IManis {
    static yaml = { load, loadAll, dump };
    static loader = defaultLoader;

    options: ManisOptions;
    finders: IFinder[];
    cached?: Record<string, Config | undefined>;
    defaultConfig: Config;
    userConfig: Config;

    constructor(name: string, commonOptions?: Partial<ManisOptions>);
    constructor(names: string[], commonOptions?: Partial<ManisOptions>);
    constructor(option: Partial<FinderOptions>, commonOptions?: Partial<ManisOptions>);
    constructor(options: Partial<FinderOptions>[], commonOptions?: Partial<ManisOptions>);
    constructor(
        nameOrOptions: Partial<FinderOptions> | Partial<ManisOptions>[] | string | string[],
        commonOptions: Partial<ManisOptions> = {}
    ) {
        super();
        let options: ManisOptions = {
            files: 'package.json',
            cache: true,
            merge: true,
            lookup: true,
            orphan: false,
            rootName: 'root',
            enableRoot: false
        };

        if (Array.isArray(nameOrOptions)) {
            nameOrOptions = { files: nameOrOptions } as Partial<ManisOptions>;
        }
        else if (!(nameOrOptions as Partial<ManisOptions>).files) {
            nameOrOptions = { files: [nameOrOptions] } as Partial<ManisOptions>;
        }

        options = this.options = {
            ...options,
            ...commonOptions,
            ...(nameOrOptions as Partial<ManisOptions>)
        };

        const { files } = options;
        if (!Array.isArray(files)) {
            if (typeof files === 'string') {
                options.files = [files as string];
            }
            else {
                options.files = [files as Partial<FinderOptions>];
            }
        }

        this.finders = (Array.isArray(options.files) ? options.files : [options.files]).map(
            (file: string | Partial<FinderOptions>) =>
                Finder.create(file, options.cache, options.loader)
        );

        this.cached = options.cache && Object.create(null);
        this.defaultConfig = Object.create(null);
        this.userConfig = Object.create(null);
    }

    /**
     * 设置默认值
     * 默认值优先级最低
     *
     * @param pathOrValue 默认的配置文件路径或默认值
     * @param finderOptions 用于查找默认配置的 finder 的配置
     */
    setDefault(pathOrValue: string | Config, finderOptions?: Partial<FinderOptions>) {
        helper.setConfig(this, 'defaultConfig', pathOrValue, finderOptions);
    }


    /**
     * 设置用户默认值
     * 用户默认值优先级高于默认值
     *
     * @public
     * @param pathOrNameOrValue 默认的配置文件路径、文件名或默认值
     * @param finderOptions 用于查找默认配置的 finder 的配置
     */
    setUserConfig(pathOrNameOrValue?: string | Config, finderOptions?: Partial<FinderOptions>) {
        if (!pathOrNameOrValue) {
            pathOrNameOrValue = this.finders[0].name;
        }

        if (typeof pathOrNameOrValue === 'string') {
            if (pathOrNameOrValue.startsWith('~') || !pathOrNameOrValue.includes('/')) {
                pathOrNameOrValue = `${ homeDirectory }/${ pathOrNameOrValue.replace(/^~/, '') }`;
            }

            pathOrNameOrValue = pathOrNameOrValue.replace(/[/\\]{2}/g, '/');
        }

        helper.setConfig(this, 'userConfig', pathOrNameOrValue, finderOptions);
    }

    /**
     * 从指定文件开始查找
     *
     * @param where 开始查找的文件
     * @return 读到的配置对象
     */
    from(where: string): Config {
        where = resolve(where);

        let stat = {
            isFile() {
                return true;
            }
        };

        try {
            stat = statSync(where);
        }
        catch (e) {}

        // 文件不存在，不管是文件还是目录都可以再向上一级
        /* istanbul ignore else */
        if (stat.isFile()) {
            where = dirname(where);
        }

        let config: Config | undefined = Object.create(null);

        if (this.cached && (config = this.cached[where])) {
            return config;
        }

        const { options: { lookup, orphan, merge, rootName, enableRoot, stopper } } = this;
        if (lookup) {

            findUp(where, dir => {
                this.emit('lookup', dir);
                let configs = this.finders.map(finder => finder.from(dir));
                let shouldStop = false;

                if (orphan) {
                    config = pick(configs);
                    shouldStop = Object.keys(config).length > 0;
                }
                else if (merge) {
                    if (enableRoot) {
                        const lastIndex = configs.findIndex(config => config[rootName]);
                        if (lastIndex > -1) {
                            configs = configs.slice(0, lastIndex + 1);
                            shouldStop = true;
                        }
                    }

                    const currentPathConfig = configs.reduceRight(
                        (init, config) => extend(init, config),
                        Object.create(null)
                    );

                    config = mix(currentPathConfig, config!);
                }
                else {
                    config = mix(pick(configs), config || Object.create(null));
                }

                return shouldStop || !lookup;
            }, stopper);

        }

        config = orphan
            ? pick([config!, this.userConfig, this.defaultConfig])
            : mix(this.defaultConfig, this.userConfig, config!);


        if (this.cached) {
            this.cached[where] = config;
        }

        return config;
    }

    clear() {
        if (!this.cached) {
            return;
        }

        this.cached = Object.create(null);
        this.finders.forEach(finder => finder.clear());
    }
}
