"use client";

import React from "react";
import styled from "@emotion/styled";
import { reenie_beanie } from "@/styles/fonts";
import { ButtonBar, type ButtonValue } from "./button-bar";
import { toast } from "sonner";
import { List, Set } from "immutable";
import { useReward } from "react-rewards";
import Header from "../header";
import { generateHint, getBoard } from "./utils";
import { SudokuSquare } from "./square";
import type { Value } from "./types";
import type { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { StopWatch, type StopWatchAction } from "./stopwatch";

const HINT_COUNT: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
  expert: 3,
};

const SCORE_REFRESH_INTERVAL_MS = 10_000;

export const Main = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({}) => `white`};

  overflow: hidden;
  color: ${({}) => `black`};
`;

export const Board = styled.div`
  display: flex;
  border-color: ${({}) => `black`};
  border-radius: 3px;
`;

export interface SudokuProps {
  onComplete: () => void;
  hide: boolean;
}

interface HistoryState {
  values: List<Value>;
  selectedBoardIndex: number | null;
  selectedColumnIndex: number | null;
  selectedRowIndex: number | null;
  conflictBoardIndices: Set<number>;
  difficulty: Difficulty;
  hintIndex: number | null;
  notesOn: boolean;
}

interface ReducerState extends HistoryState {
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
const calculateScore = (
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
  ).toFixed();
};

type Action =
  | {
      type: "SUBMIT";
    }
  | {
      type: "SET_VALUE";
      value: number;
    }
  | {
      type: "UNDO";
    }
  | {
      type: "RESET_CURRENT_BOARD";
    }
  | {
      type: "RESET";
      difficulty: Difficulty;
    }
  | {
      type: "SET_WATCH_ACTION";
      stopWatchAction: StopWatchAction;
    }
  | {
      type: "TOGGLE_NOTES";
    }
  | {
      type: "INIT_SODUKU";
      values: List<Value>;
      board: List<List<Value>>;
    }
  | {
      type: "SET_INDICES";
      selectedBoardIndex: number;
      selectedColumnIndex: number;
      selectedRowIndex: number;
    }
  | {
      type: "CALCULATE_SCORE";
    }
  | {
      type: "HINT";
    }
  | {
      type: "UPDATE_TIME";
      totalSeconds: number;
    }
  | {
      type: "SET_INTERVAL_ID";
      intervalId: NodeJS.Timeout;
    };

const getBoardIndex = (rowIndex: number, index: number) => rowIndex * 9 + index;

const validateBoardAfterEntry = (state: ReducerState, toCheck: number) => {
  const conflictBoardIndices = [];
  if (state.selectedRowIndex != null) {
    for (let offset = 0; offset < 9; offset++) {
      const boardIndex = state.selectedRowIndex * 9 + offset;
      const boardValue = state.values.get(boardIndex);
      if (boardValue?.value === toCheck) {
        conflictBoardIndices.push(boardIndex);
      }
    }
    if (state.selectedColumnIndex != null) {
      for (const [boardIndex, value] of state.values.entries()) {
        if (boardIndex % 9 === state.selectedColumnIndex) {
          if (value.value === toCheck) {
            conflictBoardIndices.push(boardIndex);
          }
        }
      }

      const gridRowIndex =
        state.selectedRowIndex - (state.selectedRowIndex % 3);
      const gridColumnIndex =
        state.selectedColumnIndex - (state.selectedColumnIndex % 3);
      for (let colOffset = 0; colOffset < 3; colOffset++) {
        for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
          const boardIndex = getBoardIndex(
            gridRowIndex + rowOffset,
            gridColumnIndex + colOffset
          );
          const boardValue = state.values.get(boardIndex);
          if (boardValue?.value === toCheck) {
            conflictBoardIndices.push(boardIndex);
          }
        }
      }
    }
  }
  return conflictBoardIndices.length > 0 ? Set(conflictBoardIndices) : null;
};

function reducer(state: ReducerState, action: Action): ReducerState {
  // eslint-disable-next-line no-console
  console.log("Action", action.type);

  switch (action.type) {
    case "SET_VALUE": {
      const { selectedBoardIndex, values } = state;
      const { value } = action;
      if (selectedBoardIndex === null) {
        return state;
      }

      const selectedValue = values.get(selectedBoardIndex);
      if (!selectedValue || selectedValue.isOriginal) {
        return state;
      }

      if (selectedValue.value === value) {
        return {
          ...state,
          conflictBoardIndices: Set(),
          hintIndex: null,
          values: state.values.set(selectedBoardIndex, {
            ...selectedValue,
            value: null,
            hasError: false,
          }),
        };
      } else {
        const conflictBoardIndices = validateBoardAfterEntry(state, value);
        return {
          ...state,
          hintIndex: null,
          history: state.history.push({
            values,
            selectedBoardIndex: state.selectedBoardIndex,
            selectedColumnIndex: state.selectedColumnIndex,
            selectedRowIndex: state.selectedRowIndex,
            difficulty: state.difficulty,
            conflictBoardIndices: state.conflictBoardIndices,
            hintIndex: state.hintIndex,
            notesOn: state.notesOn,
          }),
          values: state.values.set(selectedBoardIndex, {
            ...selectedValue,
            value,
            answer: selectedValue.answer,
            hasError: conflictBoardIndices !== null,
          }),
          ...(conflictBoardIndices && conflictBoardIndices.size > 0
            ? { conflictBoardIndices, numMistakes: state.numMistakes + 1 }
            : {}),
        };
      }
    }
    case "UNDO": {
      const lastState = state.history.last();
      if (lastState) {
        return {
          ...state,
          hintIndex: null,
          values: lastState.values,
          selectedBoardIndex: lastState.selectedBoardIndex,
          selectedColumnIndex: lastState.selectedColumnIndex,
          selectedRowIndex: lastState.selectedRowIndex,
          difficulty: lastState.difficulty,
          conflictBoardIndices: lastState.conflictBoardIndices,
          notesOn: lastState.notesOn,
          history: state.history.pop(),
        };
      }
      return state;
    }
    case "RESET_CURRENT_BOARD": {
      const { difficulty } = state;
      return {
        ...state,
        values: state.values.map((value) => ({
          ...value,
          ...(value.isOriginal ? { value: value.answer } : { value: null }),
          errorMessage: undefined,
        })),
        selectedBoardIndex: null,
        selectedColumnIndex: null,
        selectedRowIndex: null,
        hintIndex: null,
        conflictBoardIndices: Set(),
        stopWatchAction: "reset",
        notesOn: false,
        hintCount: HINT_COUNT[difficulty],
        isSolved: false,
        numMistakes: 0,
        score: "0",
      };
    }
    case "SET_WATCH_ACTION": {
      const { stopWatchAction } = action;
      return { ...state, stopWatchAction };
    }
    case "SUBMIT": {
      return {
        ...state,
        values: state.values.map((value) => ({
          ...value,
          value: value.answer,
          errorMessage: undefined,
        })),
        isSolved: true,
        hintIndex: null,
        stopWatchAction: "pause",
        conflictBoardIndices: Set(),
      };
    }
    case "TOGGLE_NOTES": {
      return { ...state, notesOn: !state.notesOn, hintIndex: null };
    }
    case "UPDATE_TIME": {
      return { ...state, totalSeconds: action.totalSeconds };
    }
    case "CALCULATE_SCORE": {
      const score = calculateScore(state);
      return { ...state, score };
    }
    case "INIT_SODUKU": {
      const { values, board } = action;
      return {
        ...state,
        values,
        board,
        isSolved: false,
        numMistakes: 0,
      };
    }
    case "SET_INDICES": {
      const { selectedColumnIndex, selectedRowIndex, selectedBoardIndex } =
        action;
      return {
        ...state,
        hintIndex: null,
        selectedBoardIndex,
        selectedColumnIndex,
        selectedRowIndex,
      };
    }
    case "HINT": {
      if (state.hintCount <= 0) {
        toast.error("Bebi Bebi 🐧", {
          className: "bold",
          description:
            "No more hints available for Bebi Bebi 🐧. Nisuke nikuongezee 😉",
          duration: 5000,
        });
        return state;
      }
      const hintIndex = generateHint(state.values);
      if (hintIndex !== undefined) {
        const hint = state.values.get(hintIndex);
        if (hint !== undefined) {
          return {
            ...state,
            values: state.values.set(hintIndex, {
              ...hint,
              hasError: false,
              value: hint.answer,
            }),
            hintIndex,
            hintCount: state.hintCount - 1,
          };
        } else {
          toast.error("Internal Error: hintIndex out of bounds", {
            description: "No more hints available",
            duration: 5000,
          });
          return state;
        }
      } else {
        toast.error("No more hints available", {
          className: "bold",
          description: "No more hints available",
          duration: 5000,
        });
        return state;
      }
    }
    case "SET_INTERVAL_ID": {
      const { intervalId } = action;
      return { ...state, intervalId };
    }
    case "RESET": {
      const { difficulty } = action;
      const { values, board } = getBoard(difficulty);
      return {
        ...state,
        values,
        board,
        selectedBoardIndex: null,
        selectedColumnIndex: null,
        selectedRowIndex: null,
        difficulty,
        conflictBoardIndices: Set(),
        hintIndex: null,
        notesOn: false,
        history: List(),
        stopWatchAction: "reset",
        hintCount: HINT_COUNT[difficulty],
        isSolved: false,
        numMistakes: 0,
        score: "0",
      };
    }
    default:
      throw new Error(`$unknown action type: ${JSON.stringify(action)}`);
  }
}

export const Sudoku: React.FC<SudokuProps> = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    values: List<Value>(),
    board: List<List<Value>>(),
    selectedBoardIndex: null,
    selectedColumnIndex: null,
    selectedRowIndex: null,
    difficulty: "easy",
    conflictBoardIndices: Set<number>(),
    hintIndex: null,
    notesOn: false,
    history: List<HistoryState>(),
    hintCount: HINT_COUNT["easy"],
    isSolved: false,
    stopWatchAction: "idle",
    numMistakes: 0,
    totalSeconds: 0,
    score: "0",
    intervalStartTime: Date.now(),
  });

  React.useEffect(() => {
    const { values, board } = getBoard(state.difficulty);
    dispatch({ type: "INIT_SODUKU", values, board });
  }, [state.difficulty]);

  const setTotalSeconds = React.useCallback(
    (totalSeconds: number) => dispatch({ type: "UPDATE_TIME", totalSeconds }),
    []
  );

  React.useEffect(() => {
    if (state.intervalStartTime) {
      if (state.intervalId) {
        clearInterval(state.intervalId);
      }
      if (state.stopWatchAction === "start") {
        const newIntervalId = setInterval(() => {
          dispatch({ type: "CALCULATE_SCORE" });
        }, SCORE_REFRESH_INTERVAL_MS);
        dispatch({ type: "SET_INTERVAL_ID", intervalId: newIntervalId });
      }
    }
  }, [state.intervalStartTime, state.stopWatchAction]);

  const buildRow = React.useCallback(
    (rowIndex: number) =>
      function SudokuRow(value: Value, index: number) {
        const boardIndex = getBoardIndex(rowIndex, index);
        const val = state.values.get(boardIndex);

        if (!val) {
          return null;
        }

        return (
          <SudokuSquare
            key={`${state.difficulty}-${rowIndex}-${index}`}
            value={val}
            initialValue={value}
            rowIndex={rowIndex}
            boardIndex={boardIndex}
            index={index}
            selectedColumnIndex={state.selectedColumnIndex}
            selectedRowIndex={state.selectedRowIndex}
            selectedBoardIndex={state.selectedBoardIndex}
            notesOn={state.notesOn}
            setSelectedBoardIndices={(values) =>
              dispatch({ type: "SET_INDICES", ...values })
            }
            isConflictSquare={state.conflictBoardIndices.has(boardIndex)}
            isHint={state.hintIndex === boardIndex}
          />
        );
      },
    [
      state.conflictBoardIndices,
      state.difficulty,
      state.hintIndex,
      state.notesOn,
      state.selectedBoardIndex,
      state.selectedColumnIndex,
      state.selectedRowIndex,
      state.values,
    ]
  );

  const buildBoard = React.useCallback(
    (rowValues: List<Value>, rowIndex: number) => {
      return <Board key={rowIndex}>{rowValues.map(buildRow(rowIndex))}</Board>;
    },
    [buildRow]
  );

  const handleButtonPress = React.useCallback(
    (value: ButtonValue) => {
      if (typeof value === "string") {
        switch (value) {
          case "submit":
            dispatch({ type: "SUBMIT" });
            break;
          case "reset":
            dispatch({ type: "RESET_CURRENT_BOARD" });
            break;
          case "undo":
            dispatch({ type: "UNDO" });
            break;
          case "hint":
            dispatch({ type: "HINT" });
            break;
          case "toggle-notes":
            dispatch({ type: "TOGGLE_NOTES" });
            break;
          default:
            throw new Error("Invalid button value");
        }
      } else if (typeof value === "number") {
        dispatch({ type: "SET_VALUE", value });
      } else if (value.type === "change-difficulty") {
        dispatch({ type: "RESET", difficulty: value.to });
      }
    },
    [state.difficulty]
  );

  const { reward: confettiReward } = useReward("confettiReward", "confetti", {
    lifetime: 10000,
    elementCount: 300,
    elementSize: 20,
    spread: 90,
  });

  React.useEffect(() => {
    if (state.isSolved) {
      confettiReward();
    }
  }, [state.isSolved]);

  return (
    <div>
      <Header titleHeading="SUDOKU" />
      <div className="flex justify-center items-center h-screen">
        <div className="m-8 inline-flex justify-center items-center flex-row">
          <div className="items-center justify-center inline-flex sm:flex-row flex-col">
            <div className="flex flex-col items-center justify-center">
              <div className="items-stretch inline-flex justify-stretch flex-row" />
              <Main className="border-4 border-black mt-2 mr-4">
                {state.board.map(buildBoard)}
              </Main>
              <span id="confettiReward" z-index={100} />
              <span id="balloonsReward" z-index={101} />
              <span
                className={`${reenie_beanie.className} justify-start text-xl italic mt-4 w-full`}
              >
                made with love, by yours truly ❤️
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-row items-center justify-between w-full px-8">
                <div className="flex flex-row">
                  <p className="text-xs uppercase">Mistakes:&nbsp;</p>
                  <p className="text-xs text-gray-700 ">{state.numMistakes}</p>
                </div>
                <div className="flex flex-row">
                  <p className="text-xs uppercase">Score:&nbsp;</p>
                  <p className="text-xs text-gray-700 ">{state.score}</p>
                </div>
                <StopWatch
                  stopwatchAction={state.stopWatchAction}
                  setStopwatchAction={(stopWatchAction) =>
                    dispatch({ type: "SET_WATCH_ACTION", stopWatchAction })
                  }
                  setTotalSeconds={setTotalSeconds}
                />
              </div>

              <ButtonBar
                onClick={handleButtonPress}
                notesOn={state.notesOn}
                hintsRemaining={state.hintCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Sudoku.displayName = "Sudoku";
