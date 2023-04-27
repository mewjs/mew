import { type JsonObject } from 'type-fest';
import type { LoadOptions } from 'js-yaml';

/* eslint-disable-next-line @typescript-eslint/no-type-alias */
export type Config = JsonObject;

export type Loader = (content: string, path: string, options?: LoadOptions) => Config;

export type Stopper = (start: string, root: string, times: number) => boolean;

export type Getter = string | ((config: Config) => Config | undefined);

export type ConfigType = 'userConfig' | 'defaultConfig';

export interface FinderOptions {

    /**
     * 搜索的文件名
     *
     * @type {string}
     * @default package.json
     */
    name: string;

    /**
     * 搜索文件编码
     *
     * @type {BufferEncoding}
     * @default utf-8
     */
    charset?: BufferEncoding;

    /**
     * 是否缓存结果
     *
     * @type {boolean}  是否缓存结果
     */
    cache?: boolean;


    /**
     * 最终返回的字段名或自定义的方式
     *
     * @type {Getter}
     */
    get?: Getter;

    /**
     * 自定义的加载、解释配置文件方法
     *
     * @param {Loader?} options.loader 自定义的加载、解释配置文件方法
     */
    loader?: Loader;
}

export interface IFinder extends FinderOptions {
    cached?: {
        [key: string]: Config;
    };
    from(where: string): Config;
    load(path: string): Config;
    clear(): void;
}

export interface IManis {
    userConfig: Config;
    defaultConfig: Config;
    finders: IFinder[];
}

export interface Helper {
    setConfig(
        manis: IManis,
        dataType: ConfigType,
        pathOrValue: string | JsonObject,
        finderOptions?: Partial<FinderOptions>
    ): void;
}


export interface ManisOptions {

    /**
     * 搜索的文件名
     *
     * @default ['package.json']
     */
    files: string[] | string | Partial<FinderOptions>[] | Partial<FinderOptions>;

    /**
     * 最终返回的字段名或自定义的方式
     *
     * @see FinderOptions
     * @type {Getter}
     */
    get?: Getter;

    /**
     * 是否缓存结果
     *
     * @default true
     */
    cache: boolean;

    /**
     * 搜索多个文件时是否合并配置
     *
     * @default true
    */
    merge: boolean;

    /**
     * 是否向上查找所有配置文件
     *
     * @default true
     */
    lookup: boolean;

    /**
     * 是否使用唯一的配置文件
     *
     * @default false
     */
    orphan: boolean;

    /**
     * 根节点名称
     *
     * @default 'root'
     */
    rootName: string;

    /**
     * 是否根节点（不再向上查找配置文件）
     *
     * @default false
     */
    enableRoot: boolean;

    /**
     * 自定义的停止查找配置文件的方法
     */
    stopper?: Stopper;

    /**
     * 自定义的加载、解释配置文件方法
     */
    loader?: Loader;
}
