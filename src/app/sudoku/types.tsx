import type { List, Set } from 'immutable';
import type { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import type { Board, IndexSet } from './utils';

export type { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

export type Maybe<T> = T | undefined;
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type ExtractFromUnion<T, U> = T extends T
    ? U extends Partial<T>
        ? T
        : never
    : never;

/**
 * The action that the stopwatch should take
 */
export type StopWatchAction =
    /** The stopwatch should start */
    | 'start'
    /** The stopwatch should pause */
    | 'pause'
    /** The stopwatch should reset */
    | 'reset';

/**
 * The type of the action that can be taken on a button
 */
export type ActionButton =
    | 'submit'
    | 'undo'
    | 'hint'
    | 'toggle-notes'
    | 'reset'
    | 'togge-auto-check'
    | { type: 'change-difficulty'; to: Difficulty };

export type ButtonValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | ActionButton;

/**
 * The value of a square on the board
 * - If `isOriginal` is true, then the value is the original value of the board
 * - If `isOriginal` is false, then the value is the current value of the board
 */
export type Cell =
    | {
          isOriginal: true;
          value: number;
      }
    | {
          isOriginal: false;
          value: {
              current: number | undefined;
              answer: number;
          };
          isSelectedBoardIndex: boolean;
          notes: Set<number>;
      };

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
     * The selected index set
     */
    selectedIndexSet?: IndexSet;
    conflictBoardIndices: Set<number>;
    difficulty: Difficulty;
    hintIndex?: number;
    notesOn: boolean;
}

export interface ReducerState extends HistoryState {
    history: List<HistoryState>;
    stopWatchAction: StopWatchAction;
    hintCount: number;
    isSolved: boolean;
    numMoves: number;
    numMistakes: number;
    score: string;
    autoCheckEnabled: boolean;
    showOverlay: boolean;
}
