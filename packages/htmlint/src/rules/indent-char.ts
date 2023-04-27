import type { ParserRule } from '../typings/types';

type ConfigType = 'tab' | 'space-2' | 'space-4';
interface ConfigValue {
    name: 'tab' | '2 spaces' | '4 spaces';
    pattern: RegExp;
}

type ConfigMap = {
    [key in ConfigType]: ConfigValue;
};

export default {

    target: 'parser',

    name: 'indent-char',

    desc: 'Line should indent with space(2/4) or tab.',

    lint(getConfig, parser, reporter) {
        const configMap: ConfigMap = {
            'tab': {
                name: 'tab',
                pattern: /^\t*(?=\S|$)/
            },
            'space-2': {
                name: '2 spaces',
                pattern: /^( {2})*(?=\S|$)/
            },
            'space-4': {
                name: '4 spaces',
                pattern: /^( {4})*(?=\S|$)/
            }
        };

        // exclude-tags
        const excludeTags = new Set(['script', 'style']);
        let shouldBeIgnored = false;

        parser.on('opentagname', name => {
            shouldBeIgnored = excludeTags.has(name);
        });

        parser.on('closetag', name => {
            shouldBeIgnored = false;
        });

        parser.on('text', text => {
            const config = getConfig() as string;
            if (!config) {
                return;
            }

            // if should be excluded
            if (shouldBeIgnored) {
                return;
            }

            // get pattern ( use space-4 as default )
            const defaultConfig: ConfigValue = configMap[config] || configMap['space-4'];

            let pos = parser.startIndex;
            text.split('\n').forEach((line, i) => {
                // discard the first line cause it does not start from \n,
                if (i && !defaultConfig.pattern.test(line)) {
                    reporter.warn(
                        pos,
                        '032',
                        `Line should indent with ${ defaultConfig.name }.`
                    );
                }

                pos += line.length;
            });
        });
    },

    format(getConfig, document, options) {
        switch (getConfig()) {
            case 'tab':
                options['indent-char'] = 'tab';
                break;
            case 'space-2':
                options['indent-char'] = 'space';
                options['indent-size'] = 2;
                break;
            case 'space-4':
                options['indent-char'] = 'space';
                options['indent-size'] = 4;
                break;
        }
    }

} as ParserRule;
