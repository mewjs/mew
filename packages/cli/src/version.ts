/**
 * 获取当前安装模块的版本
 *
 * @param {string[]} modules 模块名称
 * @return {Object.<string, string>} 模块名称及对应版本信息
 */
export default function version(modules: string[]): { [k: string]: string } {
    return (modules || []).reduce((versions, name) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const pkg = require(`${ name }/package.json`);
            versions[pkg.name] = pkg.version;
        }
        catch (e) {
            versions[name] = 'N/A';
        }

        return versions;
    }, {});
}
