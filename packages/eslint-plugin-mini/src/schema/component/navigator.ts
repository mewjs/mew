import { COLOR_PATTERN_HEX } from './const';

export default {
    'navigator': {
        properties: {
            'target': {
                type: 'string',
                enum: ['self', 'miniProgram']
            },
            'url': {
                type: 'string'
            },
            'open-type': {
                type: 'string',
                enum: ['navigate', 'redirect', 'switchTab', 'reLaunch', 'navigateBack', 'exit']
            },
            'delta': {
                type: 'number'
            },
            'app-id': {
                type: 'string'
            },
            'path': {
                type: 'string'
            },
            'extra-data': {
                type: 'object'
            },
            'version': {
                type: 'string',
                enum: ['develop', 'trial', 'release']
            },
            'hover-class': {
                type: 'string'
            },
            'hover-stop-propagation': {
                type: 'boolean'
            },
            'hover-start-time': {
                type: 'number'
            },
            'hover-stay-time': {
                type: 'number'
            },
            'bindsuccess': {
                type: 'string'
            },
            'bindfail': {
                type: 'string'
            },
            'bindcomplete': {
                type: 'string'
            }
        }
    },
    'functional-page-navigator': {
        properties: {
            version: {
                type: 'string',
                enum: ['develop', 'trial', 'release']
            },
            name: {
                type: 'string',
                enum: ['loginAndGetUserInfo', 'requestPayment', 'chooseAddress']
            },
            args: {
                type: 'object'
            },
            bindsuccess: {
                type: 'string'
            },
            bindfail: {
                type: 'string'
            },
            bindcancel: {
                type: 'string'
            }
        }
    },
    'navigation-bar': {
        properties: {
            'title': {
                type: 'string'
            },
            'loading': {
                type: 'boolean'
            },
            'front-color': {
                type: 'string',
                enum: ['#ffffff', '#000000', '#fff', '#000']
            },
            'background-color': {
                type: 'string',
                pattern: COLOR_PATTERN_HEX
            },
            'color-animation-duration': {
                type: 'number'
            },
            'color-animation-timing-func': {
                type: 'string',
                enum: ['linear', 'easeIn', 'easeOut', 'easeInOut']
            }
        }
    }
};
