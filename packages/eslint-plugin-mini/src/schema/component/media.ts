import { TIME_PATTERN } from './const';

export default {
    'canvas': {
        properties: {
            'type': {
                type: 'string',
                enum: ['2d', 'webgl']
            },
            'canvas-id': {
                type: 'string'
            },
            'disable-scroll': {
                type: 'boolean'
            },
            'bindtouchstart': {
                type: 'string'
            },
            'bindtouchmove': {
                type: 'string'
            },
            'bindtouchend': {
                type: 'string'
            },
            'bindtouchcancel': {
                type: 'string'
            },
            'bindlongtap': {
                type: 'string'
            },
            'binderror': {
                type: 'string'
            }
        }
    },
    'voip-room': {
        properties: {
            'openid': {
                type: 'string'
            },
            'mode': {
                type: 'string',
                enum: ['camera', 'video']
            },
            'device-position': {
                type: 'string',
                enum: ['front', 'back']
            },
            'binderror': {
                type: 'string'
            }
        }
    },
    'audio': {
        properties: {
            id: {
                type: 'string'
            },
            src: {
                type: 'string'
            },
            loop: {
                type: 'boolean'
            },
            controls: {
                type: 'boolean'
            },
            poster: {
                type: 'string'
            },
            name: {
                type: 'string'
            },
            author: {
                type: 'string'
            },
            binderror: {
                type: 'string'
            },
            bindplay: {
                type: 'string'
            },
            bindpause: {
                type: 'string'
            },
            bindtimeupdate: {
                type: 'string'
            },
            bindended: {
                type: 'string'
            },
        }
    },
    'camera': {
        properties: {
            'mode': {
                type: 'string',
                enmu: ['normal', 'scanCode']
            },
            'resolution': {
                type: 'string',
                enum: ['low', 'medium', 'high']
            },
            'device-position': {
                type: 'string',
                enum: ['front', 'back']
            },
            'flash': {
                type: 'string',
                enum: ['auto', 'off', 'on', 'torch']
            },
            'frame-size': {
                type: 'string',
                enum: ['small', 'medium', 'large']
            },
            'bindstop': {
                type: 'string'
            },
            'binderror': {
                type: 'string'
            },
            'bindinitdone': {
                type: 'string'
            },
            'bindscancode': {
                type: 'string'
            }
        }
    },
    'image': {
        properties: {
            'src': {
                type: 'string'
            },
            'mode': {
                type: 'string',
                enmu: [
                    'scaleToFill',
                    'aspectFit',
                    'aspectFill',
                    'widthFix',
                    'heightFix',
                    'top',
                    'bottom',
                    'center',
                    'left',
                    'right',
                    'top left',
                    'top right',
                    'bottom left',
                    'bottom right'
                ]
            },
            'webp': {
                type: 'boolean'
            },
            'lazy-load': {
                type: 'boolean'
            },
            'show-menu-by-longpress': {
                type: 'boolean'
            },
            'binderror': {
                type: 'string'
            },
            'bindload': {
                type: 'string'
            }
        }
    },
    'live-player': {
        properties: {
            'src': {
                type: 'string'
            },
            'mode': {
                type: 'string',
                enmu: ['live', 'RTC']
            },
            'autoplay': {
                type: 'boolean'
            },
            'muted': {
                type: 'boolean'
            },
            'orientation': {
                type: 'string',
                enume: ['vertical', 'horizontal']
            },
            'object-fit': {
                type: 'string',
                enum: ['contain', 'fillCrop']
            },
            'background-mute': {
                type: 'boolean'
            },
            'min-cache': {
                type: 'number',
                pattern: TIME_PATTERN
            },
            'max-cache': {
                type: 'number',
                pattern: TIME_PATTERN
            },
            'sound-mode': {
                type: 'string',
                enum: ['speaker', 'ear']
            },
            'auto-pause-if-navigate': {
                type: 'boolean'
            },
            'auto-pause-if-open-native': {
                type: 'boolean'
            },
            'picture-in-picture-mode': {
                oneOf: [
                    { type: 'string' },
                    { type: 'array' }
                ],
                enum: [[], 'push', 'pop']
            },
            'bindstatechange': {
                type: 'string'
            },
            'bindfullscreenchange': {
                type: 'string'
            },
            'bindnetstatus': {
                type: 'string'
            },
            'bindaudiovolumenotify': {
                type: 'string'
            },
            'bindenterpictureinpicture': {
                type: 'string'
            },
            'bindleavepictureinpicture': {
                type: 'string'
            }
        }
    },
    'live-pusher': {
        properties: {
            'url': {
                type: 'string'
            },
            'mode': {
                type: 'string',
                enmu: ['SD', 'RTC', 'HD', 'FHD']
            },
            'autopush': {
                type: 'boolean'
            },
            'muted': {
                type: 'boolean',
                deprecated: true,
            },
            'enable-camera': {
                type: 'boolean'
            },
            'auto-focus': {
                type: 'boolean'
            },
            'orientation': {
                type: 'string',
                enume: ['vertical', 'horizontal']
            },
            'beauty': {
                type: 'number',
                minimum: 0,
                maximum: 9
            },
            'whiteness': {
                type: 'number',
                minimum: 0,
                maximum: 9
            },
            'aspect': {
                type: 'string'
            },
            'min-bitrate': {
                type: 'number'
            },
            'max-bitrate': {
                type: 'number'
            },
            'audio-quality': {
                type: 'string'
            },
            'waiting-image': {
                type: 'string'
            },
            'waiting-image-hash': {
                type: 'string'
            },
            'zoom': {
                type: 'boolean'
            },
            'device-position': {
                type: 'string',
                enum: ['front', 'back']
            },
            'background-mute': {
                type: 'boolean',
                deprecated: true,
            },
            'mirror': {
                type: 'boolean'
            },
            'remote-mirror': {
                type: 'boolean',
                deprecated: true,
            },
            'local-mirror': {
                type: 'string',
                enum: ['auto', 'enable', 'disable']
            },
            'audio-reverb-type': {
                type: 'number',
                /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
                enum: [0, 1, 2, 3, 4, 5, 6, 7]
            },
            'enable-mic': {
                type: 'boolean'
            },
            'enable-agc': {
                type: 'boolean'
            },
            'enable-ans': {
                type: 'boolean'
            },
            'audio-volume-type': {
                type: 'string',
                enum: ['auto', 'media', 'voicecall']
            },
            'video-width': {
                type: 'number'
            },
            'video-height': {
                type: 'number'
            },
            'beauty-style': {
                type: 'string',
                enum: ['smooth', 'nature']
            },
            'filter': {
                type: 'string',
                enum: [
                    'standard',
                    'pink',
                    'nostalgia',
                    'blues',
                    'romantic',
                    'cool',
                    'fresher',
                    'solor',
                    'aestheticism',
                    'whitening',
                    'cerisered'
                ]
            },
            'bindstatechange': {
                type: 'string'
            },
            'bindnetstatus': {
                type: 'string'
            },
            'binderror': {
                type: 'string'
            },
            'bindbgmstart': {
                type: 'string'
            },
            'bindbgmprogress': {
                type: 'string'
            },
            'bindbgmcomplete': {
                type: 'string'
            },
            'bindaudiovolumenotify': {
                type: 'string'
            }
        }
    },
    'video': {
        properties: {
            'src': {
                type: 'string'
            },
            'duration': {
                type: 'number'
            },
            'controls': {
                type: 'boolean'
            },
            'danmu-list': {
                type: 'array',
                items: { type: 'object' },
            },
            'danmu-btn': {
                type: 'boolean'
            },
            'enable-danmu': {
                type: 'boolean'
            },
            'autoplay': {
                type: 'boolean'
            },
            'loop': {
                type: 'boolean'
            },
            'muted': {
                type: 'boolean'
            },
            'initial-time': {
                type: 'number'
            },
            'page-gesture': {
                type: 'boolean',
                deprecated: true
            },
            'direction': {
                type: 'number',
                /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
                enum: [0, 90, -90]
            },
            'show-progress': {
                type: 'boolean'
            },
            'show-fullscreen-btn': {
                type: 'boolean'
            },
            'show-play-btn': {
                type: 'boolean'
            },
            'show-center-play-btn': {
                type: 'boolean'
            },
            'enable-progress-gesture': {
                type: 'boolean'
            },
            'object-fit': {
                type: 'string',
                enum: ['contain', 'fill', 'cover']
            },
            'poster': {
                type: 'string'
            },
            'show-mute-btn': {
                type: 'boolean'
            },
            'title': {
                type: 'string'
            },
            'play-btn-position': {
                type: 'string',
                enum: ['bottom', 'center']
            },
            'enable-play-gesture': {
                type: 'boolean'
            },
            'auto-pause-if-navigate': {
                type: 'boolean'
            },
            'auto-pause-if-open-native': {
                type: 'boolean'
            },
            'vslide-gesture': {
                type: 'boolean'
            },
            'vslide-gesture-in-fullscreen': {
                type: 'boolean'
            },
            'ad-unit-id': {
                type: 'string'
            },
            'poster-for-crawler': {
                type: 'string'
            },
            'show-casting-button': {
                type: 'boolean'
            },
            'picture-in-picture-mode': {
                oneOf: [
                    { type: 'string' },
                    { type: 'array' }
                ],
                enum: [[], 'push', 'pop']
            },
            'picture-in-picture-show-progress': {
                type: 'boolean'
            },
            'enable-auto-rotation': {
                type: 'boolean'
            },
            'show-screen-lock-button': {
                type: 'boolean'
            },
            'show-snapshot-button': {
                type: 'boolean'
            },
            'bindplay': {
                type: 'string'
            },
            'bindpause': {
                type: 'string'
            },
            'bindtimeupdate': {
                type: 'string'
            },
            'bindfullscreenchange': {
                type: 'string'
            },
            'bindwaiting': {
                type: 'string'
            },
            'binderror': {
                type: 'string'
            },
            'bindprogress': {
                type: 'string'
            },
            'bindloadedmetadata': {
                type: 'string'
            },
            'bindcontrolstoggle': {
                type: 'string'
            },
            'bindenterpictureinpicture': {
                type: 'string'
            },
            'bindleavepictureinpicture': {
                type: 'string'
            },
            'bindseekcomplete': {
                type: 'string'
            }
        },
        required: ['src', 'ad-unit-id', 'poster-for-crawler']
    }
};
