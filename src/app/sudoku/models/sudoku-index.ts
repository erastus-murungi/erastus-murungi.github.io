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

    /**
     * Calculates the starting position of the 3x3 grid containing the current cell.
     * @returns A new SudokuIndex representing the top-left corner of the 3x3 grid.
     */
    public getGridStartIndex() {
        return new SudokuIndex(
            Math.floor(this.columnIndex / 3) * 3,
            Math.floor(this.rowIndex / 3) * 3
        );
    }

    /**
     * Determines if the current cell is in the same 3x3 grid as another cell.
     * @param position - A linear board index or a SudokuIndex instance.
     * @returns True if both cells are in the same 3x3 grid, otherwise false.
     */
    public isInSame3by3Grid(index: number | SudokuIndex) {
        const sudokuIndex =
            index instanceof SudokuIndex
                ? index
                : createSudokuIndexFromLinearIndex(index);
        return this.getGridStartIndex().equals(sudokuIndex.getGridStartIndex());
    }

    /**
     * Checks if the current cell is equal to another SudokuIndex.
     * @param other - Another instance of SudokuIndex.
     * @returns True if both positions are equal, otherwise false.
     */
    public equals(other: SudokuIndex) {
        return (
            this.columnIndex === other.columnIndex &&
            this.rowIndex === other.rowIndex
        );
    }

    /**
     * Checks if the current cell is in the same row as another cell.
     * @param other - Another instance of SudokuIndex.
     * @returns True if both cells are in the same row, otherwise false.
     */
    public isInSameRow(other: SudokuIndex) {
        return this.rowIndex === other.rowIndex;
    }

    /**
     * Checks if the current cell is in the same column as another cell.
     * @param other - Another instance of SudokuIndex.
     * @returns True if both cells are in the same column, otherwise false.
     */
    public isInSameColumn(other: SudokuIndex) {
        return this.columnIndex === other.columnIndex;
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

/**
 * Creates a SudokuIndex from a linear board index.
 * @param linearIndex - The linear index in a 9x9 Sudoku board (0 to 80).
 * @returns A new instance of SudokuIndex corresponding to the given board index.
 */
export const createSudokuIndexFromLinearIndex = (linearIndex: number) =>
    new SudokuIndex(linearIndex % 9, Math.floor(linearIndex / 9));
