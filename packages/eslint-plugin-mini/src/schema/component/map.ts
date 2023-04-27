export default {
    map: {
        properties: {
            'longitude': {
                type: 'number'
            },
            'latitude': {
                type: 'number'
            },
            'scale': {
                type: 'number',
                minimum: 3,
                maximum: 20
            },
            'min-scale': {
                type: 'number'
            },
            'max-scale': {
                type: 'number'
            },
            'markers': {
                type: 'array'
            },
            'covers': {
                type: 'array'
            },
            'polyline': {
                type: 'array'
            },
            'circles': {
                type: 'array'
            },
            'controls': {
                type: 'array'
            },
            'include-points': {
                type: 'array'
            },
            'show-location': {
                type: 'boolean'
            },
            'polygons': {
                type: 'array'
            },
            'subkey': {
                type: 'string'
            },
            'layer-style': {
                type: 'number'
            },
            'rotate': {
                type: 'number'
            },
            'skew': {
                type: 'number'
            },
            'enable-3D': {
                type: 'number'
            },
            'show-compass': {
                type: 'boolean'
            },
            'show-scale': {
                type: 'boolean'
            },
            'enable-overlooking': {
                type: 'boolean'
            },
            'enable-zoom': {
                type: 'boolean'
            },
            'enable-scroll': {
                type: 'boolean'
            },
            'enable-rotate': {
                type: 'boolean'
            },
            'enable-satellite': {
                type: 'boolean'
            },
            'enable-traffic': {
                type: 'boolean'
            },
            'enable-poi': {
                type: 'boolean'
            },
            'enable-building': {
                type: 'boolean'
            },
            'setting': {
                type: 'object'
            },
            'bindtap': {
                type: 'string'
            },
            'bindmarkertap': {
                type: 'string'
            },
            'bindlabeltap': {
                type: 'string'
            },
            'bindcontroltap': {
                type: 'string'
            },
            'bindcallouttap': {
                type: 'string'
            },
            'bindupdated': {
                type: 'string'
            },
            'bindregionchange': {
                type: 'string'
            },
            'bindpoitap': {
                type: 'string'
            },
            'bindanchorpointtap': {
                type: 'string'
            },

        }
    }
};
