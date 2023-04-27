import { COLOR_PATTERN } from './const';

export default {
    'form': {
        properties: {
            'report-submit': {
                type: 'boolean'
            },
            'report-submit-timeout': {
                type: 'number'
            },
            'bindsubmit': {
                type: 'string'
            },
            'bindreset': {
                type: 'string'
            }
        }
    },
    'button': {
        properties: {
            'size': {
                type: 'string',
                enum: ['default', 'mini']
            },
            'type': {
                type: 'string',
                enum: ['primary', 'default', 'warn']
            },
            'plain': {
                type: 'boolean'
            },
            'disabled': {
                type: 'boolean'
            },
            'loading': {
                type: 'boolean'
            },
            'form-type': {
                type: 'string',
                enum: ['submit', 'reset']
            },
            'open-type': {
                type: 'string',
                enum: ['contact', 'share', 'getPhoneNumber', 'getUserInfo', 'launchApp', 'openSetting', 'feedback']
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
            'lang': {
                type: 'string',
                enum: ['en', 'zh_CN', 'zh_TW']
            },
            'session-from': {
                type: 'string'
            },
            'send-message-title': {
                type: 'string'
            },
            'send-message-path': {
                type: 'string'
            },
            'send-message-img': {
                type: 'string'
            },
            'app-parameter': {
                type: 'string'
            },
            'show-message-card': {
                type: 'boolean'
            },
            'bindgetuserinfo': {
                type: 'string'
            },
            'bindcontact': {
                type: 'string'
            },
            'bindgetphonenumber': {
                type: 'string'
            },
            'binderror': {
                type: 'string'
            },
            'bindopensetting': {
                type: 'string'
            },
            'bindlaunchapp': {
                type: 'string'
            }
        }
    },
    'checkbox': {
        properties: {
            value: {
                type: 'string'
            },
            disabled: {
                type: 'boolean'
            },
            checked: {
                type: 'boolean'
            },
            color: {
                type: 'string',
                pattern: COLOR_PATTERN
            }
        }
    },
    'checkbox-group': {
        properties: {
            bindchange: {
                type: 'string'
            }
        }
    },
    'editor': {
        properties: {
            'read-only': {
                type: 'boolean'
            },
            'placeholder': {
                type: 'string'
            },
            'show-img-size': {
                type: 'boolean'
            },
            'show-img-toolbar': {
                type: 'boolean'
            },
            'show-img-resize': {
                type: 'boolean'
            },
            'bindready': {
                type: 'string'
            },
            'bindfocus': {
                type: 'string'
            },
            'bindblur': {
                type: 'string'
            },
            'bindinput': {
                type: 'string'
            },
            'bindstatuschange': {
                type: 'string'
            },
        }
    },
    'input': {
        properties: {
            'value': {
                type: 'string'
            },
            'type': {
                type: 'string',
                enum: ['text', 'number', 'idcard', 'digit']
            },
            'password': {
                type: 'boolean'
            },
            'placeholder': {
                type: 'string'
            },
            'placeholder-style': {
                type: 'string'
            },
            'placeholder-class': {
                type: 'string'
            },
            'disabled': {
                type: 'boolean'
            },
            'maxlength': {
                type: 'string'
            },
            'cursor-spacing': {
                type: 'number'
            },
            'auto-focus': {
                type: 'boolean',
                deprecated: true
            },
            'focus': {
                type: 'boolean'
            },
            'confirm-type': {
                type: 'string',
                enum: ['send', 'search', 'next', 'go', 'done']
            },
            'always-embed': {
                type: 'boolean'
            },
            'confirm-hold': {
                type: 'boolean'
            },
            'cursor': {
                type: 'number'
            },
            'selection-start': {
                type: 'number'
            },
            'selection-end': {
                type: 'number'
            },
            'adjust-position': {
                type: 'boolean'
            },
            'hold-keyboard': {
                type: 'boolean'
            },
            'bindinput': {
                type: 'string'
            },
            'bindfocus': {
                type: 'string'
            },
            'bindblur': {
                type: 'string'
            },
            'bindconfirm': {
                type: 'string'
            },
            'bindkeyboardheightchange': {
                type: 'string'
            },
        },
        required: ['value']
    },
    'label': {
        properties: {
            for: {
                type: 'string'
            },
        }
    },
    'picker': {
        properties: {
            'header-text': {
                type: 'string'
            },
            'mode': {
                type: 'string',
                enum: ['selector', 'multiSelector', 'time', 'date', 'region']
            },
            'disabled': {
                type: 'boolean'
            },
            'bindcancel': {
                type: 'string'
            },
        }
    },
    'picker-view': {
        properties: {
            'value': {
                type: 'array',
                items: { type: 'number' },
            },
            'indicator-style': {
                type: 'string',
            },
            'indicator-class': {
                type: 'string'
            },
            'mask-style': {
                type: 'string'
            },
            'mask-class': {
                type: 'string'
            },
            'bindchange': {
                type: 'string'
            },
            'bindpickstart': {
                type: 'string'
            },
            'bindpickend': {
                type: 'string'
            },
        }
    },
    'picker-view-column': {
        properties: {}
    },
    'radio': {
        properties: {
            value: {
                type: 'string'
            },
            checked: {
                type: 'boolean',
            },
            disabled: {
                type: 'boolean'
            },
            color: {
                type: 'string',
                pattern: COLOR_PATTERN
            },
        }
    },
    'radio-group': {
        properties: {
            bindchange: {
                type: 'string'
            },
        }
    },
    'slider': {
        properties: {
            'min': {
                type: 'number'
            },
            'max': {
                type: 'number'
            },
            'step': {
                type: 'number',
                minimum: 1
            },
            'disabled': {
                type: 'boolean'
            },
            'value': {
                type: 'number'
            },
            'color': {
                type: 'string',
                pattern: COLOR_PATTERN
            },
            'selected-color': {
                type: 'string',
                pattern: COLOR_PATTERN
            },
            'activeColor': {
                type: 'string',
                pattern: COLOR_PATTERN
            },
            'backgroundColor': {
                type: 'string',
                pattern: COLOR_PATTERN
            },
            'block-size': {
                type: 'number',
                minimum: 12,
                maximum: 28
            },
            'block-color': {
                type: 'string',
                pattern: COLOR_PATTERN
            },
            'show-value': {
                type: 'boolean'
            },
            'bindchange': {
                type: 'string'
            },
            'bindchanging': {
                type: 'string'
            }
        }
    },
    'switch': {
        properties: {
            checked: {
                type: 'boolean'
            },
            disabled: {
                type: 'boolean'
            },
            type: {
                type: 'string'
            },
            color: {
                type: 'string',
                pattern: COLOR_PATTERN
            },
            bindchange: {
                type: 'string'
            }
        }
    },
    'textarea': {
        properties: {
            'value': {
                type: 'string'
            },
            'placeholder': {
                type: 'string'
            },
            'placeholder-style': {
                type: 'string'
            },
            'placeholder-class': {
                type: 'string',
            },
            'disabled': {
                type: 'boolean'
            },
            'maxlength': {
                type: 'number'
            },
            'auto-focus': {
                type: 'boolean'
            },
            'focus': {
                type: 'boolean'
            },
            'auto-height': {
                type: 'boolean'
            },
            'fixed': {
                type: 'boolean'
            },
            'cursor-spacing': {
                type: 'number'
            },
            'cursor': {
                type: 'number'
            },
            'show-confirm-bar': {
                type: 'boolean'
            },
            'selection-start': {
                type: 'number'
            },
            'selection-end': {
                type: 'number'
            },
            'adjust-position': {
                type: 'boolean'
            },
            'hold-keyboard': {
                type: 'boolean'
            },
            'disable-default-padding': {
                type: 'boolean'
            },
            'bindfocus': {
                type: 'string'
            },
            'bindblur': {
                type: 'string'
            },
            'bindlinechange': {
                type: 'string'
            },
            'bindinput': {
                type: 'string'
            },
            'bindconfirm': {
                type: 'string'
            },
            'bindkeyboardheightchange': {
                type: 'string'
            }
        }
    },
};
