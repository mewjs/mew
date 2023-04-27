import { COLOR_PATTERN } from './const';

export default {
    'icon': {
        properties: {
            type: {
                type: 'string',
                enum: [
                    'success',
                    'success_no_circle',
                    'info',
                    'warn',
                    'waiting',
                    'cancel',
                    'download',
                    'search',
                    'clear'
                ]
            },
            size: {
                oneOf: [
                    { type: 'string' },
                    { type: 'number' }
                ]
            },
            color: {
                type: 'string',
                pattern: COLOR_PATTERN,
            },
        },
        required: ['type']
    },
    'text': {
        properties: {
            'selectable': {
                type: 'boolean',
                deprecated: true
            },
            'user-select': {
                type: 'boolean'
            },
            'space': {
                enum: ['ensp', 'emsp', 'nbsp']
            },
            'decode': {
                type: 'boolean'
            },
        }
    },
    'rich-text': {
        properties: {
            nodes: {
                oneOf: [
                    { type: 'string' },
                    { type: 'array' }
                ]
            },
            space: {
                enum: ['ensp', 'emsp', 'nbsp']
            },
            color: {
                type: 'string',
                pattern: COLOR_PATTERN,
            },
        },
        required: ['nodes']
    },
    'progress': {
        properties: {
            'percent': {
                type: 'number',
                minimum: 0,
                maximum: 100,
            },
            'show-info': {
                type: 'boolean'
            },
            'border-radius': {
                oneOf: [
                    { type: 'string' },
                    { type: 'number' }
                ]
            },
            'font-size': {
                oneOf: [
                    { type: 'string' },
                    { type: 'number' }
                ]
            },
            'stroke-width': {
                oneOf: [
                    { type: 'string' },
                    { type: 'number' }
                ]
            },
            'color': {
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
            'active': {
                type: 'boolean'
            },
            'active-mode': {
                enum: ['backwards', 'forwards']
            },
            'duration': {
                type: 'number'
            },
            'bindactiveend': {
                type: 'string'
            }
        },
        required: ['percent', 'duration']
    },
    'wxs': {
        properties: {
            module: {
                teyp: 'string'
            },
            src: {
                type: 'string'
            }
        },
        required: ['module']
    },
    'template': {
        properties: {
            is: {
                type: 'string'
            },
            id: {
                type: 'string'
            },
            dataset: {
                type: 'string'
            },
            data: {
                type: 'object'
            },
            properties: {
                type: 'object'
            }
        }
    },
    'block': {
        properties: {}
    }
};
