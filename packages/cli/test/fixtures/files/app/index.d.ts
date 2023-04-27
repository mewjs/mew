/**
 * @file type script define
 */
import './typing.d';

declare  module 'app' {

    export interface MewOptions {
        _: string[];
        string?: string;
        type?: string;
        color?: boolean;
        lookup?: boolean;
        silent?: boolean;
        rule?: boolean;
        time?: boolean;
    }

    /**
     * 错误等级
     */
    export enum Severity {

        /**
         * warning
         */
        WARN = 1,

        /**
         * error
         */
        ERROR = 2
    }
}
