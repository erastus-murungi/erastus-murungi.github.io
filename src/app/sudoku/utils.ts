import { List } from "immutable";
import type { Value } from "./types";
import type { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { getSudoku } from "sudoku-gen";

export const generateHint = (values: List<Value>) => {
  // if the values are all filled, return
  if (values.every((value) => value.value !== null)) {
    return;
  }
  while (true) {
    const index = Math.floor(Math.random() * 81);
    if (values.get(index)?.value === null) {
      return index;
    }
  }
};

export function getBoard(difficulty: Difficulty) {
  const sudoku = getSudoku(difficulty);
  const values = sudoku.puzzle.split("").map((value, index) => ({
    value: value === "-" ? null : parseInt(value, 10),
    hasError: false,
    isOriginal: value !== "-",
    answer: parseInt(sudoku.solution[index], 10),
    isSelectedBoardIndex: false,
    noteValues: List([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((val) => ({
      value: val,
      isSelected: false,
    })),
  }));
  return {
    values: List(values),
    board: List(
      Array.from({ length: 9 }, (_, i) => List(values.slice(i * 9, i * 9 + 9)))
    ),
  };
}
