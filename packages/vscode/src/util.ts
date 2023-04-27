import { createHash } from 'crypto';

import type { LintError } from './LintProvider';
import { Linter } from './LintProvider';


export const md5 = (plainText: string) => {
    const md5 = createHash('md5');
    return md5.update(plainText).digest('hex');
};

export const getCommentTag = (error: LintError, languageId: string) => {
    const isMarkupContext = error.linter === Linter.Htmlint
        || error.linter === Linter.Markdownlint
        || error.rule.includes('vue/')
        || error.rule.includes('mini/');


    const commentTag = {
        open: isMarkupContext ? '<!--' : '/*',
        close: isMarkupContext ? '-->' : '*/'
    };

    return commentTag;
};
