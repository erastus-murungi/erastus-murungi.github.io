import { List, Set as ImmutableSet } from 'immutable';
import { getSudoku } from 'sudoku-gen';

import {
    createFixedCell,
    createUserEditableCell,
    type SudokuCell,
} from './sudoku-cell';
import { createSudokuIndex, SudokuIndex } from './sudoku-index';

import type { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

/**
 * Represents a Sudoku board consisting of cells.
 */
export class Board {
    /**
     * The length of a row in the Sudoku board.
     */
    static readonly ROW_LENGTH = 9;
    /**
     * The maximum number of iterations to find a hint.
     */
    static readonly MAX_ITERS = 5_000_000;

    /**
     * Constructs a new Board instance.
     * @param cells - A list of SudokuCell objects representing the board.
     */
    constructor(readonly cells: List<SudokuCell>) {}

    /**
     * Resets the board by clearing all user-entered values.
     * @returns A new Board instance with all cells reset.
     */
    public reset() {
        return new Board(this.cells.map((cell) => cell.resetValue()));
    }

    /**
     * Fills the board with the correct answers for all cells.
     * @returns A new Board instance with all answers revealed.
     */
    public revealAllAnswers() {
        return new Board(this.cells.map((cell) => cell.fillWithAnswer()));
    }

    /**
     * Retrieves a cell at the specified index.
     * @param index - The index of the cell, either as a number or a SudokuIndex.
     * @returns The SudokuCell at the specified index, or undefined if not found.
     */
    getCellAt(index: SudokuIndex | number) {
        if (typeof index === 'number') {
            return this.cells.get(index);
        }
        return this.cells.get(index.boardIndex);
    }

    /**
     * Sets a cell at the specified index.
     * @param index - The index of the cell, either as a number or a SudokuIndex.
     * @param cell - The SudokuCell to set at the specified index.
     * @returns A new Board instance with the updated cell.
     */
    setCellAt(index: SudokuIndex | number, cell: SudokuCell) {
        if (typeof index === 'number') {
            return new Board(this.cells.set(index, cell));
        }
        return new Board(this.cells.set(index.boardIndex, cell));
    }

    /**
     * Sets the value of a cell at the specified index.
     * @param index - The index of the cell, either as a number or a SudokuIndex.
     * @param value - The value to set in the cell.
     * @returns A new Board instance with the updated cell value.
     * @throws An error if the cell is fixed.
     */
    setCellValue(index: SudokuIndex | number, value: number): Board {
        const cell = this.getCellAt(index);
        if (cell === undefined || cell.isFixed) {
            throw new Error('Internal Error: Cannot set value in fixed cell');
        }
        return this.setCellAt(index, cell.updateValue(value));
    }

    /**
     * Removes the value of a cell at the specified index.
     * @param index - The index of the cell, either as a number or a SudokuIndex.
     * @returns A new Board instance with the cell value removed.
     * @throws An error if the cell is fixed.
     */
    removeCellValue(index: SudokuIndex | number): Board {
        const cell = this.getCellAt(index);
        if (cell === undefined || cell.isFixed) {
            throw new Error(
                'Internal Error: Cannot remove value from fixed cell'
            );
        }
        return this.setCellAt(index, cell.removeValue());
    }

    /**
     * Toggles a note in a cell at the specified index.
     * @param index - The index of the cell, either as a number or a SudokuIndex.
     * @param note - The note to toggle in the cell.
     * @returns A new Board instance with the note toggled.
     */
    toggleCellNote(index: SudokuIndex | number, note: number): Board {
        const cell = this.getCellAt(index);
        if (cell === undefined || cell.isFixed) {
            return this;
        }
        return this.setCellAt(index, cell.toggleNote(note));
    }

    /**
     * Finds a random hint index and value.
     * @returns An object containing the hint index and value, or undefined if no hint is available.
     */
    private getRandomHintIndex() {
        const hintIndex = Math.floor(Math.random() * 81);
        const cell = this.cells.get(hintIndex);
        if (cell?.editableAnswer) {
            return { hintIndex, value: cell.editableAnswer };
        }
    }

    /**
     * Provides a hint by setting a random cell to its correct value.
     * @returns An object containing the hint index and the updated Board instance.
     */
    provideHint() {
        if (this.isCompleted) {
            return { hintIndex: undefined, updatedBoard: this };
        }

        let iterationCount = 0;
        while (iterationCount < Board.MAX_ITERS) {
            const { hintIndex, value } = this.getRandomHintIndex() || {};
            if (hintIndex && value) {
                return {
                    hintIndex,
                    updatedBoard: this.setCellValue(hintIndex, value),
                };
            }
            iterationCount++;
        }
        return { hintIndex: undefined, updatedBoard: this };
    }

    /**
     * Provides multiple hints by setting several cells to their correct values.
     * @param count - The number of hints to provide.
     * @returns A new Board instance with the hints applied.
     */
    provideMultipleHints(count: number) {
        let remainingHints = Math.min(
            count,
            81 - this.cells.count((cell) => cell.isBlank)
        );
        let iterationCount = 0;
        const hints: { value: number; hintIndex: number }[] = [];
        while (remainingHints > 0 && iterationCount < Board.MAX_ITERS) {
            const result = this.getRandomHintIndex();
            if (
                result &&
                !hints.some(({ hintIndex }) => hintIndex === result.hintIndex)
            ) {
                hints.push(result);
                remainingHints--;
                iterationCount++;
            }
        }

        // We need to update the board with the hints
        // eslint-disable-next-line unicorn/no-array-reduce
        const updatedCells = hints.reduce((acc, { value, hintIndex }) => {
            const cell = acc.get(hintIndex);
            if (cell === undefined || cell.isFixed) {
                return acc;
            }
            return acc.set(hintIndex, cell.updateValue(value));
        }, this.cells);
        return new Board(updatedCells);
    }

    /**
     * Finds conflicting indices for a given cell value.
     * @param selectedIndex - The index of the cell to check.
     * @param cellValue - The value to check for conflicts.
     * @returns A set of conflicting indices, or undefined if no conflicts are found.
     */
    private findConflictingIndices(
        selectedIndex: SudokuIndex,
        cellValue: number
    ) {
        const { rowIndex: selectedRowIndex, columnIndex: selectedColumnIndex } =
            selectedIndex || {};
        const conflictingIndices: number[] = [];
        if (selectedRowIndex !== undefined) {
            // Check for conflicts in the row
            for (let offset = 0; offset < Board.ROW_LENGTH; offset++) {
                const boardIndex = selectedRowIndex * Board.ROW_LENGTH + offset;
                const boardValue = this.getCellAt(boardIndex);
                if (boardValue?.value === cellValue) {
                    conflictingIndices.push(boardIndex);
                }
            }
            if (selectedColumnIndex !== undefined) {
                // Check for conflicts in the column
                for (const [boardIndex, cell] of this.cells.entries()) {
                    if (boardIndex % Board.ROW_LENGTH === selectedColumnIndex) {
                        if (cell.value === cellValue) {
                            conflictingIndices.push(boardIndex);
                        } else {
                            continue;
                        }
                    }
                }

                const gridRowIndex = selectedRowIndex - (selectedRowIndex % 3);
                const gridColumnIndex =
                    selectedColumnIndex - (selectedColumnIndex % 3);
                // Check for conflicts in the 3x3 grid
                for (let colOffset = 0; colOffset < 3; colOffset++) {
                    for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
                        const index = createSudokuIndex({
                            rowIndex: gridRowIndex + rowOffset,
                            columnIndex: gridColumnIndex + colOffset,
                        });
                        const boardValue = this.getCellAt(index);
                        if (boardValue?.value === cellValue) {
                            conflictingIndices.push(index.boardIndex);
                        }
                    }
                }
            }
        }
        return conflictingIndices.length > 0
            ? ImmutableSet(conflictingIndices)
            : undefined;
    }

    /**
     * Checks for conflicts and sets a cell value if no conflicts are found.
     * @param index - The index of the cell to set.
     * @param cellValue - The value to set in the cell.
     * @returns An object containing the updated Board instance and any conflicting indices.
     */
    public checkForConflictsAndSet(index: SudokuIndex, cellValue: number) {
        const conflictingIndices = this.findConflictingIndices(
            index,
            cellValue
        );
        if (conflictingIndices) {
            return { updatedBoard: this, conflictingIndices };
        }
        return {
            updatedBoard: this.setCellValue(index, cellValue),
            conflictingIndices: undefined,
        };
    }

    /**
     * Checks if the board is completely solved.
     * @returns True if the board is solved, otherwise false.
     */
    get isCompleted() {
        return this.cells.every((cell) => cell.isCompleted);
    }

    /**
     * Retrieves the board as a grid of cells.
     * @returns A list of lists representing the grid of cells.
     */
    get grid(): List<List<SudokuCell>> {
        return List(
            Array.from({ length: Board.ROW_LENGTH }, (_, i) =>
                List(
                    this.cells.slice(
                        i * Board.ROW_LENGTH,
                        i * Board.ROW_LENGTH + Board.ROW_LENGTH
                    )
                )
            )
        );
    }
}

/**
 * Creates a new Board instance from a given difficulty level.
 * @param difficulty - The difficulty level for generating the Sudoku puzzle.
 * @returns A new Board instance with the generated puzzle.
 */
export const createBoardFromDifficulty = (difficulty: Difficulty) => {
    const { solution, puzzle } = getSudoku(difficulty);
    return new Board(
        List(
            [...puzzle].map((value, index) =>
                value === '-'
                    ? createUserEditableCell(
                          Number.parseInt(solution[index], 10)
                      )
                    : createFixedCell(Number.parseInt(value, 10))
            )
        )
    );
};

/**
 * Creates an empty Board instance.
 * @returns A new Board instance with no cells filled.
 */
export const createEmptyBoard = () => {
    return new Board(List());
};

/**
 * Creates a new Board instance from a list of SudokuCell objects.
 * @param cells - A list of SudokuCell objects.
 * @returns A new Board instance with the specified cells.
 */
export const createBoardFromCells = (cells: List<SudokuCell>) => {
    return new Board(cells);
};
