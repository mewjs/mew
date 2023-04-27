import { name, version } from '../../package.json';
import type { LintResult } from '../types';

export default function html(json: LintResult) {

    const header = ''
        + '<!DOCTYPE html>'
        + '<html>'
        + '<head>'
        +   '<meta charset="utf-8">'
        +   `<title>${ name }@${ version } check results</title>`
        + '</head>'
        + '<body>'
        + '<h1>MEW Check Results</h1>';

    const footer = ''
        + '</body>'
        + '</html>';

    const body = [] as string[];

    json.forEach(file => {
        const div = ['<div>'];

        div.push(`<h2>${ file.path }</div>`);
        div.push('<ol>');
        file.errors.forEach(error => {
            div.push('<li>');
            div.push(`line ${ error.line } `);
            div.push(`column ${ error.column }: `);
            div.push(error.message);
            div.push(` (${ error.rule })`);
            div.push('</li>');
        });

        div.push('</ol>');
        div.push('</div>');
        body.push(div.join(''));
    });

    const html = `${ header + body.join('') + footer }\n`;

    process.stdout.write(html);
}
