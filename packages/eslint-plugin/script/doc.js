const cheerio = require('cheerio');
const fetch = require('node-fetch');
const chalk = require('chalk');

const Doc = {
    ESLINT: 'https://eslint.org/docs/rules/',
    NODE: 'https://github.com/mysticatea/eslint-plugin-node',
    BABEL: 'https://github.com/babel/babel/tree/main/eslint/babel-eslint-plugin'
};

// const eslint = () => {

// fetch(Doc.ESLINT)
//     .then(response => response.text())
//     .then(html => {
//         const $ = cheerio.load(html);
//         $('.rule-list.deprecated-rules td a, .rule-list.deprecated-rules td p').each((i, el) => {
//             console.log($(el).text());
//         });
//     });
// };

fetch(Doc.NODE)
    .then(response => response.text())
    .then(html => {
        const $ = cheerio.load(html);
        $('table').each((i, table) => {
            let h3 = $(table).prev('h3');
            if (!h3 || h3.name !== 'h3') {
                h3 = table.prev;
                while (h3 && h3.name !== 'h3') {
                    h3 = h3.prev;
                }
            }

            console.log('        // %s', chalk.green.bold($(h3).text()));
            $('tr td:nth-child(1) a', table).each((i, a) => {
                console.log('        \'%s\': %s,', chalk.blue($(a).text()), chalk.yellow('1'));
            });
            console.log();
        });
    });

