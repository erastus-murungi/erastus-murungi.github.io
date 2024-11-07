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
import ConfettiExplosion from "react-confetti-explosion";
import { toast } from "sonner";
import { List, Set } from "immutable";
import { css } from "@emotion/react";

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
          background-color: "rgba(28, 28, 28, 0.5)";
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
          background-color: "rgba(28, 28, 28, 0.5)";
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

type State = {
  values: List<Value>;
  selectedBoardIndex: number | null;
  selectedColumnIndex: number | null;
  selectedRowIndex: number | null;
  difficulty: Difficulty;
  conflictBorderIndices: Set<number>;
  hintIndex: number | null;
  notesOn: boolean;
};

export const Sudoku: React.FC<SudokuProps> = ({ hide }) => {
  const [values, setValues] = React.useState<List<Value>>(List());
  const [selectedBoardIndex, setSelectedBoardIndex] = React.useState<
    number | null
  >(null);
  const [selectedColumnIndex, setSelectedColumnIndex] = React.useState<
    number | null
  >(null);
  const [selectedRowIndex, setSelectedRowIndex] = React.useState<number | null>(
    null
  );
  const [numMistakes, setNumMistakes] = React.useState(0);
  const [board, setBoard] = React.useState<List<List<Value>>>(List());
  const difficulties = React.useRef<Difficulty[]>([
    "easy",
    "medium",
    "hard",
    "expert",
  ]);
  const [difficulty, setDifficulty] = React.useState<Difficulty>("easy");
  const [isSolved, setIsSolved] = React.useState(false);
  const [conflictBorderIndices, setConflictBorderIndices] = React.useState<
    Set<number>
  >(Set());
  const [hintIndex, setHintIndex] = React.useState<number | null>(null);
  const history = React.useRef<List<State>>(List());
  const [notesOn, setNotesOn] = React.useState(false);

  const hintCount = React.useRef(HINT_COUNT[difficulty]);
  React.useEffect(() => {
    if (hintIndex === null || difficulty) {
      hintCount.current = HINT_COUNT[difficulty];
    } else {
      hintCount.current -= 1;
    }
  }, [hintIndex, difficulty]);

  const { seconds, minutes, hours, isRunning, pause, start, reset } =
    useStopwatch({
      autoStart: true,
    });

  React.useEffect(() => {
    const { values, board } = getBoard(difficulty);
    setValues(values);
    setBoard(board);
  }, [difficulty]);

  const getBoardIndex = (rowIndex: number, index: number) =>
    rowIndex * 9 + index;

  const setValue = (boardIndex: number, value: Value) => {
    const newValues = values.set(boardIndex, value);
    setValues(newValues);
  };

  const setSelectedBoardIndices = ({
    selectedColumnIndex,
    selectedRowIndex,
    selectedBoardIndex,
  }: {
    selectedColumnIndex: number;
    selectedRowIndex: number;
    selectedBoardIndex: number;
  }) => {
    setSelectedColumnIndex(selectedColumnIndex);
    setSelectedRowIndex(selectedRowIndex);
    setSelectedBoardIndex(selectedBoardIndex);
  };

  const buildRow = (rowIndex: number) =>
    function SudokuRow(value: Value, index: number) {
      const boardIndex = getBoardIndex(rowIndex, index);
      const val = values.get(boardIndex);

      if (!val) {
        return null;
      }

      return (
        <SudokuSquare
          key={`${difficulty}-${rowIndex}-${index}`}
          value={val}
          initialValue={value}
          rowIndex={rowIndex}
          boardIndex={boardIndex}
          index={index}
          selectedColumnIndex={selectedColumnIndex}
          selectedRowIndex={selectedRowIndex}
          selectedBoardIndex={selectedBoardIndex}
          notesOn={notesOn}
          setSelectedBoardIndices={setSelectedBoardIndices}
          isConflictSquare={conflictBorderIndices.has(boardIndex)}
          isHint={hintIndex === boardIndex}
        />
      );
    };

  buildRow.displayName = "buildRow";

  const buildBoard = (rowValues: List<Value>, rowIndex: number) => (
    <Board key={rowIndex}>{rowValues.map(buildRow(rowIndex))}</Board>
  );

  const resetAllValues = () => {
    const newValues = values.map((value) => ({
      ...value,
      ...(value.isOriginal ? { value: value.answer } : { value: null }),
      errorMessage: undefined,
    }));
    setValues(newValues);
  };

  const handleUndo = () => {
    const lastState = history.current.last();
    if (lastState) {
      setValues(lastState.values);
      setSelectedBoardIndex(lastState.selectedBoardIndex);
      setSelectedColumnIndex(lastState.selectedColumnIndex);
      setSelectedRowIndex(lastState.selectedRowIndex);
      setDifficulty(lastState.difficulty);
      setConflictBorderIndices(lastState.conflictBorderIndices);
      setNotesOn(lastState.notesOn);
      history.current = history.current.pop();
    }
  };

  const handleReset = () => {
    resetAllValues();
    setBoard(board);
    reset();
    setNumMistakes(0);
    setConflictBorderIndices(Set());
    setSelectedBoardIndex(null);
    setSelectedColumnIndex(null);
    setSelectedRowIndex(null);
    setIsSolved(false);
    setHintIndex(null);
    setNotesOn(false);
    hintCount.current = HINT_COUNT[difficulty];
  };

  const handleResetNewDifficulty = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
    handleReset();
    setHintIndex(null);
    hintCount.current = HINT_COUNT[difficulty];
  };

  const validateBoardAfterEntry = (toCheck: number) => {
    const conflictBoardIndices = [];
    if (selectedRowIndex != null) {
      for (let offset = 0; offset < 9; offset++) {
        const boardIndex = selectedRowIndex * 9 + offset;
        const boardValue = values.get(boardIndex);
        if (boardValue?.value === toCheck) {
          conflictBoardIndices.push(boardIndex);
        }
      }
      if (selectedColumnIndex != null) {
        for (const [boardIndex, value] of values.entries()) {
          if (boardIndex % 9 === selectedColumnIndex) {
            if (value.value === toCheck) {
              conflictBoardIndices.push(boardIndex);
            }
          }
        }

        const gridRowIndex = selectedRowIndex - (selectedRowIndex % 3);
        const gridColumnIndex = selectedColumnIndex - (selectedColumnIndex % 3);
        for (let colOffset = 0; colOffset < 3; colOffset++) {
          for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
            const boardIndex = getBoardIndex(
              gridRowIndex + rowOffset,
              gridColumnIndex + colOffset
            );
            const boardValue = values.get(boardIndex);
            if (boardValue?.value === toCheck) {
              conflictBoardIndices.push(boardIndex);
            }
          }
        }
      }
    }
    return conflictBoardIndices.length > 0 ? Set(conflictBoardIndices) : null;
  };

  const handleCheck = () => {
    setValues(
      values.map((value) => ({
        ...value,
        value: value.answer,
        errorMessage: undefined,
      }))
    );

    setIsSolved(true);
    setHintIndex(null);
    setConflictBorderIndices(Set());
  };

  const handleHint = () => {
    if (hintCount.current <= 0) {
      toast.error("Bebi Bebi 🐧", {
        className: "bold",
        description:
          "No more hints available for Bebi Bebi 🐧. Nisuke nikuongezee 😉",
        duration: 5000,
      });
      return;
    }
    const hintIndex = generateHint(values);
    if (hintIndex !== undefined) {
      const hint = values.get(hintIndex);
      if (hint !== undefined) {
        setValue(hintIndex, {
          ...hint,
          hasError: false,
          value: hint.answer,
        });
        setHintIndex(hintIndex);
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
  };

  const handleButtonPress = (value: ButtonValue) => {
    setHintIndex(null);
    if (typeof value == "string") {
      if (value == "check") {
        handleCheck();
      } else if (value == "reset") {
        handleReset();
      } else if (value == "undo") {
        handleUndo();
      } else if (value == "hint") {
        handleHint();
      } else if (value == "toggle-notes") {
        setNotesOn(!notesOn);
      }
    } else {
      if (selectedBoardIndex === null) {
        return;
      }

      const selectedValue = values.get(selectedBoardIndex);
      if (selectedValue?.isOriginal) {
        return;
      }

      console.log(history.current);

      if (selectedValue && typeof value === "number") {
        if (selectedValue.value === value) {
          setConflictBorderIndices(Set());
          setValue(selectedBoardIndex, {
            ...selectedValue,
            value: null,
            hasError: false,
          });
        } else {
          const conflictBoardIndices = validateBoardAfterEntry(value);
          if (conflictBoardIndices) {
            setConflictBorderIndices(conflictBoardIndices);
            setNumMistakes(numMistakes + 1);
          }

          history.current = history.current.push({
            values,
            selectedBoardIndex,
            selectedColumnIndex,
            selectedRowIndex,
            difficulty,
            conflictBorderIndices,
            hintIndex,
            notesOn,
          });
          setValue(selectedBoardIndex, {
            ...selectedValue,
            value,
            answer: selectedValue.answer,
            hasError: conflictBoardIndices !== null,
          });
        }
      }
    }
  };

  return (
    <div className="m-8 inline-flex justify-center items-center flex-row">
      {isSolved && (
        <div className="inline-flex justify-center">
          <ConfettiExplosion particleCount={100} duration={3000} />
        </div>
      )}
      <div className="items-center justify-center inline-flex sm:flex-row flex-col">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row">
            <div className="items-stretch inline-flex justify-stretch flex-row">
              <span className="text-3xl">🐧 Pepi Pepi&apos;s Sudoku 🐧</span>
            </div>
          </div>
          <Main className="border-4 border-black mt-2 mr-4">
            {board.map(buildBoard)}
          </Main>
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
              <p className="text-xs text-gray-700 ">{numMistakes}</p>
            </div>
            <div className="inline-flex flex-row justify-end items-center space-x-2">
              <Button
                className="rounded-full w-4 h-4 hover:border-2 hover:border-black"
                variant="secondary"
                onClick={isRunning ? pause : start}
              >
                {isRunning ? <PauseIcon /> : <PlayIcon />}
              </Button>
              <p className="text-xs">
                {hours} : {minutes.toString().padStart(2, "0")} :{" "}
                {seconds.toString().padStart(2, "0")}
              </p>
            </div>
            <RadioGroup
              defaultValue="easy"
              onValueChange={(value) =>
                handleResetNewDifficulty(value as Difficulty)
              }
            >
              {difficulties.current.map((difficulty, index) => (
                <div className="flex items-center space-x-1">
                  <RadioGroupItem
                    value={`radiogroup-${difficulty}-${index}`}
                    id={`radiogroup-${difficulty}-${index}`}
                  />
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
            notesOn={notesOn}
            hintsRemaining={hintCount.current}
          />
        </div>
      </div>
    </div>
  );
};

Sudoku.displayName = "Sudoku";
