import type { ParseError, XDocumentFragment, XJson } from '../ast';
import { LocationCalculator } from '../common/location-calculator';
import { parseExpression } from './index';

function getLtOffsets(code: string) {
    const gaps = [] as number[];
    const lineTerminators = [] as number[];
    for (let offset = 0; offset < code.length; offset++) {
        if (code[offset] === '\n') {
            lineTerminators.push(offset + 1);
            if (code[offset - 1] === '\r') {
                gaps.push(offset);
            }
        }
    }

    return {
        gaps,
        lineTerminators
    };
}
export class JsonParser {

    private parserOptions: any;

    private document: XDocumentFragment;

    constructor(parserOptions: any) {
        this.parserOptions = parserOptions;
        this.document = {
            type: 'XDocumentFragment',
            range: [0, 0],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 0 },
            },
            parent: null,
            children: [],
            tokens: [],
            comments: [],
            errors: [],
            xmlType: 'unknown'
        };
    }

    parse(code: string): XDocumentFragment {
        const doc = this.document;
        const { gaps, lineTerminators } = getLtOffsets(code);
        const locationCalculator = new LocationCalculator(
            gaps,
            lineTerminators,
        );
        try {
            const { expression, tokens } = parseExpression(
                code,
                locationCalculator,
                this.parserOptions,
            );
            if (expression) {
                const jsonNode: XJson = {
                    type: 'XJson',
                    parent: doc,
                    range: expression.range,
                    loc: expression.loc,
                    value: expression,
                };
                jsonNode.value.parent = jsonNode;
                doc.tokens = tokens;
                doc.range = jsonNode.range;
                doc.loc = jsonNode.loc;
                doc.children.push(jsonNode);
            }
        }
        catch (e) {
            doc.errors.push(e as ParseError);
        }
        return doc;
    }
}
