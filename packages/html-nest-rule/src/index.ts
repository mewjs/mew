import type HTMLNode from '@mewjs/dom';
import type { Rule } from './rules';
import { rules } from './rules';

export { rules } from './rules';

/**
 * Get rule for given tagName / element.
 *
 * @param {string|Element} target - given tagName or element
 * @return {Rule|undefined} corresponding rule
 */
export function from(target: string | HTMLNode): Rule | undefined {
    const tag = typeof target === 'string'
        ? target
        : target.tagName;

    return rules[tag.toLowerCase()];
}
