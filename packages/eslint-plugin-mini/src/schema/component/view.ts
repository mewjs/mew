import { COLOR_PATTERN } from './const';

// https://developers.weixin.qq.com/miniprogram/dev/component/cover-image.html
export default {
    'cover-image': {
        properties: {
            src: {
                type: 'string',
            },
            bindload: {
                type: 'string'
            },
            binderror: {
                type: 'string'
            }
        }
    },
    'cover-view': {
        properties: {
            'scroll-top': {
                oneOf: [{ type: 'number' }, { type: 'string' }]
            }
        }
    },
    'match-media': {
        properties: {
            'min-width': {
                type: 'number'
            },
            'max-width': {
                type: 'number'
            },
            'width': {
                type: 'number'
            },
            'min-height': {
                type: 'number'
            },
            'max-height': {
                type: 'number'
            },
            'height': {
                type: 'number'
            },
            'orientation': {
                type: 'string',
                enum: ['landscape', 'portrait']
            }
        }
    },
    'movable-area': {
        properties: {
            'scale-area': {
                type: 'boolean'
            }
        }
    },
    'movable-view': {
        properties: {
            'direction': {
                type: 'string',
                enum: ['none', 'all', 'vertical', 'horizontal']
            },
            'inertia': {
                type: 'boolean'
            },
            'out-of-bounds': {
                type: 'boolean'
            },
            'x': {
                type: 'number'
            },
            'y': {
                type: 'number'
            },
            'damping': {
                type: 'number'
            },
            'friction': {
                type: 'number'
            },
            'disabled': {
                type: 'boolean'
            },
            'scale': {
                type: 'boolean'
            },
            'scale-min': {
                type: 'number'
            },
            'scale-max': {
                type: 'number'
            },
            'scale-value': {
                type: 'number',
                minimum: 0.5,
                maximum: 10,
            },
            'animation': {
                type: 'boolean'
            },
            'bindchange': {
                type: 'string'
            },
            'bindscale': {
                type: 'string'
            },
            'htouchmove': {
                type: 'string'
            },
            'vtouchmove': {
                type: 'string'
            }
        }
    },
    'scroll-view': {
        properties: {
            'scroll-x': {
                type: 'boolean'
            },
            'scroll-y': {
                type: 'boolean'
            },
            'upper-threshold': {
                oneOf: [{ type: 'number' }, { type: 'string' }]
            },
            'lower-threshold': {
                oneOf: [{ type: 'number' }, { type: 'string' }]
            },
            'scroll-top': {
                oneOf: [{ type: 'number' }, { type: 'string' }]
            },
            'scroll-left': {
                oneOf: [{ type: 'number' }, { type: 'string' }]
            },
            'scroll-into-view': {
                type: 'string'
            },
            'scroll-with-animation': {
                type: 'boolean'
            },
            'enable-back-to-top': {
                type: 'boolean'
            },
            'enable-flex': {
                type: 'boolean'
            },
            'scroll-anchoring': {
                type: 'boolean'
            },
            'refresher-enabled': {
                type: 'boolean'
            },
            'refresher-threshold': {
                type: 'number'
            },
            'refresher-default-style': {
                type: 'string',
                enum: ['none', 'black', 'white']
            },
            'refresher-background': {
                type: 'string',
                pattern: COLOR_PATTERN
            },
            'refresher-triggered': {
                type: 'boolean'
            },
            'enhanced': {
                type: 'boolean'
            },
            'bounces': {
                type: 'boolean'
            },
            'show-scrollbar': {
                type: 'boolean'
            },
            'paging-enabled': {
                type: 'boolean'
            },
            'fast-deceleration': {
                type: 'boolean'
            },
            'binddragstart': {
                type: 'string'
            },
            'binddragging': {
                type: 'string'
            },
            'binddragend': {
                type: 'string'
            },
            'bindscrolltoupper': {
                type: 'string'
            },
            'bindscrolltolower': {
                type: 'string'
            },
            'bindscroll': {
                type: 'string'
            },
            'bindrefresherpulling': {
                type: 'string'
            },
            'bindrefresherrefresh': {
                type: 'string'
            },
            'bindrefresherrestore': {
                type: 'string'
            },
            'bindrefresherabort': {
                type: 'string'
            }
        }
    },
    'swiper': {
        properties: {
            'indicator-dots': {
                type: 'boolean'
            },
            'indicator-color': {
                type: 'string',
                pattern: COLOR_PATTERN
            },
            'indicator-active-color': {
                type: 'string',
                pattern: COLOR_PATTERN
            },
            'autoplay': {
                type: 'boolean'
            },
            'current': {
                type: 'number'
            },
            'interval': {
                type: 'number'
            },
            'duration': {
                type: 'number'
            },
            'circular': {
                type: 'boolean'
            },
            'vertical': {
                type: 'boolean'
            },
            'previous-margin': {
                type: 'string'
            },
            'next-margin': {
                type: 'string'
            },
            'snap-to-edge': {
                type: 'boolean'
            },
            'display-multiple-items': {
                type: 'number'
            },
            'easing-function': {
                type: 'string',
                enum: ['default', 'linear', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic']
            },
            'bindchange': {
                type: 'string'
            },
            'bindtransition': {
                type: 'string'
            },
            'bindanimationfinish': {
                type: 'string'
            }
        },
        required: ['interval', 'duration']
    },
    'swiper-item': {
        properties: {
            'item-id': {
                type: 'string'
            },
            'skip-hidden-item-layout': {
                type: 'boolean'
            }
        }
    },
    'view': {
        properties: {
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
            }
        }
    },
};
