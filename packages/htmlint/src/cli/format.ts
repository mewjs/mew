import fs from 'fs';
import differ from 'differ-cli/lib/differ';
import * as htmlint from '..';
import defaultConfig from '../default/config';
import { loadSpecifiedConfig, readFile } from './helper';

interface CliOptions {
    config?: string;
    diff?: boolean;
    'in-place'?: boolean;
}

export default {
    name: 'format',
    describe: 'Do format given file(s)',
    examples: [
        ['$0 format foo.html', 'do format foo.html'],
        ['$0 format --diff foo.html', 'do format foo.html & show diff result'],
        ['$0 format --in-place foo.html', 'do format foo.html & write file in place']
    ],

    handler(options: CliOptions, targetFiles: string[]) {
        // format directly
        let format = htmlint.formatFile;

        // specified config
        if (options.config) {
            const config = loadSpecifiedConfig(options.config);
            // format with specified config
            format = filePath => htmlint.format(readFile(filePath), config || defaultConfig);
        }

        targetFiles.forEach(filePath => {
            const result = format(filePath);

            if (options.diff) {
                console.log('%s:%s', filePath, differ(readFile(filePath), result));
                return;
            }

            if (options['in-place']) {
                fs.writeFileSync(filePath, result);
                console.log('√', filePath);
                return;
            }

            console.log(result);
        });
    }
};
