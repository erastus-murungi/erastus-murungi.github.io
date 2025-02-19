import { List, Set } from 'immutable';
import { getSudoku } from 'sudoku-gen';
import type { Difficulty, ReducerState, HistoryState } from './types';

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

export class Cell {
    private constructor(
        private readonly _value:
            | number
            | { current: number | undefined; answer: number },
        private notes?: Set<number>
    ) {}

    get isOriginal() {
        return typeof this._value === 'number';
    }

    public static createOriginal(value: number) {
        return new Cell(value);
    }

    public static createEditable(answer: number) {
        return new Cell({ current: undefined, answer }, Set());
    }

    public setCurrentValue(current: number) {
        return typeof this._value === 'number'
            ? this
            : new Cell({ current, answer: this._value.answer }, this.notes);
    }

    public clearCurrentValue() {
        return typeof this._value === 'number'
            ? this
            : new Cell(
                  { current: undefined, answer: this._value.answer },
                  this.notes
              );
    }

    get isUnfilled() {
        return (
            typeof this._value !== 'number' && this._value.current === undefined
        );
    }

    get isUserSolved() {
        return (
            typeof this._value !== 'number' &&
            this._value.current === this._value.answer
        );
    }

    get isSolved() {
        return (
            typeof this._value === 'number' ||
            (typeof this._value !== 'number' &&
                this._value.current === this._value.answer)
        );
    }

    public setToAnswer() {
        return typeof this._value === 'number'
            ? this
            : new Cell(
                  {
                      current: this._value.answer,
                      answer: this._value.answer,
                  },
                  this.notes
              );
    }

    get value() {
        return typeof this._value === 'number'
            ? this._value
            : this._value.current;
    }

    get editableAnswer() {
        return typeof this._value === 'number' ? undefined : this._value.answer;
    }

    get answer() {
        return typeof this._value === 'number'
            ? this._value
            : this._value.answer;
    }

    public hasNoteValue(note: number) {
        return this.notes?.has(note) ?? false;
    }

    public setNoteValue(note: number) {
        if (this.isOriginal) {
            return this;
        }
        if (this.notes?.isEmpty()) {
            throw new Error('Internal Error: Notes are empty');
        }
        return new Cell(this._value, this.notes?.add(note));
    }

    public clearNoteValue(note: number) {
        if (this.isOriginal) {
            return this;
        }
        if (this.notes?.isEmpty()) {
            throw new Error('Internal Error: Notes are empty');
        }
        return new Cell(this._value, this.notes?.delete(note));
    }

    public toggleNoteValue(note: number) {
        if (this.isOriginal) {
            return this;
        }
        return this.hasNoteValue(note)
            ? this.clearNoteValue(note)
            : this.setNoteValue(note);
    }

    public hasNotes() {
        return !this.lackNotes();
    }

    public lackNotes() {
        return this.notes?.isEmpty() ?? true;
    }
}

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
                        ? Cell.createEditable(
                              Number.parseInt(sudoku.solution[index], 10)
                          )
                        : Cell.createOriginal(Number.parseInt(value, 10))
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
        return new Board(this.cells.map((cell) => cell.clearCurrentValue()));
    }

    public setAllAnswers() {
        return new Board(this.cells.map((cell) => cell.setToAnswer()));
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
        const cell = this.get(accessor);
        if (cell === undefined || cell.isOriginal) {
            return this;
        }
        return this.set(accessor, cell.setCurrentValue(current));
    }

    clearCurrentValue(accessor: IndexSet | number): Board {
        const cell = this.get(accessor);
        if (cell === undefined || cell.isOriginal) {
            return this;
        }
        return this.set(accessor, cell.clearCurrentValue());
    }

    toggleNoteValue(accessor: IndexSet | number, note: number): Board {
        const cell = this.get(accessor);
        if (cell === undefined || cell.isOriginal) {
            return this;
        }
        return this.set(accessor, cell.toggleNoteValue(note));
    }

    private getHintIndex() {
        const hintIndex = Math.floor(Math.random() * 81);
        const cell = this.cells.get(hintIndex);
        if (cell?.editableAnswer) {
            return { hintIndex, value: cell.editableAnswer };
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
            81 - this.cells.count((cell) => cell.isUnfilled)
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
        return this.cells.every((cell) => cell.isSolved);
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

export class SudokuHistory implements Iterable<HistoryState> {
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

export const createHistory = () => new SudokuHistory();
