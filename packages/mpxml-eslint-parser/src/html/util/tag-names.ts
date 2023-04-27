/**
 * HTML tag names of void elements.
 */
export const HTML_VOID_ELEMENT_TAGS = new Set([
    'source'
    // "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
    // "param", "source", "track", "wbr",
]);

/**
 * https://github.com/vuejs/vue/blob/e4da249ab8ef32a0b8156c840c9d2b9773090f8a/src/platforms/web/compiler/util.js#L12
 */
export const HTML_CAN_BE_LEFT_OPEN_TAGS = new Set([
    'source'
    // "colgroup", "li", "options", "p", "td", "tfoot", "th", "thead",
    // "tr", "source",
]);

/**
 * https://github.com/vuejs/vue/blob/e4da249ab8ef32a0b8156c840c9d2b9773090f8a/src/platforms/web/compiler/util.js#L18
 */
export const HTML_NON_FHRASING_TAGS = new Set([
    'address',
    'article',
    'aside',
    'base',
    'blockquote',
    'body',
    'caption',
    'col',
    'colgroup',
    'dd',
    'details',
    'dialog',
    'div',
    'dl',
    'dt',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hgroup',
    'hr',
    'html',
    'legend',
    'li',
    'menuitem',
    'meta',
    'optgroup',
    'option',
    'param',
    'rp',
    'rt',
    'source',
    'style',
    'summary',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'title',
    'tr',
    'track',
]);

/**
 * HTML tag names of RCDATA.
 */
export const HTML_RCDATA_TAGS = new Set([
    'title', 'textarea',
]);

/**
 * HTML tag names of RAWTEXT.
 */
export const HTML_RAWTEXT_TAGS = new Set([
    'wxs'
]);

/**
 * SVG tag names.
 */
export const SVG_TAGS = new Set([
    'a',
    'altGlyph',
    'altGlyphDef',
    'altGlyphItem',
    'animate',
    'animateColor',
    'animateMotion',
    'animateTransform',
    'animation',
    'audio',
    'canvas',
    'circle',
    'clipPath',
    'color-profile',
    'cursor',
    'defs',
    'desc',
    'discard',
    'ellipse',
    'feBlend',
    'feColorMatrix',
    'feComponentTransfer',
    'feComposite',
    'feConvolveMatrix',
    'feDiffuseLighting',
    'feDisplacementMap',
    'feDistantLight',
    'feDropShadow',
    'feFlood',
    'feFuncA',
    'feFuncB',
    'feFuncG',
    'feFuncR',
    'feGaussianBlur',
    'feImage',
    'feMerge',
    'feMergeNode',
    'feMorphology',
    'feOffset',
    'fePointLight',
    'feSpecularLighting',
    'feSpotLight',
    'feTile',
    'feTurbulence',
    'filter',
    'font',
    'font-face',
    'font-face-format',
    'font-face-name',
    'font-face-src',
    'font-face-uri',
    'foreignObject',
    'g',
    'glyph',
    'glyphRef',
    'handler',
    'hatch',
    'hatchpath',
    'hkern',
    'iframe',
    'image',
    'line',
    'linearGradient',
    'listener',
    'marker',
    'mask',
    'mesh',
    'meshgradient',
    'meshpatch',
    'meshrow',
    'metadata',
    'missing-glyph',
    'mpath',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'prefetch',
    'radialGradient',
    'rect',
    'script',
    'set',
    'solidColor',
    'solidcolor',
    'stop',
    'style',
    'svg',
    'switch',
    'symbol',
    'tbreak',
    'text',
    'textArea',
    'textPath',
    'title',
    'tref',
    'tspan',
    'unknown',
    'use',
    'video',
    'view',
    'vkern',
]);

/**
 * The map from lowercase names to actual names in SVG.
 */
export const SVG_ELEMENT_NAME_MAP = new Map<string, string>();
for (const name of SVG_TAGS) {
    if (/[A-Z]/.test(name)) {
        SVG_ELEMENT_NAME_MAP.set(name.toLowerCase(), name);
    }
}
