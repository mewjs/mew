import fs from 'fs';
import mpxmlParser from './processors/mpxml';
import globals from './globals';
import recommended from './config/recommended';

export const configs = {
    recommended
};

export const processors = {
    '.wxml': mpxmlParser,
    '.axml': mpxmlParser,
    '.swan': mpxmlParser
};

export const environments = {
    globals: { globals }
};

interface Rules {
    [key: string]: RuleModule;
}

export const rules = ((dir, matcher) =>
    fs.readdirSync(dir).reduce<Rules>(
        (rules, filename) => {
            if (matcher.test(filename)) {
                /* eslint-disable-next-line @typescript-eslint/no-var-requires */
                rules[filename.replace(matcher, '')] = require(`${ dir }/${ filename }`).default;
            }
            return rules;
        },
        {}
    )
)(`${ __dirname }/rules`, /\b(?<!\.d)\.[jt]s$/);
