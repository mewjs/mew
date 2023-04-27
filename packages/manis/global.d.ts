declare namespace NodeJS {
    interface ProcessEnv {

        /**
         * 非 Windows 的用户目录
         */
        HOME?: string;

        /**
         * Windows 的用户目录
         */
        USERPROFILE: string;


        /**
         * 用户驱动盘
         */
        HOMEDRIVE: string;

        /**
         * 用户目录路径
         */
        HOMEPATH: string;


        /**
         * 登录用户
         */
        LOGNAME: string;

        /**
         * 登录用户
         */
        USER: string;

        /**
         * 登录用户
         */
        LNAME: string;

        /**
         * 登录用户
         */
        USERNAME: string;
    }
}
