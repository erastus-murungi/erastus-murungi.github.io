"use client";

import React from "react";
import styled from "@emotion/styled";
import { lora } from "@/styles/fonts";
import { type Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { ButtonBar, type ButtonValue } from "./button-bar";
import { getSudoku } from "sudoku-gen";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { useStopwatch } from "react-timer-hook";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfettiExplosion from "react-confetti-explosion";
import { toast } from "sonner";
import { List } from "immutable";
import { css } from "@emotion/react";

type Maybe<T> = T | null | undefined;

const HINT_COUNT: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
  expert: 3,
};

const generateHint = (values: List<Value>, difficulty: Difficulty) => {
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
    isOriginal: value !== "-",
    answer: parseInt(sudoku.solution[index], 10),
    isSelectedBoardIndex: false,
    smaller: false,
  }));
  return {
    values: List(values),
    board: List(
      Array.from({ length: 9 }, (_, i) => List(values.slice(i * 9, i * 9 + 9)))
    ),
  };
}

export const NotesStyledDiv = styled.div`
  display: flex;
  align-items: top left;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  flex-flow: row wrap;
  align-content: flex-start;
  width: 100%;
  height: 100%;
`;

export const NotesValue = styled.span<{ isOriginal: boolean }>`
  transition: all 0.5s;
  font-family: "Titillium Web", sans-serif;
  font-weight: bold;
  font-size: 15px;
  color: ${({ isOriginal }) => (isOriginal ? "#blue" : "#black")};
`;

export interface NotesProps {
  values: number[];
  isOriginal: boolean;
}

const NotesWrapper: React.FC<NotesProps> = ({ values }) => (
  <NotesStyledDiv>
    {values.map((val) => (
      <NotesValue isOriginal key={`note_${val}`}>
        {val}
      </NotesValue>
    ))}
  </NotesStyledDiv>
);

export interface Value {
  value: number | null;
  errorMessage?: string;
  isOriginal: boolean;
  isSelectedBoardIndex: boolean;
  smaller: boolean;
  answer: number;
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
    isOriginal ? "blue" : hasError ? "red" : "black"};
  font-weight: bold;
`;

const ValueWrapper: React.FC<
  Omit<Value, "errorMessage"> & { hasError: boolean }
> = ({ value, ...otherProps }) => (
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
  setValue: (boardIndex: number, value: Value) => void;
  initialValue: Value;
  setSelectedBoardIndices: (values: {
    selectedBoardIndex: number;
    selectedColumnIndex: number;
    selectedRowIndex: number;
  }) => void;
  hide: boolean;
  notes: number[];
  isConflictSquare: boolean;
  isHint: boolean;
}

const outerDivStyles = ({
  isThickRight,
  isLastColumn,
  isThickBottom,
  isLastRow,
  isSelected,
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
  hide,
  notes,
  isConflictSquare,
  isHint,
}) => {
  React.useEffect(() => {
    if (value.errorMessage) {
      toast.error("My toast", {
        className: `${lora.className} bold`,
        description: value.errorMessage,
        duration: 5000,
      });
    }
  }, [value.errorMessage]);

  if (isConflictSquare) console.log("isConflictSquare----", isConflictSquare);

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
      isHint={isHint}
      onClick={() => {
        setSelectedBoardIndices({
          selectedColumnIndex: index,
          selectedRowIndex: rowIndex,
          selectedBoardIndex: boardIndex,
        });
      }}
    >
      {hide ? null : notes.length ? (
        <NotesWrapper values={notes} isOriginal={!value?.isOriginal} />
      ) : (
        <ValueWrapper
          answer={initialValue.answer}
          hasError={value?.errorMessage !== undefined}
          isOriginal={value.isOriginal}
          isSelectedBoardIndex={selectedBoardIndex === boardIndex}
          value={value?.value || initialValue.value}
          smaller={notes.length > 0}
        />
      )}
      <span className="top"></span>
      <span className="right"></span>
      <span className="bottom"></span>
      <span className="left"></span>
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
  conflictBorderIndex: number | null;
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
  const [conflictBorderIndex, setConflictBorderIndex] = React.useState<
    number | null
  >(null);
  const [hintCount, setHintCount] = React.useState(HINT_COUNT[difficulty]);
  const history = React.useRef<List<State>>(List());

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
          hide={hide}
          selectedColumnIndex={selectedColumnIndex}
          selectedRowIndex={selectedRowIndex}
          selectedBoardIndex={selectedBoardIndex}
          setSelectedBoardIndices={setSelectedBoardIndices}
          setValue={setValue}
          isConflictSquare={conflictBorderIndex === boardIndex}
          isHint={true}
          notes={[]}
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
      setConflictBorderIndex(lastState.conflictBorderIndex);
      history.current = history.current.pop();
    }
  };

  const handleReset = () => {
    resetAllValues();
    setBoard(board);
    reset();
    setNumMistakes(0);
    setConflictBorderIndex(null);
    setSelectedBoardIndex(null);
    setSelectedColumnIndex(null);
    setSelectedRowIndex(null);
    setIsSolved(false);
  };

  const validateBoardAfterEntry = (toCheck: number) => {
    if (selectedRowIndex != null) {
      for (let offset = 0; offset < 9; offset++) {
        const boardIndex = selectedRowIndex * 9 + offset;
        const boardValue = values.get(boardIndex);
        if (boardValue?.value === toCheck) {
          setNumMistakes(numMistakes + 1);
          return {
            errorMessage: `${toCheck} Already exists in the row pepi pepi 😢`,
            boardIndex,
          };
        }
      }
      if (selectedColumnIndex != null) {
        for (const [boardIndex, value] of values.entries()) {
          if (boardIndex % 9 === selectedColumnIndex) {
            if (value.value === toCheck) {
              setNumMistakes(numMistakes + 1);
              return {
                errorMessage: `${toCheck} Already exists in the column pepi pepi 😢`,
                boardIndex: boardIndex,
              };
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
              setNumMistakes(numMistakes + 1);
              return {
                errorMessage: `${toCheck} Already exists in the grid pepi pepi 😢`,
                boardIndex,
              };
            }
          }
        }
      }
    }
  };

  const handleButtonPress = (value: ButtonValue) => {
    if (typeof value == "string") {
      if (value === "check") {
        const isBoardCorrect = values.every(
          (value) => value.answer === value.value
        );
        setIsSolved(isBoardCorrect);

        setValues(
          values.map((value) => ({
            ...value,
            value: value.answer,
          }))
        );
      } else if (value == "reset") {
        handleReset();
      } else if (value == "undo") {
        handleUndo();
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
          setConflictBorderIndex(null);
          setValue(selectedBoardIndex, {
            ...selectedValue,
            value: null,
            errorMessage: undefined,
          });
        } else {
          const { errorMessage, boardIndex: conflictBoardIndex } =
            validateBoardAfterEntry(value) || {};
          setConflictBorderIndex(conflictBoardIndex ?? null);

          history.current = history.current.push({
            values,
            selectedBoardIndex,
            selectedColumnIndex,
            selectedRowIndex,
            difficulty,
            conflictBorderIndex,
          });

          setValue(selectedBoardIndex, {
            ...selectedValue,
            value,
            answer: selectedValue.answer,
            errorMessage,
          });
          if (conflictBoardIndex) {
            setConflictBorderIndex(conflictBoardIndex);
          }
        }
      }
    }
  };

  return (
    <div>
      <span className="text-3xl">🐧 Pepi Pepi&apos;s Sudoku 🐧</span>
      {isSolved && (
        <div className="inline-flex justify-center">
          <ConfettiExplosion particleCount={100} duration={3000} />
        </div>
      )}
      <div className="items-center justify-center">
        <div className="flex flex-row justify-between">
          <div className="inline-flex flex-row justify-end items-center space-x-2">
            <h1>
              {hours} : {minutes.toString().padStart(2, "0")} :{" "}
              {seconds.toString().padStart(2, "0")}
            </h1>
            <Button
              className="rounded-full w-8 h-8"
              variant="secondary"
              onClick={isRunning ? pause : start}
            >
              {isRunning ? <PauseIcon /> : <PlayIcon />}
            </Button>
          </div>
          <Select onValueChange={(value) => setDifficulty(value as Difficulty)}>
            <SelectTrigger className={`w-[150px]`}>
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Difficulty</SelectLabel>
                {difficulties.current.map((difficulty) => (
                  <SelectItem
                    className={`w-[150px]`}
                    key={difficulty}
                    value={difficulty}
                  >
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="items-center justify-center inline-flex sm:flex-row flex-col">
        <Main className="border-4 border-black mt-2 mr-4">
          {board.map(buildBoard)}
        </Main>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row">
            <p className="text-xs">Mistakes:&nbsp;</p>
            <p className="text-xs text-gray-700 ">{numMistakes}</p>
          </div>

          <ButtonBar onClick={handleButtonPress} />
        </div>
      </div>
      <span className="justify-end italic">
        made with love, by yours truly ❤️
      </span>
    </div>
  );
};

Sudoku.displayName = "Sudoku";
