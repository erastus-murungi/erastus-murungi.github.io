import { describe, expect, it } from 'vitest';

import { createSudokuIndex } from '../sudoku-index';

describe('createSudokuIndex', () => {
    describe('creation', () => {
        it('should create an index set', () => {
            const indexSet = createSudokuIndex({ columnIndex: 1, rowIndex: 2 });
            expect(indexSet.columnIndex).toBe(1);
            expect(indexSet.rowIndex).toBe(2);
        });

        it('should create an index set with a board index', () => {
            const indexSet = createSudokuIndex({ columnIndex: 1, rowIndex: 2 });
            expect(indexSet.boardIndex).toBe(2 * 9 + 1);
        });

        it('should create an index set with a left index set', () => {
            const indexSet = createSudokuIndex({ columnIndex: 1, rowIndex: 2 });
            const left = indexSet.left;
            expect(left?.columnIndex).toBe(0);
            expect(left?.rowIndex).toBe(2);
        });

        it('should create an index set with a right index set', () => {
            const indexSet = createSudokuIndex({ columnIndex: 1, rowIndex: 2 });
            const right = indexSet.right;
            expect(right?.columnIndex).toBe(2);
            expect(right?.rowIndex).toBe(2);
        });

        it('should create an index set with an up index set', () => {
            const indexSet = createSudokuIndex({ columnIndex: 1, rowIndex: 2 });
            const up = indexSet.up;
            expect(up?.columnIndex).toBe(1);
            expect(up?.rowIndex).toBe(1);
        });

        it('should create an index set with a down index set', () => {
            const indexSet = createSudokuIndex({ columnIndex: 1, rowIndex: 2 });
            const down = indexSet.down;
            expect(down?.columnIndex).toBe(1);
            expect(down?.rowIndex).toBe(3);
        });
    });

    it('should not create a left index set if at the left edge', () => {
        const indexSet = createSudokuIndex({ columnIndex: 0, rowIndex: 4 });
        const left = indexSet.left;
        expect(left).toBeUndefined();
    });

    it('should not create a right index set if at the right edge', () => {
        const indexSet = createSudokuIndex({ columnIndex: 8, rowIndex: 4 });
        const right = indexSet.right;
        expect(right).toBeUndefined();
    });

    it('should not create a down index set if at the bottom edge', () => {
        const indexSet = createSudokuIndex({ columnIndex: 4, rowIndex: 8 });
        const down = indexSet.down;
        expect(down).toBeUndefined();
    });

    it('should not create a up index set if at the top edge', () => {
        const indexSet = createSudokuIndex({ columnIndex: 4, rowIndex: 0 });
        const right = indexSet.up;
        expect(right).toBeUndefined();
    });

    describe('equivalence', () => {
        it('should be equivalent to another index set with the same column and row index', () => {
            const indexSet1 = createSudokuIndex({
                columnIndex: 1,
                rowIndex: 2,
            });
            const indexSet2 = createSudokuIndex({
                columnIndex: 1,
                rowIndex: 2,
            });
            expect(indexSet1).toEqual(indexSet2);
        });

        it('should not be equivalent to another index set with a different column index', () => {
            const indexSet1 = createSudokuIndex({
                columnIndex: 1,
                rowIndex: 2,
            });
            const indexSet2 = createSudokuIndex({
                columnIndex: 2,
                rowIndex: 2,
            });
            expect(indexSet1).not.toEqual(indexSet2);
        });

        it('should not be equivalent to another index set with a different row index', () => {
            const indexSet1 = createSudokuIndex({
                columnIndex: 1,
                rowIndex: 2,
            });
            const indexSet2 = createSudokuIndex({
                columnIndex: 1,
                rowIndex: 3,
            });
            expect(indexSet1).not.toEqual(indexSet2);
        });
    });

    describe('isInSame3by3Grid', () => {
        const cases = [
            {
                index1: { columnIndex: 0, rowIndex: 0 },
                index2: { columnIndex: 1, rowIndex: 0 },
                expected: true,
            },
            {
                index1: { columnIndex: 0, rowIndex: 0 },
                index2: { columnIndex: 0, rowIndex: 1 },
                expected: true,
            },
            {
                index1: { columnIndex: 0, rowIndex: 0 },
                index2: { columnIndex: 1, rowIndex: 1 },
                expected: true,
            },
            {
                index1: { columnIndex: 0, rowIndex: 0 },
                index2: { columnIndex: 2, rowIndex: 0 },
                expected: true,
            },
            {
                index1: { columnIndex: 0, rowIndex: 0 },
                index2: { columnIndex: 0, rowIndex: 2 },
                expected: true,
            },
            {
                index1: { columnIndex: 0, rowIndex: 0 },
                index2: { columnIndex: 2, rowIndex: 2 },
                expected: true,
            },
            {
                index1: { columnIndex: 0, rowIndex: 0 },
                index2: { columnIndex: 3, rowIndex: 0 },
                expected: false,
            },
            {
                index1: { columnIndex: 0, rowIndex: 0 },
                index2: { columnIndex: 0, rowIndex: 3 },
                expected: false,
            },
            {
                index1: { columnIndex: 0, rowIndex: 0 },
                index2: { columnIndex: 3, rowIndex: 3 },
                expected: false,
            },
        ];
        // eslint-disable-next-line unicorn/no-array-for-each
        cases.forEach(({ index1, index2, expected }) => {
            it(`should return ${expected} for ${JSON.stringify(
                index1
            )} and ${JSON.stringify(index2)}`, () => {
                const indexSet1 = createSudokuIndex(index1);
                const indexSet2 = createSudokuIndex(index2);
                expect(indexSet1.isInSame3by3Grid(indexSet2)).toBe(expected);
            });
        });
    });
});
