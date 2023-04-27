import { from } from '@mewjs/html-nest-rule';
import { walk } from '../util';
import type { DocumentRule, Node } from '../typings/types';

interface Result {
    expect: string;
    got: string;
    target: Node;
}

export default {
    name: 'nest',

    desc: 'Elements should be nested abiding by specific rules.',

    lint(getConfig, document, reporter) {
        walk(document.documentElement, element => {
            if (!getConfig(element)) {
                return;
            }

            const rule = from(element.name);
            if (!rule) {
                return;
            }

            const report = function (role: 'Content' | 'Context', code: string, result: Result) {
                const target = result.target || element;
                /* eslint-disable-next-line max-len */
                const message = `${ role } of "<${ element.tagName.toLowerCase() }>" here should be "${ result.expect }"${ result.got ? (`, while got "${ result.got }".`) : '.' }`;

                reporter.warn(
                    target.startIndex,
                    code,
                    message
                );
            };

            rule.validateContent(element).forEach((result: Result) => {
                report('Content', '041', result);
            });

            rule.validateContext(element).forEach((result: Result) => {
                report('Context', '042', result);
            });
        });
    }

} as DocumentRule;
