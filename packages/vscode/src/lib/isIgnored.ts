export default function isIgnored(uri: string) {
    // 带 min.js, min.css 后缀不检查
    // 包含 node_modules 路径不检查
    if (uri.match(/(\.min\.(?:js|css)$|node_modules\/)/)) {
        return true;
    }
    return false;
}
