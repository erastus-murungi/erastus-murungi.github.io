import type { List, Set } from 'immutable';
import type { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import type { Board, IndexSet, Cell, SudokuHistory } from './utils';

export type { Cell, IndexSet, Board, SudokuHistory } from './utils';

export type { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

export type Maybe<T> = T | undefined;
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

/**
 * Extract one part of a discriminated union
 */
export type ExtractFromUnion<T, U> = T extends T
    ? U extends Partial<T>
        ? T
        : never
    : never;

/**
 * The action that the stopwatch should take
 */
export type StopwatchCommand =
    /** The stopwatch should start */
    | 'start'
    /** The stopwatch should pause */
    | 'pause'
    /** The stopwatch should reset */
    | 'reset';

/**
 * The type of the action that can be taken on a button
 */
export type ButtonAction =
    | 'submit'
    | 'undo'
    | 'hint'
    | 'toggle-notes'
    | 'reset'
    | 'togge-auto-check'
    | { type: 'change-difficulty'; to: Difficulty };

type ButtonNumericValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type ButtonInputValue = ButtonNumericValue | ButtonAction;

export type SudokuBoardRow = List<Cell>;

/**
 * The state of the history
 */
export interface HistoryState {
    /**
     * The board at the current state
     */
    board: Board;
    /**
     * The selected index set, if any
     */
    selectedIndices?: IndexSet;
    /**
     * The indices of the board that are in conflict
     */
    conflictingIndices: Set<number>;
    /**
     * The index of the hint, if any
     */
    hintIndex?: number;
    /**
     * Whether notes are enabled
     */
    notesEnabled: boolean;
}

export interface ReducerState extends HistoryState {
    stopwatchCommand: StopwatchCommand;
    hintUsageCount: number;
    isSudokuSolved: boolean;
    moveCount: number;
    mistakeCount: number;
    playerScore: string;
    autoCheckEnabled: boolean;
    overlayVisible: boolean;
    gameDifficulty: Difficulty;
}

export interface RefState {
    elapsedSeconds: number;
    history: SudokuHistory;
    intervalRef: Maybe<NodeJS.Timeout>;
}
