import { List, Set } from 'immutable';
import { getSudoku } from 'sudoku-gen';
import type { Difficulty, Value, ReducerState } from './types';

export const HINT_COUNT: Record<Difficulty, number> = {
    easy: 0,
    medium: 1,
    hard: 2,
    expert: 3,
};

export const generateHint = (board: Board) => {
    // if the values are all filled, return
    if (board.values.every((value) => value.value !== undefined)) {
        return;
    }
    while (true) {
        const index = Math.floor(Math.random() * 81);
        if (board.values.get(index)?.value === undefined) {
            return index;
        }
    }
};

export const generateHints = (count: number, board: Board) => {
    // if the values are all filled, return
    if (board.values.every((value) => value.value !== undefined)) {
        return;
    }
    let numHints = Math.min(
        count,
        81 - board.values.count((value) => value.value !== undefined)
    );
    const hints: number[] = [];
    while (numHints > 0) {
        const index = Math.floor(Math.random() * 81);
        if (
            !hints.includes(index) &&
            board.values.get(index)?.value === undefined
        ) {
            hints.push(index);
            numHints--;
        }
    }
    return hints;
};

export const genBoardFromValues = (values: List<Value>) =>
    List(
        Array.from({ length: 9 }, (_, i) =>
            List(values.slice(i * 9, i * 9 + 9))
        )
    );

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
    multipliers: typeof MUTLIPLIERS = MUTLIPLIERS
): string => {
    const { totalSeconds, difficulty, hintCount } = reducerState;
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
    readonly values: List<Value>;

    constructor(values: List<Value>) {
        this.values = values;
    }

    public static createWithDifficulty(difficulty: Difficulty) {
        const sudoku = getSudoku(difficulty);
        const valuesList = [...sudoku.puzzle].map((value, index) => ({
            value: value === '-' ? undefined : Number.parseInt(value, 10),
            hasError: false,
            isOriginal: value !== '-',
            answer: Number.parseInt(sudoku.solution[index], 10),
            isSelectedBoardIndex: false,
            notes: Set<number>(),
        }));
        return new Board(List(valuesList));
    }

    public static createFromValues(values: List<Value>) {
        return new Board(values);
    }

    public static empty() {
        return new Board(List());
    }

    get grid(): List<List<Value>> {
        return List(
            Array.from({ length: 9 }, (_, i) =>
                List(this.values.slice(i * 9, i * 9 + 9))
            )
        );
    }

    get(accessor: IndexSet | number): Value | undefined {
        if (typeof accessor === 'number') {
            return this.values.get(accessor);
        }
        return this.values.get(accessor.boardIndex);
    }

    getFromBoardIndex(boardIndex: number): Value | undefined {
        return this.values.get(boardIndex);
    }

    set(accessor: IndexSet | number, value: Value): Board {
        if (typeof accessor === 'number') {
            return new Board(this.values.set(accessor, value));
        }
        return new Board(this.values.set(accessor.boardIndex, value));
    }

    get isSolved() {
        return this.values.every((val) => val.value === val.answer);
    }
}

export const createIndexSet = ({
    columnIndex,
    rowIndex,
}: {
    columnIndex: number;
    rowIndex: number;
}) => new IndexSet(columnIndex, rowIndex);
