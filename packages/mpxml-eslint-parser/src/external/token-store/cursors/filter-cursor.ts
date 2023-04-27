import type { Token } from '../../../ast';
import type Cursor from './cursor';
import DecorativeCursor from './decorative-cursor';

/**
 * The decorative cursor which ignores specified tokens.
 */
export default class FilterCursor extends DecorativeCursor {
    private predicate: (token: Token) => boolean;

    /**
     * Initializes this cursor.
     * @param cursor - The cursor to be decorated.
     * @param predicate - The predicate function to decide tokens this cursor iterates.
     */
    constructor(cursor: Cursor, predicate: (token: Token) => boolean) {
        super(cursor);
        this.predicate = predicate;
    }

    /** @inheritdoc */
    moveNext(): boolean {
        const { predicate } = this;

        while (super.moveNext()) {
            if (predicate(this.current!)) {
                return true;
            }
        }
        return false;
    }
}
