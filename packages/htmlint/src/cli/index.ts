import hint from './hint';
import format from './format';
import * as helper from './helper';

export default {

    commands: [
        hint,
        format
    ],

    options: [
        {
            name: 'c',
            alias: 'config',
            describe: 'Path to custom configuration file.',
            type: 'string'
        },
        {
            name: 'diff',
            describe: 'Check code style and output char diff.',
            type: 'boolean'
        },
        {
            name: 'i',
            alias: 'in-place',
            describe: 'Edit input files in place; use with care!',
            type: 'boolean'
        }
    ],

    helper
};
