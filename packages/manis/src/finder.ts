import { join, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import merge from 'merge';

import { defaultLoader } from './util';
import type { Config, Getter, Loader, FinderOptions, IFinder } from './types';


export default class Finder implements IFinder {

    name = 'package.json';

    charset: BufferEncoding = 'utf-8';

    cache = true;

    cached?: Record<string, Config>;

    get?: Getter;

    loader: Loader = defaultLoader;

    constructor(options: Partial<FinderOptions>) {
        merge(this, options);

        this.cached = this.cache && Object.create(null);
        this.load = this.load.bind(this);
    }

    /**
     * 创建 Finder 实例
     *
     * @param nameOrOptions 文件名或配置对象
     * @param cache  是否缓存
     * @param loader   自定义的 loader
     * @return 根据参数创建的 Finder 实例
     */
    static create(
        nameOrOptions: string | Partial<FinderOptions>,
        cache = true,
        loader?: Loader
    ): Finder {
        let options: Partial<FinderOptions> = Object.create(null);

        if (typeof nameOrOptions === 'string') {
            options.name = nameOrOptions;
        }
        else {
            options = { ...nameOrOptions };
        }

        options.cache = 'cache' in options ? options.cache : !!cache;
        options.loader = options.loader ?? loader ?? defaultLoader;

        return new Finder(options);
    }

    /**
     * 从指定文件开始查找
     *
     * @publish
     * @param where 开始查找的目录
     * @return 读到的配置对象
     */
    from(where: string): Config {
        where = resolve(where);

        let config: Config | undefined = this.cached?.[where];

        if (config) {
            return config;
        }

        const fileName = join(where, this.name);
        config = existsSync(fileName) ? this.load(fileName) : Object.create(null);

        if (this.cached) {
            this.cached[where] = config!;
        }

        return config!;
    }

    load(path: string): Config {
        let config: Config | undefined = this.loader(readFileSync(path, this.charset), path);
        const getter = this.get;

        if (getter) {
            if (typeof this.get === 'function') {
                config = this.get(config);
            }
            else if (typeof getter === 'string') {
                config = config[getter] as Config;
            }
        }

        return config ?? {};
    }

    clear() {
        this.cached = this.cache && Object.create(null);
    }
}
