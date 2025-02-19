/**
 * Represents an index into a Sudoku board.
 * Provides methods to navigate to adjacent cells in the board.
 */
export class SudokuIndex {
    /**
     * Constructs a new SudokuIndex.
     * @param columnIndex - The column index of the cell (0-based).
     * @param rowIndex - The row index of the cell (0-based).
     */
    constructor(
        public readonly columnIndex: number,
        public readonly rowIndex: number
    ) {}

    /**
     * Calculates the linear board index based on row and column indices.
     * @returns The linear index in a 9x9 Sudoku board.
     */
    get boardIndex() {
        return this.rowIndex * 9 + this.columnIndex;
    }

    /**
     * Gets the index of the cell to the left, if it exists.
     * @returns A new SudokuIndex for the left cell, or undefined if at the left edge.
     */
    get left(): SudokuIndex | undefined {
        return this.columnIndex > 0
            ? new SudokuIndex(this.columnIndex - 1, this.rowIndex)
            : undefined;
    }

    /**
     * Gets the index of the cell to the right, if it exists.
     * @returns A new SudokuIndex for the right cell, or undefined if at the right edge.
     */
    get right(): SudokuIndex | undefined {
        return this.columnIndex < 8
            ? new SudokuIndex(this.columnIndex + 1, this.rowIndex)
            : undefined;
    }

    /**
     * Gets the index of the cell above, if it exists.
     * @returns A new SudokuIndex for the cell above, or undefined if at the top edge.
     */
    get up(): SudokuIndex | undefined {
        return this.rowIndex > 0
            ? new SudokuIndex(this.columnIndex, this.rowIndex - 1)
            : undefined;
    }

    /**
     * Gets the index of the cell below, if it exists.
     * @returns A new SudokuIndex for the cell below, or undefined if at the bottom edge.
     */
    get down(): SudokuIndex | undefined {
        return this.rowIndex < 8
            ? new SudokuIndex(this.columnIndex, this.rowIndex + 1)
            : undefined;
    }
}
/**
 * Creates a new SudokuIndex.
 * @param param0 - An object containing the column and row indices.
 * @returns A new instance of SudokuIndex.
 */
export const createSudokuIndex = ({
    columnIndex,
    rowIndex,
}: {
    columnIndex: number;
    rowIndex: number;
}) => new SudokuIndex(columnIndex, rowIndex);
