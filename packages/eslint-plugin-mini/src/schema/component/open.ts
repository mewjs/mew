//  https://developers.weixin.qq.com/miniprogram/dev/component/ad.html
export default {
    'ad': {
        properties: {
            'unit-id': {
                type: 'string'
            },
            'ad-intervals': {
                type: 'number'
            },
            'ad-type': {
                type: 'string'
            },
            'ad-theme': {
                type: 'string'
            },
            'bindload': {
                type: 'string'
            },
            'binderror': {
                type: 'string'
            },
            'bindclose': {
                type: 'string'
            }
        }
    },
    'ad-custom': {
        properties: {
            'unit-id': {
                type: 'string'
            },
            'ad-intervals': {
                type: 'number'
            },
            'bindload': {
                type: 'string'
            },
            'binderror': {
                type: 'string'
            }
        }
    },
    'official-account': {
        properties: {
            bindload: {
                type: 'string'
            },
            binderror: {
                type: 'string'
            }
        }
    },
    'detail': {
        properties: {
            status: {
                type: 'number',
                /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
                enum: [-2, -1, 0, 1, 2, 3, 4, 5, 6]
            },
            errMsg: {
                type: 'string'
            }
        }
    },
    'open-data': {
        properties: {
            'type': {
                type: 'string',
                enum: [
                    'groupName',
                    'userNickName',
                    'userAvatarUrl',
                    'userGender',
                    'userCity',
                    'userProvince',
                    'userCountry',
                    'userLanguage'
                ]
            },
            'open-gid': {
                type: 'string'
            },
            'lang': {
                type: 'string',
                enum: ['en', 'zh_CN', 'zh_TW']
            },
            'default-text': {
                type: 'string'
            },
            'default-avatar': {
                type: 'string'
            },
            'binderror': {
                type: 'string'
            }
        }
    },
    'web-view': {
        properties: {
            src: {
                type: 'string'
            },
            bindmessage: {
                type: 'string'
            },
            bindload: {
                type: 'string'
            },
            binderror: {
                type: 'string'
            }
        }
    }
};
