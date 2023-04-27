import type { Node } from 'postcss-styl';

/**
 * 获取当前属性值开始位置
 *
 * @param {Object} node 节点
 * @return {number}
 */
export function getValueIndex(node: Node): number {
    return node.prop.length
        + (node.raws.stylusBetween ? node.raws.stylusBetween.length : node.raws.between.length);
}

/**
 * 获取当前属性尾部位置
 *
 * @param {Object} node 节点
 * @return {number}
 */
export function getTrailingIndex(node: Node): number {
    if (node.type === 'atrule') {
        return node.toString().trim().length;
    }

    return node.prop.length
        + (node.raws.stylusBetween ? node.raws.stylusBetween.length : node.raws.between.length)
        + node.value.length;
}

export function fixNodeValue(fixedValue: string, node: Node) {
    node.value = fixedValue;
    // 对于带有raw value 的字段同样需要修改
    if (typeof node.raws.value === 'object') {
        const { stylus, value: rawValue } = node.raws.value;
        node.raws.value.raw = node.raws.value.raw.replace(rawValue, fixedValue);
        if (stylus) {
            node.raws.value.stylus = node.raws.value.stylus.replace(rawValue, fixedValue);
        }
        node.raws.value.value = fixedValue;
    }
    else if (typeof node.raws.value === 'string') {
        node.raws.value = fixedValue;
    }
}

export function inCssLiteral(node: Node) {
    let cssLiteral = false;
    let target = node;
    cssLiteral = cssLiteral || isCssLiteral(target);
    while (target.parent) {
        target = target.parent;
        cssLiteral = cssLiteral || isCssLiteral(target);
    }

    return cssLiteral && target.source.lang === 'stylus';
}

export function isCssLiteral(node: Node) {
    return (
        node.type === 'atrule'
        && node.name.toLowerCase() === 'css'
        && node.cssLiteral
    );
}

export function isObjectProperty(node: Node) {
    return node.parent && node.parent.type === 'atrule' && node.parent.object;
}
