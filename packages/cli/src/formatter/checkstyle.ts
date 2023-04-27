import { name, version } from '../../package.json';
import type { LintResult } from '../types';

function escape(text: string) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&apos;');
}

export default function checkstyle(json: LintResult) {

    const header = ''
        + '<?xml version="1.0" encoding="utf-8"?>'
        + '<checkstyle version="4.3">';


    const footer = ''
        + '</checkstyle>';

    const body = [] as string[];
    json.forEach(file => {
        const div = [`<file name="${ file.path }" count="${ file.errors.length }">`];

        file.errors.forEach(error => {
            div.push('<error');
            div.push(` line="${ error.line }"`);
            div.push(` column="${ error.column }"`);
            div.push(' severity="error"');
            div.push(` source="${ name }@${ version }"`);
            div.push(` message="${ escape(error.message) }"`);
            div.push(` rule="${ error.rule }"`);
            div.push('/>');
        });

        div.push('</file>');
        body.push(div.join(''));
    });

    const html = header + body.join('') + footer;

    process.stdout.write(html);
}
