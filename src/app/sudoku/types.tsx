import type { List } from "immutable";

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

export type Maybe<T> = T | null | undefined;
