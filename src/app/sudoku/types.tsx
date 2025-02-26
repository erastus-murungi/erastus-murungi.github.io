import type { List } from 'immutable';
import type { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import type { SudokuHistory, HistoryState } from './models/sudoku-history';
import type { SudokuCell } from './models/sudoku-cell';

export type { SudokuIndex } from './models/sudoku-index';
export type { SudokuCell } from './models/sudoku-cell';
export type { Board } from './models/sudoku-board';
export type { SudokuHistory, HistoryState } from './models/sudoku-history';

export type { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

export type Maybe<T> = T | undefined;
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

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

export type SudokuBoardRow = List<SudokuCell>;

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

/**
 * Represents the `ref`s used in the Sudoku game. The UI doesn't change
 * based on these refs, but they are used to store state that is not
 * directly related to the UI.
 */
export interface SudokuRefs {
    /**
     * The number of seconds that have elapsed since the game started.
     */
    elapsedSeconds: number;

    /**
     * The history of moves made in the Sudoku game.
     */
    history: SudokuHistory;

    /**
     * A reference to the interval timer used for tracking elapsed time.
     */
    intervalRef: Maybe<NodeJS.Timeout>;
}
