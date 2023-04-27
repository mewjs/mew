import fs from 'fs';
import path from 'path';


const dir = __dirname;
const cur = path.relative(dir, __filename);
const reg = /\b(?<!\.d)\.[jt]s$/i;

const exportObject = fs.readdirSync(dir).reduce((exp, file) => {
    if (file === cur) {
        return exp;
    }

    const match = file.match(reg);
    if (match?.[1]) {
        const key = match[1].replace(/[A-Z]/g, a => `-${ a.toLowerCase() }`);

        exp[key] = require(path.join(dir, file));
    }

    return exp;
}, {});

export default exportObject;
