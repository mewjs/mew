import { filterTokens } from 'markdownlint/helpers';
import type { Rule, MarkdownItToken, RuleConfiguration } from 'markdownlint';

enum Language {
    Script = 'script',
    HTML = 'html',
    Style = 'style',
    Vue = 'vue'
}

const linterMap = [
    [Language.Script, 'js', 'jsx', 'javascript', 'ts', 'tsx', 'typescript', 'es', 'esm', 'esnext'],
    [Language.HTML, 'htm', 'html'],
    [Language.Style, 'css', 'less', 'styl', 'stylus', 'sass', 'scss'],
    [Language.Vue, 'vue'],
].reduce((map, [lang, ...fences]) => {
    for (const fence of fences) {
        map.set(fence, lang as Language);
    }
    return map;
}, new Map<string, Language>());

const suffixMap = new Map([
    ['javascript', 'js'],
    ['typescript', 'ts'],
    ['esnext', 'js'],
    ['stylus', 'styl']
]);

let realConfig: RuleConfiguration = null;

export const ShadowRule = {
    names: ['MD999', 'fenced-code-lint'],

    description: 'Fenced code should be lint relay on language specified',

    tags: ['code', 'language'],

    asynchronous: false,

    function: function MD999(params) {
        if (realConfig) {
            return;
        }

        realConfig = params.config;
    }
};

export default {
    names: ['MD998', 'fenced-code-lint-shadow'],

    description: 'Fenced code should be lint relay on language specified',

    tags: ['code', 'language'],

    asynchronous: false,

    function: function MD998(params, onError) {
        filterTokens(params, 'fence', function forToken(token: MarkdownItToken) {
            const language = token.info.trim();
            // const { config } = params;
            const config = realConfig;
            if (!config || !language || !linterMap.has(language)) {
                // linted by MD040
                return;
            }


            const linterProcess = config?.[linterMap.get(language)!];
            if (!linterProcess) {
                return;
            }

            if (!config.fix) {
                return linterProcess(
                    token.content,
                    { line: token.lineNumber + 1, column: 0 },
                    suffixMap.get(language) ?? language,
                    ''
                );
            }

            return linterProcess(
                token.content,
                suffixMap.get(language) ?? language,
                ''
            ).then(fixedContent => {
                if (fixedContent === token.content) {
                    return;
                }
                for (let from = token.lineNumber, to = token.map[1] - 1; from < to; from++) {
                    onError({
                        lineNumber: from,
                        fixInfo: {
                            lineNumber: from + 1,
                            deleteCount: from === to - 1 ? params.lines[from].length : -1,
                            insertText: from === to - 1 ? fixedContent : ''
                        }
                    });
                }
            });
        });
    }
} as Rule;
