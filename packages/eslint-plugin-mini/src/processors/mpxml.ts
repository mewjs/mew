/**
 * @typedef {import('eslint').Linter.LintMessage} LintMessage
 */

/**
 * @param {Map<string, string[]>} disableRuleKeys
 * @param {string} rule
 * @param {string} key
 */
function addDisableRule(disableRuleKeys: Map<string, string[]>, rule: string, key: string) {
    let keys = disableRuleKeys.get(rule);
    if (keys) {
        keys.push(key);
    }
    else {
        keys = [key];
        disableRuleKeys.set(rule, keys);
    }
}

function messageToKey(message: LintMessage) {
    return `line:${ message.line },column${
        // -1 because +1 by ESLint's `report-translator`.
        message.column - 1
    }`;
}

/**
 * Compares the locations of two objects in a source file
 * @param {Position} itemA The first object
 * @param {Position} itemB The second object
 * @returns {number} A value less than 1 if itemA appears before itemB in the source file, greater than 1 if
 * itemA appears after itemB in the source file, or 0 if itemA and itemB have the same location.
 */
function compareLocations(itemA: Position, itemB: Position): number {
    return itemA.line - itemB.line || itemA.column - itemB.column;
}

interface GroupState {
    disableAllKeys: Set<string>;
    disableRuleKeys: Map<string, string[]>;
}

export default {

    /** @param {string} code */
    preprocess(code: string): string[] {
        return [code];
    },

    /**
     * @param {LintMessage[][]} messages
     * @returns {LintMessage[]}
     */
    postprocess(messages: LintMessage[][]) {
        const state = {

            block: {
                disableAllKeys: new Set(),
                disableRuleKeys: new Map()
            } as GroupState,

            line: {
                disableAllKeys: new Set(),
                disableRuleKeys: new Map()
            } as GroupState
        };

        const usedDisableDirectiveKeys: string[] = [];

        const unusedDisableDirectiveReports: Map<string, LintMessage> = new Map();

        // Filter messages which are in disabled area.
        const filteredMessages = messages[0].filter(message => {
            if (message.ruleId === '@mewjs/mini/comment-directive') {
                const directiveType = message.messageId;
                const [, messageKey, messageValue] = message.message.split(' ');
                switch (directiveType) {
                    case 'disableBlock':
                        state.block.disableAllKeys.add(messageKey);
                        break;
                    case 'disableLine':
                        state.line.disableAllKeys.add(messageKey);
                        break;
                    case 'enableBlock':
                        state.block.disableAllKeys.clear();
                        break;
                    case 'enableLine':
                        state.line.disableAllKeys.clear();
                        break;
                    case 'disableBlockRule':
                        addDisableRule(state.block.disableRuleKeys, messageKey, messageValue);
                        break;
                    case 'disableLineRule':
                        addDisableRule(state.line.disableRuleKeys, messageKey, messageValue);
                        break;
                    case 'enableBlockRule':
                        state.block.disableRuleKeys.delete(messageKey);
                        break;
                    case 'enableLineRule':
                        state.line.disableRuleKeys.delete(messageKey);
                        break;
                    case 'clear':
                        state.block.disableAllKeys.clear();
                        state.block.disableRuleKeys.clear();
                        state.line.disableAllKeys.clear();
                        state.line.disableRuleKeys.clear();
                        break;
                    default:
                        // unused eslint-disable comments report
                        unusedDisableDirectiveReports.set(messageToKey(message), message);
                        break;
                }
                return false;
            }

            const disableDirectiveKeys = [] as string[];
            if (state.block.disableAllKeys.size) {
                disableDirectiveKeys.push(...state.block.disableAllKeys);
            }
            if (state.line.disableAllKeys.size) {
                disableDirectiveKeys.push(...state.line.disableAllKeys);
            }
            if (message.ruleId) {
                const block = state.block.disableRuleKeys.get(message.ruleId);
                if (block) {
                    disableDirectiveKeys.push(...block);
                }
                const line = state.line.disableRuleKeys.get(message.ruleId);
                if (line) {
                    disableDirectiveKeys.push(...line);
                }
            }

            if (disableDirectiveKeys.length) {
                // Store used eslint-disable comment key
                usedDisableDirectiveKeys.push(...disableDirectiveKeys);
                return false;
            }

            return true;


        });

        if (unusedDisableDirectiveReports.size) {
            for (const key of usedDisableDirectiveKeys) {
                // Remove used eslint-disable comments
                unusedDisableDirectiveReports.delete(key);
            }
            // Reports unused eslint-disable comments
            filteredMessages.push(...unusedDisableDirectiveReports.values());
            filteredMessages.sort(compareLocations);
        }

        return filteredMessages;
    },

    supportsAutofix: true
};

