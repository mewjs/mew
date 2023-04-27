import { COLOR_PATTERN_HEX } from './component/const';

export default {
    'app.json': {
        type: 'object',
        properties: {
            entryPagePath: {
                type: 'string'
            },
            pages: {
                type: 'array',
                items: { type: 'string' },
                minItems: 1,
                maxItems: 100
            },
            window: {
                type: 'object',
                properties: {
                    navigationBarBackgroundColor: {
                        type: 'string',
                        pattern: COLOR_PATTERN_HEX
                    },
                    navigationBarTextStyle: {
                        type: 'string'
                    },
                    navigationBarTitleText: {
                        type: 'string'
                    },
                    navigationStyle: {
                        type: 'string'
                    },
                    backgroundColor: {
                        type: 'string',
                        pattern: COLOR_PATTERN_HEX
                    },
                    backgroundTextStyle: {
                        type: 'string'
                    },
                    backgroundColorTop: {
                        type: 'string',
                        pattern: COLOR_PATTERN_HEX
                    },
                    backgroundColorBottom: {
                        type: 'string'
                    },
                    enablePullDownRefresh: {
                        type: 'boolean'
                    },
                    onReachBottomDistance: {
                        type: 'number'
                    },
                    pageOrientation: {
                        enum: ['auto', 'portrait', 'landscape']
                    }
                }
            },
            tabBar: {
                type: 'object',
                properties: {
                    color: {
                        type: 'string',
                        pattern: COLOR_PATTERN_HEX
                    },
                    selectedColor: {
                        type: 'string',
                        pattern: COLOR_PATTERN_HEX
                    },
                    backgroundColor: {
                        type: 'string',
                        pattern: COLOR_PATTERN_HEX
                    },
                    borderStyle: {
                        type: 'string'
                    },
                    list: {
                        type: 'array',
                        minItems: 2,
                        maxItems: 5,
                        items: {
                            type: 'object',
                            properties: {
                                pagePath: { type: 'string' },
                                iconPath: { type: 'string' },
                                selectedIconPath: { type: 'string' },
                                text: { type: 'string' }
                            },
                            required: ['pagePath', 'text']
                        }
                    },
                    position: {
                        enum: ['top', 'bottom']
                    },
                    custom: {
                        type: 'boolean'
                    },
                }
            },
            networkTimeout: {
                type: 'object',
                properties: {
                    request: {
                        type: 'number'
                    },
                    connectSocket: {
                        type: 'number'
                    },
                    uploadFile: {
                        type: 'number'
                    },
                    downloadFile: {
                        type: 'number'
                    },
                }
            },
            debug: {
                type: 'boolean'
            },
            functionalPages: {
                type: 'boolean'
            },
            subpackages: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        root: { type: 'string' },
                        pages: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        independent: { type: 'boolean' }
                    }
                }
            },
            workers: {
                type: 'string'
            },
            requiredBackgroundModes: {
                type: 'array',
                allOf: [{ type: 'string' }]
            },
            plugins: {
                type: 'object',
                additionalProperties: {
                    type: 'object',
                    properties: {
                        version: { type: 'string' },
                        provider: { type: 'string' },
                        additionalProperties: false
                    }
                }
            },
            preloadRule: {
                type: 'object',
                additionalProperties: {
                    type: 'object',
                    properties: {
                        network: { type: 'string' },
                        packages: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    },
                    additionalProperties: false
                }
            },
            resizable: {
                type: 'boolean'
            },
            usingComponents: {
                type: 'object',
                additionalProperties: {
                    type: 'string'
                }
            },
            permission: {
                type: 'object',
                additionalProperties: {
                    type: 'object',
                    properties: {
                        desc: { type: 'string' }
                    }
                }
            },
            sitemapLocation: {
                type: 'string'
            },
            style: {
                type: 'string'
            },
            useExtendedLib: {
                type: 'object',
                properties: {
                    kbone: { type: 'boolean' },
                    weui: { type: 'boolean' },
                }
            },
            entranceDeclare: {
                type: 'object'
            },
            darkmode: {
                type: 'boolean'
            },
            themeLocation: {
                type: 'string'
            },
            lazyCodeLoading: {
                type: 'string'
            },
            singlePage: {
                type: 'object',
                properties: {
                    navigationBarFit: { type: 'string' }
                }
            }
        },
        required: ['pages', 'window']
    },
    'page.json': {
        type: 'object',
        properties: {
            navigationBarBackgroundColor: {
                type: 'string',
                pattern: COLOR_PATTERN_HEX
            },
            usingComponents: {
                type: 'object',
                additionalProperties: {
                    type: 'string'
                }
            },
            // TODO: https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html
        }
    },
    'component.json': {
        type: 'object',
        properties: {
            component: {
                type: 'boolean'
            },
            usingComponents: {
                type: 'object',
                additionalProperties: {
                    type: 'string'
                }
            },
            // TODO: https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html
        }
    },
    'sitemap.json': {
        type: 'object',
        properties: {
            desc: { type: 'string' },
            rules: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        action: {
                            enum: ['allow', 'disallow']
                        },
                        page: { type: 'string' },
                        params: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        matching: {
                            enum: ['exact', 'inclusive', 'exclusive', 'partial']
                        },
                        priority: {
                            type: 'number'
                        },
                    },
                    required: ['action', 'page']
                }
            }
        }
    }
};
