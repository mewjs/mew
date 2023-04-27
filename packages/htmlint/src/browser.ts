export { addRule, hint, format } from './htmlint';

function notSupported() {
    throw new Error('Sorry, this method is not supported in browser.');
}

export const hintFile = notSupported;
export const formatFile = notSupported;
