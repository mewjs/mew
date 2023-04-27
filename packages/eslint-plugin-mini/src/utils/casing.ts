// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------
/**
 * Capitalize a string.
 * @param {string} string
 */
function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Checks whether the given string has symbols.
 * @param {string} string
 */
function hasSymbols(string: string) {
    // without " ", "$", "-" and "_"
    return /[!"#%&'()*+,./:;<=>?@[\\\]^`{|}]/u.exec(string);
}

/**
 * Checks whether the given string has upper.
 * @param {string} string
 */
function hasUpper(string: string) {
    return /[A-Z]/u.exec(string);
}

/**
 * Convert text to kebab-case
 * @param {string} string Text to be converted
 * @return {string}
 */
function kebabCase(string: string): string {
    return string
        .replace(/_/gu, '-')
        .replace(/\B([A-Z])/gu, '-$1')
        .toLowerCase();
}

/**
 * Checks whether the given string is kebab-case.
 * @param {string} string
 */
function isKebabCase(string: string) {
    if (
        hasUpper(string)
        || hasSymbols(string)
        || /^-/u.exec(string)
        || /_|--|\s/u.exec(string)
    ) {
        return false;
    }
    return true;
}

/**
 * Convert text to snake_case
 * @param {string} str Text to be converted
 * @return {string}
 */
function snakeCase(string: string): string {
    return string
        .replace(/\B([A-Z])/gu, '_$1')
        .replace(/-/gu, '_')
        .toLowerCase();
}

/**
 * Checks whether the given string is snake_case.
 * @param {string} string
 */
function isSnakeCase(string: string) {
    if (hasUpper(string) || hasSymbols(string) || /-|__|\s/u.exec(string)) {
        return false;
    }
    return true;
}

/**
 * Convert text to camelCase
 * @param {string} str Text to be converted
 * @return {string} Converted string
 */
function camelCase(string: string): string {
    if (isPascalCase(string)) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }
    return string.replace(/[-_](\w)/gu, (_, c) => (c ? c.toUpperCase() : ''));
}

/**
 * Checks whether the given string is camelCase.
 * @param {string} string
 */
function isCamelCase(string: string) {
    if (
        hasSymbols(string)
        || /^[A-Z]/u.exec(string)
        || /-|_|\s/u.exec(string)
    ) {
        return false;
    }
    return true;
}

/**
 * Convert text to PascalCase
 * @param {string} str Text to be converted
 * @return {string} Converted string
 */
function pascalCase(string: string): string {
    return capitalize(camelCase(string));
}

/**
 * Checks whether the given string is PascalCase.
 * @param {string} string
 */
function isPascalCase(string: string) {
    if (
        hasSymbols(string)
        || /^[a-z]/u.exec(string)
        // kebab or snake or space
        || /-|_|\s/u.exec(string)
    ) {
        return false;
    }
    return true;
}


type KeyNames = 'camelCase' | 'kebab-case' | 'PascalCase' | 'snake_case';
type Checker = (s: string) => boolean;
type Converter = (s: string) => string;

const checkersMap = new Map<KeyNames, Checker>([
    ['kebab-case', isKebabCase],
    ['snake_case', isSnakeCase],
    ['camelCase', isCamelCase],
    ['PascalCase', isPascalCase]
]);

const convertersMap = new Map<KeyNames, Converter>([
    ['kebab-case', kebabCase],
    ['snake_case', snakeCase],
    ['camelCase', camelCase],
    ['PascalCase', pascalCase]
]);

/**
 * Return case checker
 * @param {KeyNames} name type of checker to return ('camelCase', 'kebab-case', 'PascalCase')
 * @return {isKebabCase|isCamelCase|isPascalCase|isSnakeCase}
 */
function getChecker(name: KeyNames): Checker {
    return checkersMap.get(name) || isPascalCase;
}

/**
 * Return case converter
 * @param {KeyNames} name type of converter to return ('camelCase', 'kebab-case', 'PascalCase')
 * @return {kebabCase|camelCase|pascalCase|snakeCase}
 */
function getConverter(name: KeyNames): Converter {
    return convertersMap.get(name) || pascalCase;
}

export default {
    allowedCaseOptions: ['camelCase', 'kebab-case', 'PascalCase'],

    /**
   * Return case converter
   * @param {string} name type of converter to return ('camelCase', 'kebab-case', 'PascalCase')
   * @return {kebabCase|camelCase|pascalCase|snakeCase}
   */
    getConverter,

    /**
   * Return case checker
   * @param {string} name type of checker to return ('camelCase', 'kebab-case', 'PascalCase')
   * @return {isKebabCase|isCamelCase|isPascalCase|isSnakeCase}
   */
    getChecker,

    /**
   * Return case exact converter.
   * If the converted result is not the correct case, the original value is returned.
   * @param { 'camelCase' | 'kebab-case' | 'PascalCase' | 'snake_case' } name type of converter to return ('camelCase', 'kebab-case', 'PascalCase')
   * @return {kebabCase|camelCase|pascalCase|snakeCase}
   */
    getExactConverter(name: KeyNames): Converter {
        const converter = getConverter(name);
        const checker = getChecker(name);

        return string => {
            const result = converter(string);

            // cannot convert
            return checker(result) ? result : string;
        };
    },

    camelCase,
    pascalCase,
    kebabCase,
    snakeCase,

    isCamelCase,
    isPascalCase,
    isKebabCase,
    isSnakeCase,

    capitalize
};
