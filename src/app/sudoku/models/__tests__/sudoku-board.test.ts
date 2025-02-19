import { describe, it, expect } from 'vitest';
import {
    createEmptyBoard,
    createBoardFromDifficulty,
    type Board,
} from '../sudoku-board';

const countCompleted = (board: Board) =>
    // eslint-disable-next-line unicorn/no-array-reduce
    board.cells.reduce((acc, cell) => (cell.isCompleted ? acc + 1 : acc), 0);

describe('SudokuBoard', () => {
    describe('createEmptyBoard', () => {
        it('should create an empty board', () => {
            const board = createEmptyBoard();
            expect(board.cells.size).toBe(0);
        });
    });

    describe('createBoardFromDifficulty', () => {
        // eslint-disable-next-line unicorn/no-array-for-each
        (['easy', 'medium', 'hard', 'expert'] as const).forEach(
            (difficulty) => {
                it(`should create a board from a difficulty: ${difficulty}`, () => {
                    const board = createBoardFromDifficulty(difficulty);
                    expect(board.cells.size).toBe(81);
                });
            }
        );
    });

    describe('#reset', () => {
        it('should reset the board', () => {
            let board = createBoardFromDifficulty('easy');
            // count filled cells
            const completed = countCompleted(board);

            // Randomly fill ints in cells
            board = board.provideMultipleHints(10);

            // assert the number of completed cells is higher
            expect(countCompleted(board)).toBeGreaterThan(completed);

            board = board.reset();
            expect(countCompleted(board)).toBe(completed);
        });
    });

    describe('#provideHint', () => {
        it('should provide a hint', () => {
            const board = createBoardFromDifficulty('easy');
            const { hintIndex, updatedBoard } = board.provideHint();
            if (hintIndex === undefined) {
                throw new Error('hintIndex is undefined');
            }
            expect(board.cells.get(hintIndex)?.isBlank).toBe(true);

            expect(
                updatedBoard.cells.get(hintIndex)?.isCorrectlyFilledByUser
            ).toBe(true);
        });
    });

    describe('#provideMultipleHints', () => {
        it('should provide multiple hints', () => {
            const board = createBoardFromDifficulty('easy');
            const completed = countCompleted(board);
            const updatedBoard = board.provideMultipleHints(10);
            expect(countCompleted(updatedBoard)).toBe(completed + 10);
        });
    });

    describe('#removeValue', () => {
        it('should remove a value', () => {
            const board = createBoardFromDifficulty('easy');
            const { hintIndex, updatedBoard } = board.provideHint();
            if (hintIndex === undefined) {
                throw new Error('hintIndex is undefined');
            }
            const removedBoard = updatedBoard.removeCellValue(hintIndex);
            expect(removedBoard.cells.get(hintIndex)?.isBlank).toBe(true);
        });

        it('removing value from fixed cell should throw an error', () => {
            const board = createBoardFromDifficulty('easy');
            const firstFixedCellIndex = board.cells.findIndex(
                (cell) => cell.isFixed
            );
            if (firstFixedCellIndex === -1) {
                throw new Error('hintIndex is undefined');
            }
            expect(() => board.removeCellValue(firstFixedCellIndex)).toThrow(
                'Internal Error: Cannot remove value from fixed cell'
            );
        });
    });

    describe('#updateCellValue', () => {
        it('should update a value', () => {
            const board = createBoardFromDifficulty('easy');
            const { hintIndex, updatedBoard } = board.provideHint();
            if (hintIndex === undefined) {
                throw new Error('hintIndex is undefined');
            }
            const updatedCellValue = 1;
            const updatedBoard2 = updatedBoard.setCellValue(
                hintIndex,
                updatedCellValue
            );
            expect(updatedBoard2.cells.get(hintIndex)?.value).toBe(
                updatedCellValue
            );
        });

        it('updating value of fixed cell should throw an error', () => {
            const board = createBoardFromDifficulty('easy');
            const firstFixedCellIndex = board.cells.findIndex(
                (cell) => cell.isFixed
            );
            if (firstFixedCellIndex === -1) {
                throw new Error('hintIndex is undefined');
            }
            expect(() => board.setCellValue(firstFixedCellIndex, 1)).toThrow(
                'Internal Error: Cannot set value in fixed cell'
            );
        });
    });

    describe('#toggleCellNote', () => {
        it('should toggle a note', () => {
            const board = createBoardFromDifficulty('easy');
            const { hintIndex, updatedBoard } = board.provideHint();
            if (hintIndex === undefined) {
                throw new Error('hintIndex is undefined');
            }
            const note = 1;
            const updatedBoard2 = updatedBoard.toggleCellNote(hintIndex, note);
            // @ts-expect-error notes could be undefined
            expect(updatedBoard2.cells.get(hintIndex)?.notes.has(note)).toBe(
                true
            );
        });
    });
});
