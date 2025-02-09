import { List } from "immutable";
import { getSudoku } from "sudoku-gen";
import type { Difficulty, Value, ReducerState } from "./types";

export const HINT_COUNT: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
  expert: 3,
};

export const generateHint = (values: List<Value>) => {
  // if the values are all filled, return
  if (values.every((value) => value.value !== undefined)) {
    return;
  }
  while (true) {
    const index = Math.floor(Math.random() * 81);
    if (values.get(index)?.value === undefined) {
      return index;
    }
  }
};

export function getBoard(difficulty: Difficulty) {
  const sudoku = getSudoku(difficulty);
  const values = [...sudoku.puzzle].map((value, index) => ({
    value: value === "-" ? undefined : Number.parseInt(value, 10),
    hasError: false,
    isOriginal: value !== "-",
    answer: Number.parseInt(sudoku.solution[index], 10),
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
