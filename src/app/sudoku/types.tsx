import type { List, Set } from 'immutable';
import type { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import type { Board, IndexSet } from './utils';

export type { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

export type Maybe<T> = T | undefined;
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
export type StopWatchAction = 'start' | 'pause' | 'reset';

export type ActionButton =
    | 'submit'
    | 'undo'
    | 'hint'
    | 'toggle-notes'
    | 'reset'
    | 'togge-auto-check'
    | { type: 'change-difficulty'; to: Difficulty };

export type ButtonValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | ActionButton;

export type Value =
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

export type SudokuBoardRow = List<Value>;

export interface HistoryState {
    board: Board;
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
