import * as path from 'path';
import * as fs from 'fs';

export default function findExecutable(name: string, rootPath: string) {
    const { platform } = process;
    if (platform === 'win32' && fs.existsSync(path.join(rootPath, 'node_modules', '.bin', `${ name }.cmd`))) {
        return path.join('.', 'node_modules', '.bin', `${ name }.cmd`);
    }

    if ((platform === 'linux' || platform === 'darwin')
        && fs.existsSync(path.join(rootPath, 'node_modules', '.bin', name))) {
        return path.join('.', 'node_modules', '.bin', name);
    }

    return name;
}
