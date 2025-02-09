import type { List, Set } from "immutable";
import type { Difficulty } from "sudoku-gen/dist/types/difficulty.type";

export type { Difficulty } from "sudoku-gen/dist/types/difficulty.type";

export type Maybe<T> = T | undefined;
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
export type StopWatchAction = "start" | "pause" | "reset" | "idle";

export interface Value {
  value?: number;
  hasError: boolean;
  isOriginal: boolean;
  isSelectedBoardIndex: boolean;
  answer: number;
  noteValues: List<{
    value: number;
    isSelected: boolean;
  }>;
}

export type SudokuBoardRow = List<Value>;
export type SudokuBoard = List<SudokuBoardRow>;

export interface HistoryState {
  values: List<Value>;
  selectedBoardIndex?: number;
  selectedColumnIndex?: number;
  selectedRowIndex?: number;
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
  numMistakes: number;
  board: SudokuBoard;
  totalSeconds: number;
  score: string;
  intervalId?: NodeJS.Timeout;
  intervalStartTime?: number;
}
