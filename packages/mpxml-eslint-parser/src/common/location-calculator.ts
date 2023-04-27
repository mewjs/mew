import { sortedLastIndex } from 'lodash';
import type { HasLocation, Location, ParseError } from '../ast';

/**
 * Location calculators.
 *
 * HTML tokenizers remove several characters to handle HTML entities and line terminators.
 * Tokens have the processed text as their value, but tokens have offsets and locations in the original text.
 * This calculator calculates the original locations from the processed texts.
 *
 * This calculator will be used for:
 *
 * - Adjusts the locations of script ASTs.
 * - Creates expression containers in postprocess.
 */
export class LocationCalculator {
    private gapOffsets: number[];

    private ltOffsets: number[];

    private baseOffset: number;

    private baseIndexOfGap: number;

    private shiftOffset: number;

    /**
     * Initialize this calculator.
     *
     * @param gapOffsets The list of the offset of removed characters in tokenization phase.
     * @param ltOffsets The list of the offset of line terminators.
     * @param baseOffset The base offset to calculate locations.
     * @param shiftOffset The shift offset to calculate locations.
     */
    constructor(
        gapOffsets: number[],
        ltOffsets: number[],
        baseOffset?: number,
        shiftOffset = 0,
    ) {
        this.gapOffsets = gapOffsets;
        this.ltOffsets = ltOffsets;
        this.baseOffset = baseOffset || 0;
        this.baseIndexOfGap
            = this.baseOffset === 0
                ? 0
                : sortedLastIndex(gapOffsets, this.baseOffset);
        this.shiftOffset = shiftOffset;
    }

    /**
     * Get sub calculator which have the given base offset.
     *
     * @param offset The base offset of new sub calculator.
     * @returns Sub calculator.
     */
    getSubCalculatorAfter(offset: number): LocationCalculator {
        return new LocationCalculator(
            this.gapOffsets,
            this.ltOffsets,
            this.baseOffset + offset,
            this.shiftOffset,
        );
    }

    /**
     * Get sub calculator that shifts the given offset.
     *
     * @param offset The shift of new sub calculator.
     * @returns Sub calculator.
     */
    getSubCalculatorShift(offset: number): LocationCalculator {
        return new LocationCalculator(
            this.gapOffsets,
            this.ltOffsets,
            this.baseOffset,
            this.shiftOffset + offset,
        );
    }

    /**
     * Calculate the location of the given index.
     * @param index The index to calculate their location.
     * @returns The location of the index.
     */
    getLocation(index: number): Location {
        return this.calculateLocation(this.baseOffset + index + this.shiftOffset);
    }

    /**
     * Calculate the offset of the given index.
     *
     * @param index The index to calculate their location.
     * @returns The offset of the index.
     */
    getOffsetWithGap(index: number): number {
        const { shiftOffset } = this;
        return (
            this.baseOffset
            + index
            + shiftOffset
            + this.getGap(index + shiftOffset)
        );
    }

    /**
     * Modify the location information of the given node with using the base offset and gaps of this calculator.
     *
     * @param node The node to modify their location.
     */
    fixLocation<T extends HasLocation>(node: T): T {
        const { shiftOffset } = this;
        const { range } = node;
        const { loc } = node;
        // TODO: no range
        if (!range || !loc) {
            return node;
        }
        const gap0 = this.getGap(range[0] + shiftOffset);
        const gap1 = this.getGap(range[1] + shiftOffset);
        const d0 = this.baseOffset + Math.max(0, gap0) + shiftOffset;
        const d1 = this.baseOffset + Math.max(0, gap1) + shiftOffset;

        if (d0 !== 0) {
            range[0] += d0;
            if (node.start != null) {
                node.start += d0;
            }
            loc.start = this.calculateLocation(range[0]);
        }
        if (d1 !== 0) {
            range[1] += d1;
            if (node.end != null) {
                node.end += d0;
            }
            loc.end = this.calculateLocation(range[1]);
        }

        return node;
    }

    /**
     * Modify the location information of the given error with using the base offset and gaps of this calculator.
     *
     *  @param error The error to modify their location.
     */
    fixErrorLocation(error: ParseError) {
        const { shiftOffset } = this;
        const gap = this.getGap(error.index + shiftOffset);
        const diff = this.baseOffset + Math.max(0, gap) + shiftOffset;

        error.index += diff;

        const loc = this.calculateLocation(error.index);
        error.lineNumber = loc.line;
        error.column = loc.column;
    }

    /**
     * Calculate the location of the given offset.
     *
     * @param offset The offset to calculate their location.
     * @returns The location of the offset.
     */
    private calculateLocation(offset: number): Location {
        const line = sortedLastIndex(this.ltOffsets, offset) + 1;
        const column = offset - (line === 1 ? 0 : this.ltOffsets[line - 2]);
        return { line, column };
    }

    /**
     * Calculate gap at the given index.
     *
     * @param index The index to calculate gap.
     */
    private getGap(index: number): number {
        const offsets = this.gapOffsets;
        let g0 = sortedLastIndex(offsets, index + this.baseOffset);
        let pos = index + this.baseOffset + g0 - this.baseIndexOfGap;

        while (g0 < offsets.length && offsets[g0] <= pos) {
            g0 += 1;
            pos += 1;
        }

        return g0 - this.baseIndexOfGap;
    }
}
