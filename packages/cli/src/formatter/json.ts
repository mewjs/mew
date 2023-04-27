import type { LintResult } from '../types';

const INDENT_SPACES = 4;
export default function json(json: LintResult) {
    process.stdout.write(`${ JSON.stringify(json, null, INDENT_SPACES) }\n`);
}
