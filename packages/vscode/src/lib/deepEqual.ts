import { deepEqual, deepStrictEqual } from 'assert';

export default function myDeepEqual(a: any, b: any, strict = false) {
    try {
        strict ? deepEqual(a, b) : deepStrictEqual(a, b);
        return true;
    }
    catch (e) {
        return false;
    }
}
