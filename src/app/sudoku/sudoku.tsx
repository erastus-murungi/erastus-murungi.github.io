"use client";

import React from "react";
import styled from "@emotion/styled";
import { lora, reenie_beanie } from "@/styles/fonts";
import { type Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { ButtonBar, type ButtonValue } from "./button-bar";
import { getSudoku } from "sudoku-gen";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { useStopwatch } from "react-timer-hook";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { List, Set } from "immutable";
import { css } from "@emotion/react";
import { useReward } from "react-rewards";
import Header from "../header";

type Maybe<T> = T | null | undefined;

const HINT_COUNT: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
  expert: 3,
};

const generateHint = (values: List<Value>) => {
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

type StopWatchAction = "START" | "PAUSE" | "RESET" | "NOT_STARTED";

const StopWatch: React.FC<{
  stopwatchAction: StopWatchAction;
  setStopwatchAction: (stopwatchAction: StopWatchAction) => void;
}> = React.memo(({ stopwatchAction, setStopwatchAction }) => {
  const { seconds, minutes, hours, pause, start, reset } = useStopwatch({
    autoStart: false,
  });

  React.useEffect(() => {
    console.log("StopWatch rendered", stopwatchAction);
    switch (stopwatchAction) {
      case "START":
        start();
        break;
      case "PAUSE":
        pause();
        break;
      case "RESET":
        reset();
        break;
    }
  }, [stopwatchAction]);

  return (
    <div className="inline-flex flex-row w-[100px] justify-between items-center space-x-2">
      <Button
        className="rounded-full w-4 h-4 hover:border-2 hover:border-black"
        variant="secondary"
        onClick={() =>
          stopwatchAction === "START"
            ? setStopwatchAction("PAUSE")
            : setStopwatchAction("START")
        }
      >
        {stopwatchAction === "START" ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <p className="text-xs">
        {hours} : {minutes.toString().padStart(2, "0")} :{" "}
        {seconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
});

StopWatch.displayName = "StopWatch";

export const NotesStyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  cursor: pointer;
  background-color: #61b3fa;
  color: #61b3fa;
  padding-bottom: 1px;
`;

const noteValueStyles = ({ isSelected }: { isSelected: boolean }) => css`
  font-size: 12px;
  color: ${isSelected ? "black" : "#61b3fa"};
  background-color: #61b3fa;
  ${!isSelected &&
  css`
    :hover {
      color: white;
      animation: fadeIn 0.5s linear;

      @keyframes fadeIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
  `}

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  transition: animation 0.5s fadeOut;
`;

export const NotesValue = styled.div`
  ${noteValueStyles}
`;

export interface NoteValue {
  value: number;
  isSelected: boolean;
}

const NotesWrapper: React.FC<{ noteValues: List<NoteValue> }> = ({
  noteValues,
}) => (
  <NotesStyledDiv>
    {noteValues.map((noteValue) => (
      <NotesValue
        className="flex items-center justify-center"
        isSelected={noteValue.isSelected}
        key={`note_${noteValue.value}`}
        onClick={() => (noteValue.isSelected = !noteValue.isSelected)}
      >
        {noteValue.value}
      </NotesValue>
    ))}
  </NotesStyledDiv>
);

export interface Value {
  value: number | null;
  hasError: boolean;
  isOriginal: boolean;
  isSelectedBoardIndex: boolean;
  answer: number;
  noteValues: List<NoteValue>;
}

export const ValueMain = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const ValueContent = styled.div<{
  isOriginal: boolean;
  hasError: boolean;
}>`
  transition: all 0.5s;
  display: flex;
  color: ${({ isOriginal, hasError }) =>
    isOriginal ? "black" : hasError ? "red" : "green"};
  font-weight: bold;
`;

const ValueWrapper: React.FC<Omit<Value, "noteValues">> = ({
  value,
  ...otherProps
}) => (
  <ValueMain>
    <ValueContent
      className={`${lora.className} items-center justify-center text-2xl`}
      {...otherProps}
    >
      {value}
    </ValueContent>
  </ValueMain>
);

export interface SudokuSquareProps {
  selectedColumnIndex: Maybe<number>;
  selectedRowIndex: Maybe<number>;
  selectedBoardIndex: Maybe<number>;
  rowIndex: number;
  boardIndex: number;
  index: number;
  value: Value;
  initialValue: Value;
  setSelectedBoardIndices: (values: {
    selectedBoardIndex: number;
    selectedColumnIndex: number;
    selectedRowIndex: number;
  }) => void;
  notesOn: boolean;
  isConflictSquare: boolean;
  isHint: boolean;
}

const outerDivStyles = ({
  isThickRight,
  isLastColumn,
  isThickBottom,
  isLastRow,
  isSelected,
  isShowingNotes,
  isConflictSquare,
  isSelectedBoardIndex,
  isHint,
}: {
  isThickRight: boolean;
  isSelected: boolean;
  isThickBottom: boolean;
  isLastColumn: boolean;
  isLastRow: boolean;
  isSelectedBoardIndex: boolean;
  isShowingNotes: boolean;
  isConflictSquare: boolean;
  isHint: boolean;
}) =>
  isHint
    ? css`
        @keyframes rotate {
          100% {
            transform: rotate(1turn);
          }
        }

        position: relative;
        z-index: 0;
        border-radius: 2px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

        &::before {
          content: "";
          position: absolute;
          z-index: -2;
          left: -50%;
          top: -50%;
          width: 200%;
          height: 200%;
          background-color: #399953;
          background-repeat: no-repeat;
          background-size: 50% 50%, 50% 50%;
          background-position: 0 0, 100% 0, 100% 100%, 0 100%;
          background-image: linear-gradient(#399953, #399953),
            linear-gradient(#fbb300, #fbb300), linear-gradient(#d53e33, #d53e33),
            linear-gradient(#377af5, #377af5);
          animation: rotate 4s linear infinite;
        }

        &::after {
          content: "";
          position: absolute;
          z-index: -1;
          left: 6px;
          top: 6px;
          width: calc(100% - 12px);
          height: calc(100% - 12px);
          background: white;
          border-radius: 5px;
        }

        border-right: ${isThickRight
          ? `solid 4px #000`
          : isLastColumn
          ? ""
          : "solid 1px #000"};
        border-bottom: ${isThickBottom
          ? `solid 4px #000`
          : isLastRow
          ? ""
          : "solid 1px #000"};
        &:hover {
          cursor: "pointer";
          background-color: rgba(28, 28, 28, 0.5);
        }
        background-color: ${isConflictSquare
          ? "rgba(226, 26, 12, 0.25)"
          : isShowingNotes
          ? "rgba(11, 53, 207, 0.25)"
          : isSelectedBoardIndex
          ? ""
          : isSelected
          ? "rgba(28, 28, 28, 0.25)"
          : ""};
        animation: ${isConflictSquare ? "bounceZoom 0.5s ease-in-out" : ""};
      `
    : css`
        position: relative;
        border-right: ${isThickRight
          ? `solid 4px #000`
          : isLastColumn
          ? ""
          : "solid 1px #000"};
        border-bottom: ${isThickBottom
          ? `solid 4px #000`
          : isLastRow
          ? ""
          : "solid 1px #000"};
        &:hover {
          cursor: "pointer";
          background-color: rgba(28, 28, 28, 0.5);
        }
        background-color: ${isConflictSquare
          ? "rgba(226, 26, 12, 0.25)"
          : isShowingNotes
          ? "rgba(11, 53, 207, 0.25)"
          : isSelectedBoardIndex
          ? ""
          : isSelected
          ? "rgba(28, 28, 28, 0.25)"
          : ""};
      `;

const OuterContainer = styled.div`
  ${outerDivStyles}
`;

const SudokuSquare: React.FC<SudokuSquareProps> = ({
  selectedColumnIndex: selectedIndex,
  selectedRowIndex,
  selectedBoardIndex,
  rowIndex,
  boardIndex,
  index,
  value,
  initialValue,
  setSelectedBoardIndices,
  notesOn,
  isConflictSquare,
  isHint,
}) => {
  const isShowingNotes =
    notesOn &&
    (value.noteValues.some((noteValue) => noteValue.isSelected) ||
      (value.value === null && selectedBoardIndex === boardIndex));
  return (
    <OuterContainer
      className="sm:w-14 sm:h-14 w-8 h-8 rainbow"
      isSelected={selectedIndex === index || rowIndex === selectedRowIndex}
      isLastColumn={index === 8}
      isLastRow={rowIndex === 8}
      isThickRight={index === 2 || index === 5}
      isThickBottom={rowIndex === 2 || rowIndex === 5}
      isSelectedBoardIndex={selectedBoardIndex === boardIndex}
      isConflictSquare={isConflictSquare}
      isShowingNotes={isShowingNotes}
      isHint={isHint}
      onClick={() => {
        setSelectedBoardIndices({
          selectedColumnIndex: index,
          selectedRowIndex: rowIndex,
          selectedBoardIndex: boardIndex,
        });
      }}
    >
      {isShowingNotes ? (
        <NotesWrapper noteValues={value.noteValues} />
      ) : (
        <ValueWrapper
          answer={initialValue.answer}
          hasError={value.hasError}
          isOriginal={value.isOriginal}
          isSelectedBoardIndex={selectedBoardIndex === boardIndex}
          value={value?.value || initialValue.value}
        />
      )}
    </OuterContainer>
  );
};

SudokuSquare.displayName = "SudokuSquare";

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

type HistoryState = {
  values: List<Value>;
  selectedBoardIndex: number | null;
  selectedColumnIndex: number | null;
  selectedRowIndex: number | null;
  conflictBoardIndices: Set<number>;
  difficulty: Difficulty;
  hintIndex: number | null;
  notesOn: boolean;
};

type ReducerState = HistoryState & {
  history: List<HistoryState>;
  stopwatchAction: StopWatchAction;
  hintCount: number;
  isSolved: boolean;
  numMistakes: number;
  board: List<List<Value>>;
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
      type: "RESET";
      difficulty: Difficulty;
    }
  | {
      type: "SET_WATCH_ACTION";
      stopwatchAction: StopWatchAction;
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
      type: "HINT";
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
  switch (action.type) {
    case "SET_VALUE":
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
    case "UNDO":
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
    case "RESET":
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
        stopwatchAction: "RESET",
        notesOn: false,
        hintCount: HINT_COUNT[difficulty],
        isSolved: false,
        numMistakes: 0,
      };
    case "SET_WATCH_ACTION":
      const { stopwatchAction } = action;
      return { ...state, stopwatchAction };
    case "SUBMIT":
      return {
        ...state,
        values: state.values.map((value) => ({
          ...value,
          value: value.answer,
          errorMessage: undefined,
        })),
        isSolved: true,
        hintIndex: null,
        stopwatchAction: "PAUSE",
        conflictBoardIndices: Set(),
      };
    case "TOGGLE_NOTES":
      return { ...state, notesOn: !state.notesOn, hintIndex: null };
    case "INIT_SODUKU":
      return {
        ...state,
        values: action.values,
        board: action.board,
        isSolved: false,
        numMistakes: 0,
      };
    case "SET_INDICES":
      const { selectedColumnIndex, selectedRowIndex } = action;
      return {
        ...state,
        hintIndex: null,
        selectedBoardIndex: action.selectedBoardIndex,
        selectedColumnIndex,
        selectedRowIndex,
      };
    case "HINT":
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
        }
      } else {
        toast.error("No more hints available", {
          className: "bold",
          description: "No more hints available",
          duration: 5000,
        });
      }
    default:
      throw new Error("Invalid action");
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
    stopwatchAction: "NOT_STARTED",
    hintCount: HINT_COUNT["easy"],
    isSolved: false,
    numMistakes: 0,
  });
  const difficulties = React.useRef<Difficulty[]>([
    "easy",
    "medium",
    "hard",
    "expert",
  ]);

  React.useEffect(() => {
    const { values, board } = getBoard(state.difficulty);
    dispatch({ type: "INIT_SODUKU", values, board });
  }, [state.difficulty]);

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
      if (typeof value == "string") {
        switch (value) {
          case "submit":
            dispatch({ type: "SUBMIT" });
            break;
          case "reset":
            dispatch({ type: "RESET", difficulty: state.difficulty });
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
      } else {
        dispatch({ type: "SET_VALUE", value });
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

  console.log("Sudoku rendered");

  return (
    <div>
      <Header titleHeading="SUDOKU" />
      <div className="flex justify-center items-center bg-slate-50 h-screen">
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
                <StopWatch
                  stopwatchAction={state.stopwatchAction}
                  setStopwatchAction={(stopwatchAction) =>
                    dispatch({ type: "SET_WATCH_ACTION", stopwatchAction })
                  }
                />
                <RadioGroup
                  defaultValue="easy"
                  onValueChange={(value) =>
                    dispatch({ type: "RESET", difficulty: value as Difficulty })
                  }
                >
                  {difficulties.current.map((difficulty, index) => (
                    <div
                      className="flex items-center space-x-1"
                      key={`radiogroup-${difficulty}-${index}`}
                      id={`radiogroup-${difficulty}-${index}`}
                    >
                      <RadioGroupItem value={difficulty} />
                      <Label
                        htmlFor={`radiogroup-${difficulty}-${index}`}
                        className="text-[10px]"
                      >
                        {difficulty.toUpperCase()}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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
