import * as htmlint from '..';
import { loadSpecifiedConfig, readFile } from './helper';

export default {
    name: 'hint',
    describe: 'Do hint given file(s)',
    examples: [
        ['$0 hint foo.html', 'do hint foo.html'],
        ['$0 hint foo.html bar.html', 'do hint foo.html & bar.html'],
        ['$0 hint ./', 'do hint html files under ./']
    ],

    handler(options, targetFiles: string[]) {
        // hint directly
        let hint = htmlint.hintFile;

        // specified config
        if (options.config) {
            const config = loadSpecifiedConfig(options.config);
            // hint with specified config
            hint = filePath => htmlint.hint(readFile(filePath), config);
        }

        let hasError = false;

        targetFiles.forEach(filePath => {
            const result = hint(filePath);

            console.log(`${ filePath }:`);

            if (result.length) {
                hasError = true;

                result.forEach(item => {
                    console.log(
                        '[%s] line %d, column %d: %s (%s, %s)',
                        item.type,
                        item.line,
                        item.column,
                        item.message,
                        item.rule,
                        item.code
                    );
                });
            }
            else {
                console.log('No hint result.');
            }

            console.log('');
        });

        if (hasError) {
            process.exit(1);
        }
    }
};
