import { List, Set } from 'immutable';
import { getSudoku } from 'sudoku-gen';
import type {
    Difficulty,
    Cell,
    ReducerState,
    ExtractFromUnion,
    HistoryState,
    SudokuHistory,
} from './types';

export const HINT_COUNT: Record<Difficulty, number> = {
    easy: 0,
    medium: 1,
    hard: 2,
    expert: 3,
};

export const getBoardIndex = (rowIndex: number, index: number) =>
    rowIndex * 9 + index;

const MUTLIPLIERS = {
    basePointsMap: {
        easy: 100,
        medium: 200,
        hard: 300,
        expert: 400,
    },
    hintMultiplier: 10,
    timePenaltyExponent: 0.002,
};

/**
 * We calculate the score using a number of factors:
 * - Time taken to solve the puzzle
 * - Difficulty of the puzzle
 * - Number of hints used
 *
 * @param reducerState
 */
export const calculateScore = (
    reducerState: ReducerState,
    totalSeconds: number,
    multipliers: typeof MUTLIPLIERS = MUTLIPLIERS
): string => {
    const { gameDifficulty: difficulty, hintUsageCount: hintCount } =
        reducerState;
    const { hintMultiplier, timePenaltyExponent, basePointsMap } = multipliers;
    const basePoints = basePointsMap[difficulty];
    const hintsPenalty = hintMultiplier * hintCount;
    const scoreAfterHintsPenalty = basePoints - hintsPenalty;

    return (
        scoreAfterHintsPenalty *
        Math.pow(Math.E, 1 - timePenaltyExponent * totalSeconds)
    ).toFixed(0);
};

export class IndexSet {
    constructor(
        public readonly columnIndex: number,
        public readonly rowIndex: number
    ) {}

    get boardIndex() {
        return this.rowIndex * 9 + this.columnIndex;
    }

    get left(): IndexSet | undefined {
        return this.columnIndex > 0
            ? new IndexSet(this.columnIndex - 1, this.rowIndex)
            : undefined;
    }

    get right(): IndexSet | undefined {
        return this.columnIndex < 8
            ? new IndexSet(this.columnIndex + 1, this.rowIndex)
            : undefined;
    }

    get up(): IndexSet | undefined {
        return this.rowIndex > 0
            ? new IndexSet(this.columnIndex, this.rowIndex - 1)
            : undefined;
    }

    get down(): IndexSet | undefined {
        return this.rowIndex < 8
            ? new IndexSet(this.columnIndex, this.rowIndex + 1)
            : undefined;
    }
}

export class Board {
    readonly cells: List<Cell>;
    static readonly MAX_ITERS = 5_000_000;

    constructor(cells: List<Cell>) {
        this.cells = cells;
    }

    public static createWithDifficulty(difficulty: Difficulty) {
        const sudoku = getSudoku(difficulty);
        return new Board(
            List(
                [...sudoku.puzzle].map((value, index) =>
                    value === '-'
                        ? ({
                              isOriginal: false as const,
                              value: {
                                  current: undefined,
                                  answer: Number.parseInt(
                                      sudoku.solution[index],
                                      10
                                  ),
                              },
                              isSelectedBoardIndex: false,
                              notes: Set<number>(),
                          } as const)
                        : {
                              isOriginal: true as const,
                              value: Number.parseInt(value, 10),
                          }
                )
            )
        );
    }

    public static createFromValues(cells: List<Cell>) {
        return new Board(cells);
    }

    public static empty() {
        return new Board(List());
    }

    public reset() {
        return new Board(
            this.cells.map((cell) =>
                cell.isOriginal
                    ? cell
                    : {
                          ...cell,
                          value: {
                              current: undefined,
                              answer: cell.value.answer,
                          },
                      }
            )
        );
    }

    public setAllAnswers() {
        return new Board(
            this.cells.map((cell) =>
                cell.isOriginal
                    ? cell
                    : {
                          ...cell,
                          value: {
                              current: cell.value.answer,
                              answer: cell.value.answer,
                          },
                      }
            )
        );
    }

    get(accessor: IndexSet | number): Cell | undefined {
        if (typeof accessor === 'number') {
            return this.cells.get(accessor);
        }
        return this.cells.get(accessor.boardIndex);
    }

    getFromBoardIndex(boardIndex: number): Cell | undefined {
        return this.cells.get(boardIndex);
    }

    set(accessor: IndexSet | number, value: Cell): Board {
        if (typeof accessor === 'number') {
            return new Board(this.cells.set(accessor, value));
        }
        return new Board(this.cells.set(accessor.boardIndex, value));
    }

    setCurrentValue(accessor: IndexSet | number, current: number): Board {
        const value = this.get(accessor);
        if (value === undefined || value.isOriginal) {
            return this;
        }
        return this.set(accessor, {
            ...value,
            value: { ...value.value, current },
        });
    }

    clearCurrentValue(accessor: IndexSet | number): Board {
        const value = this.get(accessor);
        if (value === undefined || value.isOriginal) {
            return this;
        }
        return this.set(accessor, {
            ...value,
            value: { ...value.value, current: undefined },
        });
    }

    toggleNoteValue(accessor: IndexSet | number, note: number): Board {
        const cell = this.get(accessor);
        if (cell === undefined || cell.isOriginal) {
            return this;
        }
        return this.set(accessor, {
            ...cell,
            notes: cell.notes.has(note)
                ? cell.notes.delete(note)
                : cell.notes.add(note),
        });
    }

    private isUnfilledCell(
        cell: Cell | undefined
    ): cell is ExtractFromUnion<Cell, { isOriginal: false }> {
        return !!(
            cell &&
            cell.isOriginal === false &&
            cell.value.current === undefined
        );
    }

    private getHintIndex() {
        const hintIndex = Math.floor(Math.random() * 81);
        const cell = this.cells.get(hintIndex);
        if (this.isUnfilledCell(cell)) {
            return { hintIndex, value: cell.value.answer };
        }
    }

    generateHint() {
        if (this.isSolved) {
            return { hintIndex: undefined, updatedBoard: this };
        }

        let numIters = 0;
        while (numIters < Board.MAX_ITERS) {
            const { hintIndex, value } = this.getHintIndex() || {};
            if (hintIndex && value) {
                return {
                    hintIndex,
                    updatedBoard: this.setCurrentValue(hintIndex, value),
                };
            }
            numIters++;
        }
        return { hintIndex: undefined, updatedBoard: this };
    }

    generateHints(count: number) {
        let numHints = Math.min(
            count,
            81 -
                this.cells.count(
                    (cell) =>
                        cell.isOriginal || cell.value.current !== undefined
                )
        );
        let numIters = 0;
        const hints: { value: number; hintIndex: number }[] = [];
        while (numHints > 0 && numIters < Board.MAX_ITERS) {
            const result = this.getHintIndex();
            if (
                result &&
                !hints.some(({ hintIndex }) => hintIndex === result.hintIndex)
            ) {
                hints.push(result);
                numHints--;
                numIters++;
            }
        }

        // We need to update the board with the hints
        // eslint-disable-next-line unicorn/no-array-reduce
        const updatedCells = hints.reduce(
            (acc, { value, hintIndex }) =>
                acc.setIn([hintIndex, 'value', 'current'], value),
            this.cells
        );
        return new Board(updatedCells);
    }

    private validateEntry(selectedIndexSet: IndexSet, toCheck: number) {
        const { rowIndex: selectedRowIndex, columnIndex: selectedColumnIndex } =
            selectedIndexSet || {};
        const conflictBoardIndices: number[] = [];
        if (selectedRowIndex !== undefined) {
            for (let offset = 0; offset < 9; offset++) {
                const boardIndex = selectedRowIndex * 9 + offset;
                const boardValue = this.get(boardIndex);
                if (boardValue?.value === toCheck) {
                    conflictBoardIndices.push(boardIndex);
                }
            }
            if (selectedColumnIndex !== undefined) {
                for (const [boardIndex, cell] of this.cells.entries()) {
                    if (boardIndex % 9 === selectedColumnIndex) {
                        if (cell.value === toCheck) {
                            conflictBoardIndices.push(boardIndex);
                        } else {
                            continue;
                        }
                    }
                }

                const gridRowIndex = selectedRowIndex - (selectedRowIndex % 3);
                const gridColumnIndex =
                    selectedColumnIndex - (selectedColumnIndex % 3);
                for (let colOffset = 0; colOffset < 3; colOffset++) {
                    for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
                        const boardIndex = getBoardIndex(
                            gridRowIndex + rowOffset,
                            gridColumnIndex + colOffset
                        );
                        const boardValue = this.get(boardIndex);
                        if (boardValue?.value === toCheck) {
                            conflictBoardIndices.push(boardIndex);
                        }
                    }
                }
            }
        }
        return conflictBoardIndices.length > 0
            ? Set(conflictBoardIndices)
            : undefined;
    }

    public setAndValidate(indexSet: IndexSet, value: number) {
        const conflictBoardIndices = this.validateEntry(indexSet, value);
        if (conflictBoardIndices) {
            return { updatedBoard: this, conflictBoardIndices };
        }
        return {
            updatedBoard: this.setCurrentValue(indexSet, value),
            conflictBoardIndices: undefined,
        };
    }

    get isSolved() {
        return this.cells.every(
            (cell) =>
                cell.isOriginal || cell.value.current === cell.value.answer
        );
    }

    get grid(): List<List<Cell>> {
        return List(
            Array.from({ length: 9 }, (_, i) =>
                List(this.cells.slice(i * 9, i * 9 + 9))
            )
        );
    }
}

export const createIndexSet = ({
    columnIndex,
    rowIndex,
}: {
    columnIndex: number;
    rowIndex: number;
}) => new IndexSet(columnIndex, rowIndex);

export class SudokuHistoryImpl
    implements Iterable<HistoryState>, SudokuHistory
{
    private history: List<HistoryState> = List();
    private currentIndex = -1;

    get current() {
        return this.history.get(this.currentIndex);
    }

    get length() {
        return this.history.size;
    }

    get isAtEnd() {
        return this.currentIndex === this.history.size - 1;
    }

    get isAtStart() {
        return this.currentIndex === 0;
    }

    get canUndo() {
        return this.currentIndex >= 0;
    }

    get canRedo() {
        return this.currentIndex <= this.history.size - 1;
    }

    get last() {
        return this.history.last();
    }

    get first() {
        return this.history.first();
    }

    push(state: HistoryState) {
        this.history = this.history.push(state);
        this.currentIndex = this.history.size - 1;
    }

    undo() {
        if (this.canUndo) {
            const state = this.history.get(this.currentIndex);
            this.currentIndex--;
            return state;
        }
    }

    redo() {
        if (this.canRedo) {
            const state = this.history.get(this.currentIndex);
            this.currentIndex++;
            return state;
        }
    }

    [Symbol.iterator]() {
        return this.history[Symbol.iterator]();
    }
}

export const createHistory = (): SudokuHistory => new SudokuHistoryImpl();
