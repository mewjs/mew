import type { LintResult } from '../types';

export default function xml(json: LintResult) {

    const header = ''
        + '<?xml version="1.0" encoding="utf-8"?>'
        + '<results>';

    const footer = ''
        + '</results>';

    const body = [] as string[];

    json.forEach(file => {
        const div = [`<file path="${ file.path }" count="${ file.errors.length }">`];

        file.errors.forEach(error => {
            div.push('<error');
            div.push(` line="${ error.line }"`);
            div.push(` column="${ error.column }"`);
            div.push(` rule="${ error.rule }"`);
            div.push('>');
            div.push(error.message);
            div.push('</error>');
        });

        div.push('</file>');
        body.push(div.join(''));
    });

    const html = header + body.join('') + footer;

    process.stdout.write(html);
}
