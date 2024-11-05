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

type Maybe<T> = T | null | undefined;

export function getBoard(difficulty: Difficulty) {
  const sudoku = getSudoku(difficulty);
  const values = sudoku.puzzle.split("").map((value, index) => ({
    value: value === "-" ? null : parseInt(value, 10),
    hasError: false,
    isOriginal: value !== "-",
    answer: parseInt(sudoku.solution[index], 10),
    isSelectedBoardIndex: false,
    isHighlighted: false,
    smaller: false,
  }));
  return {
    values,
    board: Array.from({ length: 9 }, (_, i) => values.slice(i * 9, i * 9 + 9)),
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
  hasError: boolean;
  isOriginal: boolean;
  isHighlighted: boolean;
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

const ValueWrapper: React.FC<Value> = ({ value, ...otherProps }) => (
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
  selectedIndex: Maybe<number>;
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
    selectedIndex: number;
    selectedRowIndex: number;
  }) => void;
  answer: number;
  hide: boolean;
  notes: number[];
  hasError: boolean;
}

const OuterContainer = styled.div<{
  isThickRight: boolean;
  isSelected: boolean;
  isThickBottom: boolean;
  isLastColumn: boolean;
  isLastRow: boolean;
  isSelectedBoardIndex: boolean;
}>(
  ({
    isThickRight,
    isLastColumn,
    isThickBottom,
    isLastRow,
    isSelected,
    isSelectedBoardIndex,
  }) => ({
    position: "relative",
    borderRight: isThickRight
      ? `solid 4px #000`
      : isLastColumn
      ? ""
      : "solid 1px #000",
    borderBottom: isThickBottom
      ? `solid 4px #000`
      : isLastRow
      ? ""
      : "solid 1px #000",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "rgba(28, 28, 28, 0.5)",
    },
    "&:after": {
      content: '""',
      backgroundColor: isSelectedBoardIndex
        ? ""
        : isSelected
        ? "rgba(28, 28, 28, 0.25)"
        : "",
    },
  })
);

const SudokuSquare: React.FC<SudokuSquareProps> = ({
  selectedIndex,
  selectedRowIndex,
  selectedBoardIndex,
  rowIndex,
  boardIndex,
  index,
  value,
  initialValue,
  setSelectedBoardIndices,
  answer,
  hide,
  notes,
  hasError,
}) => {
  const isHighlighted = () => {
    return selectedIndex === index || rowIndex === selectedRowIndex;
  };

  return (
    <OuterContainer
      className="sm:w-14 sm:h-14 w-8 h-8 after:content-[] absolute"
      isSelected={isHighlighted()}
      isLastColumn={index === 8}
      isLastRow={rowIndex === 8}
      isThickRight={index === 2 || index === 5}
      isThickBottom={rowIndex === 2 || rowIndex === 5}
      isSelectedBoardIndex={selectedBoardIndex === boardIndex}
      onClick={() => {
        setSelectedBoardIndices({
          selectedIndex: index,
          selectedRowIndex: rowIndex,
          selectedBoardIndex: boardIndex,
        });
      }}
    >
      {hide ? null : notes.length ? (
        <NotesWrapper values={notes} isOriginal={value.isOriginal} />
      ) : (
        <ValueWrapper
          answer={answer}
          hasError={hasError}
          isOriginal={value.isOriginal}
          isHighlighted={isHighlighted()}
          isSelectedBoardIndex={selectedBoardIndex === boardIndex}
          value={value.value || initialValue.value}
          smaller={notes.length > 0}
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

export const Sudoku: React.FC<SudokuProps> = ({ hide }) => {
  const [values, setValues] = React.useState<Value[]>([]);
  const [selectedBoardIndex, setSelectedBoardIndex] = React.useState<
    number | null
  >(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = React.useState<number | null>(
    null
  );
  const [board, setBoard] = React.useState<Value[][]>([]);
  const difficulties = React.useRef<Difficulty[]>([
    "easy",
    "medium",
    "hard",
    "expert",
  ]);
  const [difficulty, setDifficulty] = React.useState<Difficulty>("easy");
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
    const newValues = [...values];
    newValues[boardIndex] = value;
    setValues(newValues);
  };

  const setSelectedBoardIndices = ({
    selectedIndex,
    selectedRowIndex,
    selectedBoardIndex,
  }: {
    selectedIndex: number;
    selectedRowIndex: number;
    selectedBoardIndex: number;
  }) => {
    setSelectedIndex(selectedIndex);
    setSelectedRowIndex(selectedRowIndex);
    setSelectedBoardIndex(selectedBoardIndex);
  };

  const buildRow = (rowIndex: number) =>
    function SudokuRow(value: Value, index: number) {
      const boardIndex = getBoardIndex(rowIndex, index);
      const val = values[boardIndex];

      return (
        <SudokuSquare
          key={`${difficulty}-${rowIndex}-${index}`}
          value={val}
          hasError={values[boardIndex]?.hasError}
          initialValue={value}
          answer={value.answer}
          rowIndex={rowIndex}
          boardIndex={boardIndex}
          index={index}
          hide={hide}
          selectedIndex={selectedIndex}
          selectedRowIndex={selectedRowIndex}
          selectedBoardIndex={selectedBoardIndex}
          setSelectedBoardIndices={setSelectedBoardIndices}
          setValue={setValue}
          notes={[]}
        />
      );
    };

  buildRow.displayName = "buildRow";

  const buildBoard = (rowValues: Value[], rowIndex: number) => (
    <Board key={rowIndex}>{rowValues.map(buildRow(rowIndex))}</Board>
  );

  const handleReset = () => {
    const { values, board } = getBoard(difficulty);
    setValues(values);
    setBoard(board);
    reset();
  };

  const handleButtonPress = (value: ButtonValue) => {
    if (typeof value == "string") {
      if (value === "check") {
        // Check if the board is correct
        const isBoardCorrect = values.every(
          (value) => value.answer === value.value
        );
        console.log("yay", isBoardCorrect);
        // set the board to correct

        // if (!isBoardCorrect) {
        //   setValues(
        //     values.map((value) => ({
        //       ...value,
        //       hasError: value.value !== value.answer,
        //     }))
        //   );
        // }
        setValues(
          values.map((value) => ({
            ...value,
            value: value.answer,
            hasError: false,
          }))
        );
      } else if (value == "reset") {
        handleReset();
      }
    } else {
      if (selectedBoardIndex === null) {
        return;
      }

      const selectedValue = values[selectedBoardIndex];
      if (selectedValue.isOriginal) {
        return;
      }

      if (typeof value === "number") {
        setValue(selectedBoardIndex, {
          ...selectedValue,
          value,
          hasError: selectedValue.hasError && selectedValue.answer !== value,
        });
      }
    }
  };

  return (
    <div>
      <span className="text-3xl">🐧 Pepi Pepi&apos;s Sudoku 🐧</span>
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
        <ButtonBar onClick={handleButtonPress} />
      </div>
      <span className="justify-end italic">
        made with love, by yours truly ❤️
      </span>
    </div>
  );
};

Sudoku.displayName = "Sudoku";
