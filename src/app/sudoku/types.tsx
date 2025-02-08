import type { List, Set } from "immutable";
import type { Difficulty } from "sudoku-gen/dist/types/difficulty.type";

export type { Difficulty };

export type Maybe<T> = T | null | undefined;
export type StopWatchAction = "start" | "pause" | "reset" | "idle";

export interface NoteValue {
  value: number;
  isSelected: boolean;
}

export interface Value {
  value: number | null;
  hasError: boolean;
  isOriginal: boolean;
  isSelectedBoardIndex: boolean;
  answer: number;
  noteValues: List<NoteValue>;
}

export interface HistoryState {
  values: List<Value>;
  selectedBoardIndex: number | null;
  selectedColumnIndex: number | null;
  selectedRowIndex: number | null;
  conflictBoardIndices: Set<number>;
  difficulty: Difficulty;
  hintIndex: number | null;
  notesOn: boolean;
}

export interface ReducerState extends HistoryState {
  history: List<HistoryState>;
  stopWatchAction: StopWatchAction;
  hintCount: number;
  isSolved: boolean;
  numMistakes: number;
  board: List<List<Value>>;
  totalSeconds: number;
  score: string;
  intervalId?: NodeJS.Timeout;
  intervalStartTime?: number;
}
