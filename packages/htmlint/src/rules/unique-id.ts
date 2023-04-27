import type { DocumentRule, Node } from '../typings/types';

export default {

    target: 'document',

    name: 'unique-id',

    desc: 'Id should be unique in page.',

    lint(getConfig, document, reporter) {
        const idMap: { [key: string]: Node[] } = {};

        document.querySelectorAll('[id]').forEach(element => {
            if (!getConfig(element)) {
                return;
            }

            if (element.id) {
                (idMap[element.id] = idMap[element.id] || []).push(element);
            }
        });

        const report = function (element: Node) {
            reporter.warn(element.startIndex, '026', 'Id should be unique in page.');
        };

        Object.keys(idMap).forEach(id => {
            const elements = idMap[id];
            if (elements.length > 1) {
                elements.forEach(report);
            }
        });
    }

} as DocumentRule;
