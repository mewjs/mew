/* eslint-disable no-underscore-dangle, camelcase */

import logger from './logger';

declare const __webpack_require__: typeof require;
declare const __non_webpack_require__: typeof require;

export default function loadNodeModule<T>(moduleName: string): T | undefined {
    const r = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
    try {
        return r(moduleName);
    }
    catch (e) {
        logger.error(e.stack.toString());
    }
    return void 0;
}
